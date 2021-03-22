<template>
  <main>
    <v-toolbar flat>
      <v-toolbar-title> Product Details </v-toolbar-title>
    </v-toolbar>
    <v-card max-width="800" class="mx-auto mt-5" rounded>
      <v-list-item v-for="(field, index) in productsFields" :key="index">
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
              field.text !== 'deleted_at' &&
              field.text !== 'category' &&
              field.text !== 'price' &&
              field.text !== 'pricing_method'
            "
          >
            {{ product[field.text] }}
          </v-list-item-title>

          <v-list-item-title v-if="field.text === 'deleted_at'">
            <v-chip v-if="product[field.text]" color="error">
              deleted At
              {{ product[field.text] }}</v-chip
            >
            <v-chip v-else color="success"> Active</v-chip>
          </v-list-item-title>
          <v-list-item-title v-if="field.text === 'category'">
            {{ product.category && product.category.name }}
          </v-list-item-title>
          <v-list-item-title v-if="field.text === 'price'">
            {{ product.price ? product.price : 0 }}
          </v-list-item-title>
          <v-list-item-title v-if="field.text === 'pricing_method'">
            {{ pricingMethods[product.pricing_method] }}
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
      product: {},
      pricingMethods: {
        1: "Fixed Price",
        2: "Open Price",
      },
      productsFields: [
        { text: "name", icon: "mdi-account" },
        { text: "sku", icon: "mdi-bottle-tonic-skull-outline" },
        { text: "category", icon: "mdi-cast-education" },
        { text: "pricing_method", icon: "mdi-checkbox-blank-outline" },
        { text: "price", icon: "mdi-checkbox-multiple-blank-circle" },
        { text: "deleted_at", icon: "mdi-account-clock" },
      ],
    };
  },
  methods: {
    async getProductDetails() {
      const res = await this.axios.get(`/products/${this.$route.params.id}`, {
        params: { include: "category" },
      });
      const { data } = res.data;

      this.product = data;
    },
  },
  watch: {
    $route: {
      handler() {
        this.getProductDetails();
      },
      immediate: true,
    },
  },
};
</script>

