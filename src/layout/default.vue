<template>
  <main>
    <v-app-bar height="50" color="deep-purple accent-4" dark prominent>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      style="top: 50px; position: absolute"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      left
      :disable-resize-watcher="true"
    >
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item
            v-for="(link, index) in links"
            :key="index"
            :to="link.to"
          >
            <v-list-item-title>{{ link.name }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </main>
</template>

<script>
export default {
  name: "DefaultLayout",
  data: () => ({
    drawer: true,
    links: [
      {
        to: "/customers",
        name: "Customers",
      },
      {
        to: "/Categories",
        name: "categories",
      },
      {
        to: "/products",
        name: "Products",
      },
    ],
  }),
};
</script>
