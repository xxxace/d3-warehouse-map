<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-notification-provider>
      <n-dialog-provider>
        <RouterView />
      </n-dialog-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup>
import { NConfigProvider, NDialogProvider, NNotificationProvider } from "naive-ui";
import { RouterView } from "vue-router";

const themeOverrides = {
  common: {
    fontWeightStrong: "600",
    primaryColor: "#165DFF",
    primaryColorHover: "#6AA1FF",
    primaryColorPressed: "#4080FF",
    primaryColorSuppl: "#0E42D2",
  },
};
</script>

<style scoped></style>
