<template>
  <v-app>
    <Notification />
    <Layout />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {
    Layout: () => import("@/layout/default"),
    Notification: () => import("@/components/Notification"),
  },

  data: () => ({
    //
  }),
};
</script>
