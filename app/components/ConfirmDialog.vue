<script lang="ts" setup>
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const { title, description, open, loading } = defineProps<{
    open: boolean;
    title: string;
    description: string;
    loading?: boolean;
}>();

const emits = defineEmits<{
    (e: 'confirm'): void;
    (e: 'update:open', value: boolean): void;
}>();

function close() {
    emits('update:open', false);
}
function confirm() {
    emits('confirm');
}
</script>

<template>
    <Dialog :open="open" @update:open="(v) => emits('update:open', v)">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{{ title || ' Delete Item' }}</DialogTitle>
                <DialogDescription> {{ description || 'Are you sure you want to delete this? This action cannot be undone. ' }} </DialogDescription>
            </DialogHeader>
            <DialogFooter class="mt-4">
                <DialogClose as-child>
                    <Button variant="outline" @click="close"> Cancel </Button>
                </DialogClose>
                <Button variant="destructive" :disabled="loading" @click="confirm" class="cursor-pointer">
                    {{ loading ? 'deleting...': `Yes,Delete` }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<style scoped></style>