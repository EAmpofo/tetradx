<script setup lang="ts">
import { computed } from 'vue';
import { MultiSelect, Chip } from 'primevue';

interface Option {
  id: number;
  name: string;
  [key: string]: any;
}

interface AppMultiSelectProps {
  modelValue: number[];
  options: Option[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  optionLabel?: string;
  optionValue?: string;
  showChips?: boolean;
}

interface AppMultiSelectEmits {
  (e: 'update:modelValue', value: number[]): void;
}

const props = withDefaults(defineProps<AppMultiSelectProps>(), {
  placeholder: 'Select options',
  label: '',
  disabled: false,
  optionLabel: 'name',
  optionValue: 'id',
  showChips: true
});

const emit = defineEmits<AppMultiSelectEmits>();

const selectedItems = computed(() => {
  return props.options.filter(option => 
    props.modelValue.includes(option[props.optionValue] as number)
  );
});

const handleUpdate = (value: number[]) => {
  emit('update:modelValue', value);
};

const removeItem = (itemId: number) => {
  const updatedValue = props.modelValue.filter(id => id !== itemId);
  emit('update:modelValue', updatedValue);
};

const getItemLabel = (item: Option) => {
  return item[props.optionLabel] || item.name;
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Label -->
    <label v-if="label" class="font-semibold text-gray-700">{{ label }}</label>
    
    <!-- MultiSelect Dropdown -->
    <MultiSelect
      :modelValue="modelValue"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full app-multiselect-hide-chips"
      @update:modelValue="handleUpdate"
      :filter="false"
      :showToggleAll="false"
    >
      <template #value="slotProps">
        <span v-if="!slotProps.value || slotProps.value.length === 0" class="text-gray-500">
          {{ placeholder }}
        </span>
        <span v-else class="text-gray-700">
          {{ slotProps.value.length }} item{{ slotProps.value.length > 1 ? 's' : '' }} selected
        </span>
      </template>
    </MultiSelect>

    <!-- Selected Items Display with Remove Option -->
    <div 
      v-if="showChips && selectedItems.length > 0" 
      class="flex flex-wrap gap-2 p-1 bg-gray-50 rounded-lg border border-gray-200"
    >
      <Chip
        v-for="item in selectedItems"
        :key="item[optionValue]"
        :label="getItemLabel(item)"
        removable
        class="bg-blue-100  text-xs border border-blue-200"
        
        :pt="{
            root: 'text-sm'
        }"
      >

        <template #removeicon>
          <i @click="removeItem(item[optionValue])" class="pi pi-times cursor-pointer ml-2"></i>
        </template>
      </Chip>
    </div>

    <!-- Empty State -->
    <div 
      v-if="showChips && selectedItems.length === 0" 
      class="text-sm text-gray-500 italic p-2"
    >
      No items selected
    </div>
  </div>
</template>

<style scoped>
/* Custom chip styling */
:deep(.p-chip) {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

:deep(.p-chip:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.p-chip .p-chip-remove-icon) {
  margin-left: 0.5rem;
  font-size: 0.875rem;
}

/* Hide the default chips in the multiselect input */
:deep(.app-multiselect-hide-chips .p-multiselect-label .p-multiselect-token) {
  display: none !important;
}

:deep(.app-multiselect-hide-chips .p-multiselect-label) {
  padding: 0.5rem 0.75rem;
}
</style>
