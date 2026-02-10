<template>
  <component
    :is="is ?? 'div'"
    ref="dropdown"
    class="dropdown"
    :class="customClass"
    :id="id"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Dropdown } from "bootstrap";

type DropDownPropType = {
  is?: string;
  id?: string;
  customClass?: string;
};

defineProps<DropDownPropType>();

const dropdown = ref();
let bsDropdown: Dropdown | null = null;

onMounted(() => {
  if (dropdown.value) {
    bsDropdown = Dropdown.getOrCreateInstance(dropdown.value);
  }
});

onUnmounted(() => {
  if (bsDropdown) {
    bsDropdown.dispose();
    bsDropdown = null;
  }
});
</script>
