<script setup lang="ts">
import { ref, computed, shallowRef, onMounted } from 'vue';
import * as lucideIcons from 'lucide-vue-next';

// Props
interface Props {
    modelValue?: string;
    label?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: 'Package',
    label: 'Seleccionar Icono'
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

// Estado
const isOpen = ref(false);
const searchQuery = ref('');
const allIcons = shallowRef<Record<string, any>>({});
const defaultIcon = 'Package';

// Carga optimizada de iconos al montar
onMounted(() => {
    const icons: Record<string, any> = {};
    for (const [key, component] of Object.entries(lucideIcons)) {
        // Evitar exports no componentes
        if (key === 'createLucideIcon' || key === 'default') continue;
        
        // Debe ser un objeto
        if (!component || typeof component !== 'object') continue;
        
        // Validar que es un componente Vue válido
        const comp = component as any;
        const isValidComponent = !!(
            comp.render || 
            comp.setup || 
            comp.template || 
            comp.__vccOpts ||
            (comp.name && typeof comp.name === 'string')
        );
        
        if (isValidComponent) {
            icons[key] = component;
        }
    }
    allIcons.value = icons;
});

// Validar que el icono existe
const isValidIcon = (iconName: string): boolean => {
    return Boolean(allIcons.value[iconName]);
};

// Verificar si un componente es renderizable
const isRenderableComponent = (component: any): boolean => {
    if (!component) return false;
    if (typeof component !== 'object') return false;
    // Verificar propiedades de un componente Vue válido
    const comp = component as any;
    return !!(
        comp.render || 
        comp.setup || 
        comp.template || 
        comp.__vccOpts ||
        comp.name ||
        (comp.__vue_component__ === true)
    );
};

// Obtener icono válido o fallback
const getValidIconName = (iconName?: string): string => {
    if (!iconName || !isValidIcon(iconName)) {
        return defaultIcon;
    }
    return iconName;
};

// Icono actual para el botón
const CurrentIconComponent = computed(() => {
    const validName = getValidIconName(props.modelValue);
    const component = allIcons.value[validName];
    
    if (!component) {
        // Devolver undefined para que v-if lo maneje
        return undefined;
    }
    
    return component;
});

// Nombre del icono actual válido
const currentIconName = computed(() => {
    return getValidIconName(props.modelValue);
});

// Filtrado
const filteredIcons = computed(() => {
    if (!searchQuery.value) return allIcons.value;
    
    const term = searchQuery.value.toLowerCase();
    const filtered: Record<string, any> = {};
    
    Object.keys(allIcons.value).forEach(key => {
        if (key.toLowerCase().includes(term)) {
            filtered[key] = allIcons.value[key];
        }
    });
    
    return filtered;
});

// Selección
const selectIcon = (iconName: string) => {
    if (isValidIcon(iconName)) {
        emit('update:modelValue', iconName);
        isOpen.value = false;
        searchQuery.value = ''; // Limpiar búsqueda al cerrar
    }
};

// Cierre al hacer clic fuera
const closeModal = (event: MouseEvent) => {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
        isOpen.value = false;
    }
};

// Sugerencias de búsqueda comunes
const searchSuggestions = [
    'user', 'heart', 'star', 'home', 'settings', 'lock', 'mail', 
    'phone', 'calendar', 'clock', 'check', 'x', 'plus', 'minus',
    'cart', 'shopping', 'gift', 'badge', 'bell', 'alert', 'info',
    'search', 'filter', 'menu', 'arrow', 'download', 'upload'
];

// Aplicar sugerencia de búsqueda
const applySuggestion = (suggestion: string) => {
    searchQuery.value = suggestion;
};
</script>

<template>
    <div class="icon-selector-wrapper">
        <label class="form-label fw-bold">{{ label }}</label>
        
        <div 
            class="icon-selector-display input-group cursor-pointer" 
            @click="isOpen = true" 
            role="button"
        >
            <span class="input-group-text bg-light text-primary">
                <component v-if="CurrentIconComponent && isRenderableComponent(CurrentIconComponent)" :is="CurrentIconComponent" :size="18" stroke-width="2" />
                <i v-else class="fas fa-image text-muted"></i>
            </span>
            <input 
                type="text" 
                class="form-control bg-white cursor-pointer" 
                :value="currentIconName" 
                readonly 
                placeholder="Seleccione un icono..."
            >
            <button class="btn btn-outline-secondary" type="button" tabindex="-1">
                Cambiar
            </button>
        </div>

        <!-- Modal backdrop -->
        <Teleport v-if="isOpen" to="body">
            <div 
                class="modal-backdrop fade show" 
                @click="closeModal"
            ></div>
        </Teleport>

        <!-- Modal -->
        <Teleport v-if="isOpen" to="body">
            <div 
                class="modal fade show d-block" 
                tabindex="-1" 
                role="dialog"
                @click.self="isOpen = false"
                style="margin-top: 0;"
            >
                <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" role="document">
                    <div class="modal-content">
                        
                        <div class="modal-header border-bottom">
                            <div class="w-100">
                                <h5 class="modal-title mb-3">🎨 Seleccionar Icono</h5>
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text bg-white">
                                        <i class="fas fa-search text-muted"></i>
                                    </span>
                                    <input 
                                        v-model="searchQuery"
                                        type="text" 
                                        class="form-control form-control-sm" 
                                        placeholder="Buscar por tipo (user, cart, home, heart, star, settings, lock, etc)..." 
                                    />
                                </div>
                            </div>
                            <button 
                                type="button" 
                                class="btn-close ms-3" 
                                aria-label="Close"
                                @click="isOpen = false"
                            ></button>
                        </div>

                        <div class="modal-body p-4 icon-modal-body">
                            <!-- Ayuda inicial -->
                            <div v-if="!searchQuery && Object.keys(filteredIcons).length > 0" class="mb-3">
                                <div class="alert alert-info alert-sm mb-3" role="alert">
                                    <small>
                                        <strong>💡 Tip:</strong> Busca por tipo de icono o elige una sugerencia abajo
                                    </small>
                                </div>
                                
                                <!-- Sugerencias rápidas -->
                                <div class="search-suggestions">
                                    <small class="d-block mb-2 text-muted"># Búsquedas populares:</small>
                                    <div class="suggestion-chips">
                                        <button 
                                            v-for="(suggestion, idx) in searchSuggestions" 
                                            :key="idx"
                                            type="button"
                                            @click="applySuggestion(suggestion)"
                                            class="btn btn-outline-primary btn-sm me-2 mb-2"
                                        >
                                            {{ suggestion }}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Grilla de iconos -->
                            <div v-if="Object.keys(filteredIcons).length > 0" class="icon-grid-large">
                                <div class="row g-2">
                                    <div 
                                        v-for="(iconComponent, name) in filteredIcons" 
                                        :key="name" 
                                        class="col-6 col-sm-4 col-md-3"
                                    >
                                        <button 
                                            type="button"
                                            @click="selectIcon(name as string)"
                                            class="icon-btn-large w-100 d-flex flex-column align-items-center justify-content-center"
                                            :class="currentIconName === name ? 'selected' : ''"
                                            :title="`Seleccionar: ${name}`"
                                        >
                                            <div class="icon-display">
                                                <component 
                                                    v-if="iconComponent && isRenderableComponent(iconComponent)"
                                                    :is="iconComponent" 
                                                    :size="40" 
                                                    stroke-width="1.5"
                                                />
                                                <i v-else class="fas fa-image text-muted"></i>
                                            </div>
                                            <span class="icon-name-label">{{ name }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Sin resultados -->
                            <div v-else class="text-center py-5 text-muted">
                                <div class="mb-3">
                                    <i class="fas fa-inbox fa-3x opacity-50"></i>
                                </div>
                                <p class="mb-0">
                                    <strong>No se encontraron iconos</strong>
                                </p>
                                <p class="small">
                                    Intenta con: "user", "heart", "star", "settings", "home"
                                </p>
                            </div>

                            <!-- Estadísticas -->
                            <div v-if="Object.keys(filteredIcons).length > 0" class="mt-4 pt-3 border-top">
                                <small class="text-muted d-block">
                                    Se muestran {{ Object.keys(filteredIcons).length }} de {{ Object.keys(allIcons).length }} iconos disponibles
                                </small>
                            </div>
                        </div>

                        <div class="modal-footer bg-light border-top small">
                            <span class="text-muted me-auto">
                                <i class="fas fa-info-circle"></i>
                                Seleccionado: <strong>{{ currentIconName }}</strong>
                            </span>
                            <button 
                                type="button" 
                                class="btn btn-secondary btn-sm" 
                                @click="isOpen = false"
                            >
                                Cerrar
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}

.icon-selector-wrapper {
    margin-bottom: 1rem;
}

.icon-selector-display:hover {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Modal body scrollable */
.icon-modal-body {
    max-height: 65vh;
    overflow-y: auto;
    background: #fafafb;
}

/* Grid de iconos grande */
.icon-grid-large {
    display: grid;
    gap: 1rem;
}

/* Botón de icono en galería */
.icon-btn-large {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem 0.5rem;
    border: 2px solid #e9ecef;
    border-radius: 0.75rem;
    background: white;
    transition: all 0.25s ease;
    cursor: pointer;
    text-decoration: none;
    min-height: 120px;
}

.icon-btn-large:hover {
    border-color: #0d6efd;
    background-color: #f0f7ff;
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1rem rgba(13, 110, 253, 0.15);
}

.icon-btn-large.selected {
    border-color: #0d6efd;
    background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
    color: white;
}

.icon-btn-large.selected .icon-display {
    color: white;
}

.icon-btn-large.selected .icon-name-label {
    color: white;
    font-weight: 600;
}

/* Display del icono */
.icon-display {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: #0d6efd;
    margin-bottom: 0.5rem;
    line-height: 1;
}

.icon-btn-large.selected .icon-display {
    color: white;
}

/* Label del icono */
.icon-name-label {
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    word-break: break-word;
    line-height: 1.2;
    color: #495057;
    margin-top: 0.5rem;
}

/* Alert info pequeño */
.alert-sm {
    padding: 0.5rem 0.75rem;
    margin-bottom: 1rem;
}

.alert-info {
    background-color: #cfe2ff;
    border: 1px solid #b6d4fe;
    color: #084298;
}

/* Responsive */
@media (max-width: 576px) {
    .icon-btn-large {
        min-height: 100px;
        padding: 0.75rem 0.5rem;
    }

    .icon-display {
        font-size: 2rem;
    }

    .icon-name-label {
        font-size: 0.65rem;
    }
}

/* Soporte para dark mode si es necesario */
@media (prefers-color-scheme: dark) {
    .icon-modal-body {
        background: #1a1a1a;
    }

    .icon-btn-large {
        background: #2d2d2d;
        border-color: #404040;
        color: #e0e0e0;
    }

    .icon-btn-large:hover {
        background-color: #353535;
        border-color: #0d6efd;
    }

    .icon-name-label {
        color: #b0b0b0;
    }
}

/* Animaciones suaves */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.icon-btn-large {
    animation: fadeIn 0.15s ease-out;
}

/* Scroll suave en el modal */
.icon-modal-body {
    scroll-behavior: smooth;
}

/* Tooltip en el modal footer */
.modal-footer {
    padding: 0.75rem 1rem;
}

/* Search suggestions */
.search-suggestions {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

.suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.btn-outline-primary.btn-sm {
    border: 1px solid #0d6efd;
    color: #0d6efd;
    padding: 0.25rem 0.75rem;
    font-size: 0.8rem;
}

.btn-outline-primary.btn-sm:hover {
    background-color: #0d6efd;
    border-color: #0d6efd;
    color: white;
}
</style>