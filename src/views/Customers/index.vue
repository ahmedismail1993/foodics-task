<template>
  <main>
    <v-toolbar flat>
      <v-toolbar-title>Customers</v-toolbar-title>
      <v-spacer />
      <v-btn @click="dialog = !dialog" rounded class="primary" large>
        Create
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <!-- filter -->
    <GenericFilter :queries="queries" />
    <!-- filter -->

    <!-- table -->
    <v-data-table
      :loading="tableLoading"
      :items="items"
      :headers="headers"
      hide-default-footer
    >
      <template v-slot:item="{ item, index }">
        <tr>
          <td class="text-center">{{ item.name }}</td>
          <td class="text-center">{{ item.email }}</td>
          <td class="text-center">{{ item.phone }}</td>
          <td class="text-center">
            {{ item.last_order_at ? item.last_order_at : "no order yet" }}
          </td>
          <td class="text-center">
            <v-chip v-if="item.deleted_at" color="error"> Deleted </v-chip>
            <v-chip v-else color="success"> Active </v-chip>
          </td>
          <td class="text-center">
            <v-btn
              :disabled="item.deleted_at && true"
              icon
              @click="handleEdit(item, index)"
            >
              <v-icon small title="edit">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              :disabled="item.deleted_at && true"
              icon
              @click="handleDelete(item, index)"
            >
              <v-icon color="error" title="delete" small>mdi-delete</v-icon>
            </v-btn>
            <v-btn icon @click="handleRestore(item)">
              <v-icon color="primary" small title="restore customer">
                mdi-backup-restore
              </v-icon>
            </v-btn>
            <v-btn icon :to="`/customers/${item.id}`">
              <v-icon color="info" small title="show Details">mdi-eye</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- pagination -->
    <v-pagination
      v-if="pagination.per_page > 50"
      class="mt-4"
      v-model="page"
      :length="pageCount"
    ></v-pagination>
    <!-- pagination -->
    <!-- table -->
    <!-- dialog -->
    <v-dialog max-width="800" v-model="dialog">
      <v-card flat>
        <v-card-title
          class="secondary font-weight-bold mb-4"
          style="color: #fff"
          >{{ dialogTitle }}</v-card-title
        >
        <v-card-text>
          <v-container>
            <v-form ref="form" @submit.prevent="handleSubmit">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  v-for="(itemValue, formKey) in form"
                  :key="formKey"
                >
                  <v-text-field
                    v-if="formKey !== 'gender'"
                    v-model="form[formKey]"
                    :data-vv-as="$t(`fields.${formKey}`)"
                    :data-vv-name="formKey"
                    v-validate="rules[formKey]"
                    :label="$t(`fields.${formKey}`)"
                    outlined
                    :type="inputType(formKey)"
                    :error-messages="
                      errors.first(formKey) ||
                      (serverErrors[formKey] && serverErrors[formKey][0])
                    "
                  ></v-text-field>
                  <template v-else>
                    <v-select
                      :data-vv-as="$t(`fields.${formKey}`)"
                      :data-vv-name="formKey"
                      v-validate="rules[formKey]"
                      outlined
                      item-text="text"
                      item-value="id"
                      label="Gender"
                      :items="genders"
                      v-model="form.gender"
                    ></v-select>
                  </template>
                </v-col>
                <v-col cols="12" md="10" class="mx-auto">
                  <v-btn
                    :disabled="invalid"
                    :loading="loading"
                    large
                    rounded
                    type="submit"
                    block
                    class="primary font-weight-bold"
                  >
                    Submit
                    <v-icon right>mdi-send</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- dialog -->
    <!-- alert -->
    <GenericAlert :alertDialog.sync="alertDialog">
      <template #body>
        <v-alert class="font-weight-bold" type="error">Are You Sure?</v-alert>
      </template>
      <template #footer>
        <v-col cols="12" md="10" class="mx-auto">
          <v-btn @click="onDeleteSubmit" class="error">Ok</v-btn>
          <v-btn @click="alertDialog = false" class="info mx-2">Cancel</v-btn>
        </v-col>
      </template>
    </GenericAlert>
    <!-- alert -->
  </main>
</template>

<script>
import tableHeadersGenerator from "@/utils/generateTableHeaders.js";
import state from "../../helpers/serverErrors";
export default {
  name: "Customers",
  components: {
    GenericAlert: () => import("@/components/GenericAlert"),
    GenericFilter: () => import("@/components/GenericFilter"),
  },
  data: () => ({
    tableLoading: true,
    headers: [],
    items: [],
    pagination: {},
    genders: [
      { text: "male", id: 1 },
      { text: "female", id: 2 },
    ],
    form: {
      name: "",
      email: "",
      dial_code: "",
      phone: "",
      gender: "",
    },
    rules: {
      name: "required",
      email: "required|email",
      dial_code: "required",
      phone: "required|numeric|min:9",
      gender: "required",
    },
    isEdit: false,
    page: 1,
    pageCount: 0,
    alertDialog: false,
    loading: false,
    dialog: false,
    itemIndex: null,
    customerItem: {},
    queries: {
      email: "",
      phone: "",
    },
  }),

  methods: {
    handleRestore(item) {
      this.axios.put(`/customers/${item.id}/restore`).then(() => {
        this.handleGetCustomers();
      });
    },
    async showCustomer() {
      const res = await this.axios.get(`/customers/${this.customerItem.id}`);
      const { data } = res.data;
      this.form = {
        name: data.name,
        email: data.email,
        dial_code: data.dial_code,
        phone: data.phone,
        gender: data.gender,
      };
    },
    async deleteCustomer() {
      try {
        await this.axios.delete(`/customers/${this.customerItem.id}`);
        this.handleGetCustomers();
        this.alertDialog = false;
        if (this.itemIndex) this.itemIndex = null;
      } catch (error) {
        console.log(error);
      }
    },
    async createCustomer(formData) {
      try {
        const res = await this.axios.post("/customers", formData);
        const { data } = res.data;
        this.dialog = false;
        this.items.push(data);
      } finally {
        this.loading = false;
      }
    },
    async editCustomer(formData) {
      try {
        const res = await this.axios.put(
          `/customers/${this.customerItem.id}`,
          formData
        );
        const { data } = res.data;
        this.$set(this.items, this.itemIndex, data);
        this.dialog = false;
      } finally {
        this.loading = false;
      }
    },
    handleSubmit() {
      this.loading = true;
      const formData = {
        ...this.form,
        dial_code: Number(this.form.dial_code),
      };
      if (!this.isEdit) {
        // in case create
        this.createCustomer(formData);
      } else {
        // in case edit
        this.editCustomer(formData);
      }
    },
    resetForm() {
      for (const key in this.form) {
        this.form[key] = "";
      }
      state.serverErrors = {};
      this.$nextTick(() => {
        this.errors.clear();
      });
    },
    async handleGetCustomers(query) {
      const res = await this.axios.get("/customers", { params: query });
      const { data, meta } = res.data;
      this.items = data;
      this.pagination = meta;
      this.page = meta.current_page;
      this.pageCount = meta.last_page;
      this.tableLoading = false;
    },
    handleTalbleHeaders() {
      this.headers = tableHeadersGenerator([
        "Name",
        "Email",
        "Phone",
        "Last Order Date",
        "Status",
        "Actions",
      ]);
    },
    inputType(formKey) {
      if (formKey === "email") {
        return "email";
      } else if (formKey === "phone" || formKey === "dial_code") {
        return "number";
      } else {
        return "text";
      }
    },
    handleEdit(item, index) {
      this.isEdit = true;
      this.dialog = !this.dialog;
      this.customerItem = item;
      this.itemIndex = index;
      this.showCustomer();
    },

    handleDelete(item, index) {
      this.alertDialog = true;
      this.itemIndex = index;
      this.customerItem = item;
    },
    onDeleteSubmit() {
      this.deleteCustomer();
    },
  },
  computed: {
    dialogTitle() {
      if (!this.isEdit) {
        return "Create";
      } else {
        return "Edit";
      }
    },
    invalid() {
      if (!this.isEdit) {
        return Object.keys(this.fields).some(
          (key) => this.fields[key].invalid || this.fields[key].invalid == null
        );
      } else {
        return Object.keys(this.form).some((key) => this.form[key] == "");
      }
    },
    serverErrors() {
      return state.serverErrors;
    },
  },
  mounted() {
    this.handleTalbleHeaders();
  },
  watch: {
    $route: {
      handler({ query }) {
        this.handleGetCustomers(query);
      },
      immediate: true,
    },
    dialog: {
      handler(value) {
        if (!value) {
          this.isEdit = false;
          this.alertDialog = false;
          this.resetForm();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style >
input[type="number"] {
  -moz-appearance: textfield;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>