<template>
  <v-expansion-panels v-model="panel" flat class="mb-4" accordion>
    <v-expansion-panel>
      <v-expansion-panel-header class="mr-5" disable-icon-rotate>
        <span class="font-weight-bold"> Filter By:</span>
        <template v-slot:actions>
          <v-icon color="info"> mdi-filter </v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="12" md="6" v-for="(value, key) in queries" :key="key">
            <v-text-field
              v-if="!isDropdown"
              @keypress.enter="handleFilter(key)"
              @click:clear="handleClearFilter(key)"
              clearable
              outlined
              :label="key"
              v-model="queries[key]"
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="6"
            v-for="(value, key) in dropDownQueryies"
            :key="key"
          >
            <slot :item="key" />
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "GenericFilter",
  props: {
    queries: {
      type: Object,
      default: () => {},
    },
    isDropdown: {
      type: Boolean,
      default: false,
    },
    dropDownQueryies: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    panel: 0,
  }),
  methods: {
    handleFilter(filterName) {
      const query = { [`filter[${filterName}]`]: this.queries[filterName] };
      if (query[`filter[${filterName}]`]) {
        this.$router.push({ query: { ...this.$route.query, ...query } });
      }
    },
    handleClearFilter(clearedFilterName) {
      const query = { ...this.$route.query };
      delete query[`filter[${clearedFilterName}]`];
      this.$router.push({ query });
    },
  },
  watch: {
    $route: {
      handler({ query }) {
        for (const key in this.queries) {
          if (query[`filter[${key}]`]) {
            this.queries[key] = query[`filter[${key}]`];
          }
        }
      },
      immediate: true,
    },
  },
};
</script>

