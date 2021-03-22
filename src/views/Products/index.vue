<template>
  <main>
    <v-toolbar flat>
      <v-toolbar-title>Products</v-toolbar-title>
      <v-spacer />
      <v-btn @click="dialog = !dialog" rounded class="primary" large>
        Create
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <!-- filter -->
    <GenericFilter :queries="queries" :dropDownQueryies="dropDownQueryies">
      <template v-slot="{ item }">
        <v-select
          label="Category"
          :items="categories"
          item-value="id"
          item-text="name"
          clearable
          @change="handleFilter(item)"
          @click:clear="handleClearFilter(item)"
          v-model="dropDownQueryies['category_id']"
          outlined
        ></v-select>
      </template>
    </GenericFilter>
    <!-- filter -->

    <!-- table -->
    <v-toolbar flat>
      <v-spacer />
    </v-toolbar>
    <v-data-table
      :loading="tableLoading"
      :items="items"
      :headers="headers"
      hide-default-footer
    >
      <template v-slot:item="{ item, index }">
        <tr>
          <td class="text-center">{{ item.name }}</td>
          <td class="text-center">{{ item.sku }}</td>
          <td class="text-center">
            {{ item.price ? item.price : 0 }}
          </td>
          <td class="text-center">{{ item.category.name }}</td>
          <td class="text-center">
            <v-chip v-if="item.deleted_at" color="error"> Deleted </v-chip>
            <v-chip v-else color="success">Active</v-chip>
          </td>

          <td class="text-center">
            <v-switch
              :loading="toggleIndex === index && toggleLoading"
              @click="toggleActiveStatus(item, index)"
              v-model="item.is_active"
            ></v-switch>
          </td>

          <td class="text-center">
            <v-btn
              :disabled="item.deleted_at ? true : false"
              icon
              @click="handleEdit(item, index)"
            >
              <v-icon small title="edit">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              :disabled="item.deleted_at ? true : false"
              icon
              @click="handleDelete(item, index)"
            >
              <v-icon color="error" title="delete" small>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              :disabled="item.deleted_at ? false : true"
              icon
              @click="handleRestore(item)"
            >
              <v-icon color="primary" small title="Restore Product">
                mdi-backup-restore
              </v-icon>
            </v-btn>
            <v-btn icon :to="`/products/${item.id}`">
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
                <template v-for="(itemValue, formKey) in form">
                  <v-col cols="12" md="6" :key="formKey">
                    <v-text-field
                      v-if="
                        formKey !== 'price' &&
                        formKey !== 'cost' &&
                        formKey !== 'pricing_method' &&
                        formKey !== 'selling_method' &&
                        formKey !== 'costing_method' &&
                        formKey !== 'category_id'
                      "
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
                    <v-select
                      v-if="formKey === 'pricing_method'"
                      v-model="form[formKey]"
                      :data-vv-as="$t(`fields.${formKey}`)"
                      :data-vv-name="formKey"
                      v-validate="rules[formKey]"
                      :label="$t(`fields.${formKey}`)"
                      outlined
                      :items="pricingMethods"
                      item-text="method"
                      item-value="id"
                      ref="pricing_method"
                      :error-messages="
                        errors.first(formKey) ||
                        (serverErrors[formKey] && serverErrors[formKey][0])
                      "
                    ></v-select>
                    <v-select
                      v-if="formKey === 'selling_method'"
                      v-model="form[formKey]"
                      :data-vv-as="$t(`fields.${formKey}`)"
                      :data-vv-name="formKey"
                      v-validate="rules[formKey]"
                      :label="$t(`fields.${formKey}`)"
                      outlined
                      :items="sellingMethods"
                      item-text="method"
                      item-value="id"
                      :error-messages="
                        errors.first(formKey) ||
                        (serverErrors[formKey] && serverErrors[formKey][0])
                      "
                    ></v-select>
                    <v-select
                      v-if="formKey === 'costing_method'"
                      v-model="form[formKey]"
                      :data-vv-as="$t(`fields.${formKey}`)"
                      :data-vv-name="formKey"
                      v-validate="rules[formKey]"
                      :label="$t(`fields.${formKey}`)"
                      outlined
                      :items="costingMethods"
                      item-text="method"
                      item-value="id"
                      ref="costing_method"
                      :error-messages="
                        errors.first(formKey) ||
                        (serverErrors[formKey] && serverErrors[formKey][0])
                      "
                    ></v-select>
                    <v-select
                      v-if="formKey === 'category_id'"
                      v-model="form[formKey]"
                      :data-vv-as="$t(`fields.${formKey}`)"
                      :data-vv-name="formKey"
                      v-validate="rules[formKey]"
                      :label="$t(`fields.${formKey}`)"
                      outlined
                      :items="categories"
                      item-text="name"
                      item-value="id"
                      :error-messages="
                        errors.first(formKey) ||
                        (serverErrors[formKey] && serverErrors[formKey][0])
                      "
                    ></v-select>
                    <v-text-field
                      v-if="formKey === 'price' && form.pricing_method === 1"
                      v-model="form[formKey]"
                      :data-vv-as="$t(`fields.${formKey}`)"
                      :data-vv-name="formKey"
                      type="number"
                      v-validate="rules[formKey]"
                      :error-messages="
                        errors.first(formKey) ||
                        (serverErrors[formKey] && serverErrors[formKey][0])
                      "
                      :label="$t(`fields.${formKey}`)"
                      outlined
                    ></v-text-field>
                    <v-text-field
                      v-if="formKey === 'cost' && form.costing_method === 1"
                      v-model="form[formKey]"
                      :data-vv-as="$t(`fields.${formKey}`)"
                      :data-vv-name="formKey"
                      type="number"
                      v-validate="rules[formKey]"
                      :error-messages="
                        errors.first(formKey) ||
                        (serverErrors[formKey] && serverErrors[formKey][0])
                      "
                      :label="$t(`fields.${formKey}`)"
                      outlined
                    ></v-text-field>
                  </v-col>
                </template>
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

        >
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
  name: "Products",
  components: {
    GenericAlert: () => import("@/components/GenericAlert"),
    GenericFilter: () => import("@/components/GenericFilter"),
  },
  data: () => ({
    tableLoading: true,
    headers: [],
    items: [],
    categories: [],
    pagination: {},
    pricingMethods: [
      { id: 1, method: "Fixed Price" },
      { id: 2, method: "Open Price" },
    ],
    sellingMethods: [
      { id: 1, method: "Unit" },
      { id: 2, method: "Weight" },
    ],
    costingMethods: [
      { id: 1, method: "Fixed" },
      { id: 2, method: "From Ingredients" },
    ],
    form: {
      name: "",
      category_id: "",
      sku: "",
      pricing_method: "",
      selling_method: "",
      costing_method: "",
      price: "",
      cost: "",
    },
    rules: {
      name: "required",
      category_id: "required",
      sku: "required",
      pricing_method: "required",
      selling_method: "required",
      costing_method: "required",
      price: "required_if:pricing_method,1",
      cost: "required_if:costing_method,1",
    },
    isEdit: false,
    page: 1,
    pageCount: 0,
    alertDialog: false,
    loading: false,
    dialog: false,
    itemIndex: null,
    tableItem: {},
    queries: {
      name: "",
    },
    dropDownQueryies: {
      category_id: "",
    },
    toggleLoading: false,
    toggleIndex: null,
  }),

  methods: {
    async toggleActiveStatus(item, index) {
      this.toggleIndex = index;
      this.toggleLoading = true;
      await this.axios.put(`/products/${item.id}`, item);
      this.toggleLoading = false;
      this.toggleIndex = null;
    },
    handleFilter(filterName) {
      const query = {
        [`filter[${filterName}]`]: this.dropDownQueryies[filterName],
      };
      if (query[`filter[${filterName}]`]) {
        this.$router.push({ query: { ...this.$route.query, ...query } });
      }
    },
    handleClearFilter(clearedFilterName) {
      const query = { ...this.$route.query };
      delete query[`filter[${clearedFilterName}]`];
      this.$router.push({ query });
    },
    getCategories() {
      this.axios.get("/categories").then((res) => {
        const { data } = res.data;
        this.categories = data;
      });
    },
    handleRestore(item) {
      this.axios.put(`/products/${item.id}/restore`).then(() => {
        this.handleGetData();
      });
    },
    async showData() {
      const res = await this.axios.get(`/products/${this.tableItem.id}`, {
        params: {
          include: "category",
        },
      });
      const { data } = res.data;
      const {
        name,
        price,
        selling_method,
        costing_method,
        pricing_method,
        cost,
        category,
        sku,
      } = data;
      this.form = {
        name,
        category_id: category.id,
        sku,
        pricing_method,
        selling_method,
        costing_method,
        price,
        cost,
      };
    },
    async onDelete() {
      try {
        await this.axios.delete(`/products/${this.tableItem.id}`);
        this.handleGetData();
        this.alertDialog = false;
        if (this.itemIndex) this.itemIndex = null;
      } catch (error) {
        console.log(error);
      }
    },
    async createProduct(formData) {
      try {
        const res = await this.axios.post("/products", formData);
        const { data } = res.data;
        this.dialog = false;

        this.items.push(data);
      } finally {
        this.loading = false;
      }
    },
    async editProduct(formData) {
      try {
        const res = await this.axios.put(
          `/products/${this.tableItem.id}`,
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
      if (!this.isEdit) {
        // in case create
        this.createProduct(this.form);
      } else {
        // in case edit
        this.editProduct(this.form);
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
    async handleGetData(query) {
      const res = await this.axios.get("/products", {
        params: { ...query, include: "category" },
      });
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
        "SKU,",
        "Price",
        "Category",
        "Status",
        "Active",
        "Actions",
      ]);
    },
    inputType(formKey) {
      if (formKey === "price") {
        return "number";
      } else {
        return "text";
      }
    },
    handleEdit(item, index) {
      this.isEdit = true;
      this.dialog = !this.dialog;
      this.tableItem = item;
      this.itemIndex = index;
      this.showData();
    },

    handleDelete(item, index) {
      this.alertDialog = true;
      this.itemIndex = index;
      this.tableItem = item;
    },
    onDeleteSubmit() {
      this.onDelete();
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
    form: {
      handler(formValue) {
        if (formValue.pricing_method === 2) {
          this.form.price = "";
        }
        if (formValue.costing_method === 2) {
          this.form.cost = "";
        }
      },
      immediate: true,
      deep: true,
    },
    $route: {
      handler({ query }) {
        this.getCategories();
        this.handleGetData(query);
        for (const key in this.dropDownQueryies) {
          if (query[`filter[${key}]`]) {
            this.dropDownQueryies[key] = query[`filter[${key}]`];
          }
        }
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
    alertDialog: {
      handler(value) {
        if (!value) {
          state.serverErrors = {};
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