<template>
  <label class="form-label" :class="labelClass" v-if="label">{{ label }}</label>
  <b-form-input
    :type="type ?? 'text'"
    :id="id"
    :placeholder="placeholder"
    :value="modelValue"
    :class="customClass"
    @input="updateValue"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import flatpickr from "flatpickr";
import type { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";

import { onMounted, onUnmounted } from "vue";
import type { InputType } from "bootstrap-vue-next";

type FlatPickerProps = {
  label?: string;
  type?: InputType;
  customClass?: string;
  labelClass?: string;
  placeholder?: string;
  id: string;
  modelValue?: string;
  options?: object;
};

const props = defineProps<FlatPickerProps>();

const emit = defineEmits(["update:modelValue"]);

let fpInstance: FlatpickrInstance | null = null;

const updateValue = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

onMounted(() => {
  const ele = document.getElementById(props.id);
  if (ele) {
    fpInstance = flatpickr(ele, { ...props.options, defaultDate: props.modelValue });
  }
});

onUnmounted(() => {
  if (fpInstance) {
    fpInstance.destroy();
    fpInstance = null;
  }
});
</script>
