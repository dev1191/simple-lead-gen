<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { defineEmits, defineProps, watch } from 'vue';

const props = defineProps<{
    open: boolean;
    mode?: 'create' | 'edit';
    title?: string;
    description?: string;
    form?: any;
}>();

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'submit'): void;
}>();

watch(
    () => props.open,
    (val) => {
        if (!val) emit('update:open', false);
    },
);
</script>

<template>
    <Sheet v-model:open="props.open" @update:open="emit('update:open', $event)">
        <SheetContent  class="w-[1024px]">
            <SheetHeader class="text-left">
                <SheetTitle>
                    {{ props.title || (props.mode === 'edit' ? 'Edit Item' : 'Create Item') }}
                </SheetTitle>
                <SheetDescription>
                    {{ props.description || (props.mode === 'edit' ? 'Update item details.' : 'Add new item.') }}
                </SheetDescription>
            </SheetHeader>

            <!-- Form wraps the content and footer to ensure submit works -->
            <form class="mt-2 flex flex-1 flex-col space-y-4 px-4" @submit.prevent="emit('submit')">
                <!-- Main slot for form inputs -->
                <slot />

                <SheetFooter class="mt-auto gap-3">
                    <Button :disabled="form.processing">
                        <Icon v-if="form.processing" name="Loader2" :size="18" class="mr-2 h-4 w-4 animate-spin" />
                        {{ props.mode === 'edit' ? 'Update' : 'Save changes' }}
                    </Button>

                    <SheetClose as-child>
                        <Button type="button" variant="outline">
                          Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </form>
        </SheetContent>
    </Sheet>
</template>