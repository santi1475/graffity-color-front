<template>
    <div class="icon-selector-container" ref="containerRef">
        <label v-if="label" class="form-label fw-bold small mb-1">{{
            label
            }}</label>

        <b-input-group @click.stop="toggleDropdown" class="cursor-pointer">
            <b-input-group-text class="icon-preview">
                <component v-if="CurrentIconComponent" :is="CurrentIconComponent" :size="18" stroke-width="2" />
                <i v-else class="fas fa-search text-muted" style="font-size: 14px"></i>
            </b-input-group-text>

            <b-form-input 
                type="text" 
                class="icon-input shadow-none cursor-pointer" 
                :model-value="modelValue" 
                readonly
                :placeholder="placeholder" 
            />

            <b-button variant="outline-secondary">
                <i class="fas" :class="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </b-button>
        </b-input-group>

        <div v-if="isOpen" class="custom-dropdown-menu dropdown-menu show shadow rounded border d-block w-100 mt-1 p-0">
            <div class="dropdown-header p-2 border-bottom sticky-top rounded-top">
                <b-form-input 
                    v-model="searchQuery" 
                    type="text" 
                    size="sm" 
                    placeholder="Buscar (ej: user)..." 
                    autofocus
                    @click.stop 
                    ref="searchInput" 
                />
            </div>

            <simplebar class="icons-grid-container" style="max-height: 250px">
                <div class="icons-grid p-2">
                    <div v-for="(component, name) in filteredIcons" :key="name" class="icon-item p-1"
                        :class="{ active: modelValue === name }" @click.stop="selectIcon(String(name))"
                        :title="String(name)">
                        <component v-if="component" :is="component" :size="20" stroke-width="2" />
                    </div>

                    <div v-if="loadedCount === 0" class="text-center py-3 text-danger">
                        <small><i class="fas fa-exclamation-triangle"></i> Error: 0 iconos
                            cargados.</small>
                        <br />
                        <small class="text-muted" style="font-size: 0.7em">Revisa la consola (F12) para ver
                            detalles.</small>
                    </div>
                    <div v-else-if="Object.keys(filteredIcons).length === 0" class="text-center py-3 text-muted">
                        <small>No hay coincidencias</small>
                    </div>
                </div>
            </simplebar>

            <div class="dropdown-footer p-1 border-top text-center rounded-bottom">
                <small class="text-muted" style="font-size: 10px">
                    {{ Object.keys(filteredIcons).length }} / {{ loadedCount }}
                </small>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    computed,
    onMounted,
    onUnmounted,
    shallowRef,
    nextTick,
} from "vue";
import * as lucideIcons from "lucide-vue-next";
import simplebar from "simplebar-vue";
import '@/assets/scss/css/icon-selector.css';
import type { IconSelectorProps, IconEmits } from "@/types/icon";

const props = withDefaults(defineProps<IconSelectorProps>(), {
    modelValue: "",
    label: "Icono",
    placeholder: "Seleccionar...",
});

const emit = defineEmits<IconEmits>();

const isOpen = ref(false);
const searchQuery = ref("");
const containerRef = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
const allIcons = shallowRef<Record<string, any>>({});
const loadedCount = ref(0);

onMounted(() => {
    const icons: Record<string, any> = {};

    const source = (lucideIcons as any).default || lucideIcons;

    const blackList = [
        "createLucideIcon",
        "default",
        "icons",
        "Icon",
        "LucideIcon",
    ];

    for (const [key, component] of Object.entries(source)) {
        if (blackList.includes(key)) continue;
        if (!/^[A-Z]/.test(key)) continue;
        if (typeof component === "object" || typeof component === "function") {
            icons[key] = component;
        }
    }

    allIcons.value = icons;
    loadedCount.value = Object.keys(icons).length;

    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});

const handleClickOutside = (event: MouseEvent) => {
    if (
        containerRef.value &&
        !containerRef.value.contains(event.target as Node)
    ) {
        isOpen.value = false;
    }
};

const normalizeName = (name: string): string => {
    if (!name) return "";
    return name.replace(/(^\w|-\w)/g, (clear) =>
        clear.replace(/-/, "").toUpperCase(),
    );
};

const CurrentIconComponent = computed(() => {
    if (!props.modelValue) return null;
    const normalized = normalizeName(props.modelValue);
    return allIcons.value[props.modelValue] || allIcons.value[normalized] || null;
});

const filteredIcons = computed(() => {
    if (!searchQuery.value) return allIcons.value;

    const term = searchQuery.value.toLowerCase();
    const filtered: Record<string, any> = {};

    for (const key in allIcons.value) {
        if (key.toLowerCase().includes(term)) {
            filtered[key] = allIcons.value[key];
        }
    }
    return filtered;
});

const selectIcon = (iconName: string) => {
    emit("update:modelValue", iconName);
    isOpen.value = false;
    searchQuery.value = "";
};

const toggleDropdown = async () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        await nextTick();
        const inputEl = containerRef.value?.querySelector(
            'input[type="text"].form-control-sm',
        ) as HTMLInputElement;
        if (inputEl) inputEl.focus();
    }
};
</script>
