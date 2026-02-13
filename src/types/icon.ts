export interface IconSelectorProps {
    modelValue?: string;
    label?: string;
    placeholder?: string;
}

// Si necesitas más tipos relacionados con iconos:
export interface IconData {
    name: string;
    component: any;
}

export type IconEmits = {
    'update:modelValue': [value: string];
}