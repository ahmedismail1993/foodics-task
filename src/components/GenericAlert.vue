<template>
  <v-dialog
    @input="$emit('update:alertDialog', !alertDialog)"
    :value="alertDialog"
    max-width="600"
  >
    <v-card rounded>
      <v-card-text class="py-3">
        <slot name="body" />
      </v-card-text>
      <v-card-actions class="text-center">
        <slot name="footer" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "GenereicAlert",
  props: {
    alertDialog: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

