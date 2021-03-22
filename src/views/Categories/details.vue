<template>
  <main>
    <v-toolbar flat>
      <v-toolbar-title> Categories Details </v-toolbar-title>
    </v-toolbar>
    <v-card max-width="800" class="mx-auto mt-5" rounded>
      <v-list-item v-for="(field, index) in categoriesFields" :key="index">
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
            {{ category[field.text] }}
          </v-list-item-title>

          <v-list-item-title v-if="field.text === 'deleted_at'">
            <v-chip v-if="category[field.text]" color="error">
              deleted At
              {{ category[field.text] }}</v-chip
            >
            <v-chip v-else color="success"> Active</v-chip>
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
      category: {},
      categoriesFields: [
        { text: "name", icon: "mdi-account" },
        { text: "reference", icon: "mdi-email" },
        { text: "deleted_at", icon: "mdi-account-clock" },
      ],
    };
  },
  methods: {
    async getCategoryDetails() {
      const res = await this.axios.get(`/categories/${this.$route.params.id}`);
      const { data } = res.data;
      this.category = data;
    },
  },
  watch: {
    $route: {
      handler() {
        this.getCategoryDetails();
      },
      immediate: true,
    },
  },
};
</script>

