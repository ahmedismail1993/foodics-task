<template>
  <v-snackbar
    top
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :multi-line="true"
    :color="snackbar.color"
  >
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <p class="snack ma-0" style="font-weight: bold; font-size: 18px">
        {{ snackbar.text }}
      </p>
      <v-btn @click="closeNotification" text dark>close</v-btn>
    </div>
  </v-snackbar>
</template>

<script>
import state from "@/helpers/serverErrors";

export default {
  name: "Notificaion",
  computed: {
    snackbar() {
      return state.snackbar;
    },
  },
  methods: {
    closeNotification() {
      state.snackbar.visible = false;
    },
  },
};
</script>
