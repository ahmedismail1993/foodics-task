<template>
  <main>
    <v-toolbar flat>
      <v-toolbar-title> Customer Details </v-toolbar-title>
    </v-toolbar>
    <v-card max-width="800" class="mx-auto mt-5" rounded>
      <v-list-item v-for="(field, index) in customerFields" :key="index">
        <v-list-item-avatar>
          <v-icon class="grey lighten-1" dark> {{ field.icon }} </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{
            $t(`fields.${field.text}`)
          }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-list-item-title
            v-if="
              field.text !== 'gender' &&
              field.text !== 'deleted_at' &&
              field.text !== 'birth_date' &&
              field.text !== 'last_order_at'
            "
          >
            {{ customer[field.text] }}
          </v-list-item-title>
          <v-list-item-title v-if="field.text === 'gender'">
            {{ genders[customer[field.text]] }}
          </v-list-item-title>
          <v-list-item-title v-if="field.text === 'deleted_at'">
            <v-chip v-if="customer[field.text]" color="error">
              deleted At
              {{ customer[field.text] }}</v-chip
            >
            <v-chip v-else color="success">not Deleted</v-chip>
          </v-list-item-title>
          <v-list-item-title v-if="field.text === 'last_order_at'">
            {{ customer[field.text] ? customer[field.text] : "no Order Yet" }}
          </v-list-item-title>
        </v-list-item-action>
      </v-list-item>
    </v-card>
  </main>
</template>

<script>
export default {
  name: "CustomerDetais",
  data() {
    return {
      customer: {},
      customerFields: [
        { text: "name", icon: "mdi-account" },
        { text: "email", icon: "mdi-email" },
        { text: "phone", icon: "mdi-phone" },
        { text: "order_count", icon: "mdi-account-convert" },
        { text: "gender", icon: "mdi-gender-transgender" },
        { text: "deleted_at", icon: "mdi-account-clock" },
        { text: "birth_date", icon: "mdi-account-clock" },
        { text: "last_order_at", icon: "mdi-account-clock" },
      ],
      genders: {
        1: "male",
        2: "female",
      },
    };
  },
  methods: {
    async getCustomerDetails() {
      const res = await this.axios.get(`/customers/${this.$route.params.id}`);
      const { data } = res.data;
      this.customer = data;
    },
  },
  watch: {
    $route: {
      handler() {
        this.getCustomerDetails();
      },
      immediate: true,
    },
  },
};
</script>

