<script lang="ts" setup>
import Icon from '@/components/Icon.vue';
import { Button } from '@/components/ui/button';

import { Row } from '@tanstack/vue-table';
import type { BlogPost } from '~/shared/types/blogPost';

const props = defineProps<{ row: Row<BlogPost>; }>();

</script>

<template>
    <div class="flex items-center gap-2">
        <Button variant="ghost"  size="icon">
            <Icon name="Edit" :size="20"  />
        </Button>

        <Button  variant="ghost" size="icon" >
            <Icon name="Trash2" :size="20" class="text-red-800"  />
        </Button>
    </div>
</template>