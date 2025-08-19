<template>
  <section class="py-20 bg-white">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div v-for="feature in features" :key="feature.title">
        <Card>
          <CardHeader>
            <CardTitle>{{ feature.title }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{{ feature.description }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const features = [
  { title: 'Feature One', description: 'Amazing feature description one.' },
  { title: 'Feature Two', description: 'Amazing feature description two.' },
  { title: 'Feature Three', description: 'Amazing feature description three.' }
];
</script>
