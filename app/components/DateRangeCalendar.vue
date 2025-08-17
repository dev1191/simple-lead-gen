<script setup lang="ts">
import type { DateRange } from "reka-ui";

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";
import { CalendarIcon } from "lucide-vue-next";
import { ref, watch } from "vue";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RangeCalendar } from "@/components/ui/range-calendar";

const props = defineProps<{
  modelValue?: DateRange | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: DateRange | null];
}>();

// Default to today's date if none passed
const internalValue = ref<DateRange | null>(
  props.modelValue ?? {
    start: new CalendarDate(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    ),
    end: new CalendarDate(
      new Date().getFullYear(),
      new Date().getMonth()+ 1 ,
      new Date().getDate() + 7,
  )
  }
);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== internalValue.value) {
      internalValue.value = val;
    }
  }
);

watch(internalValue, (val) => {
  emit("update:modelValue", val);
});

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const formatRange = (range: DateRange | null) => {
  if (!range?.start) return "Pick a date";
  if (range.end) {
    return `${df.format(range.start.toDate(getLocalTimeZone()))} - ${df.format(
      range.end.toDate(getLocalTimeZone())
    )}`;
  }
  return df.format(range.start.toDate(getLocalTimeZone()));
};
</script>

<template>
  <Popover >
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'justify-start text-left font-normal',
            !internalValue && 'text-muted-foreground'
          )
        "
      >
        {{ formatRange(internalValue) }}
        <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar
       
        v-model="internalValue"
        initial-focus
        :number-of-months="2"
        @update:start-value="
          (startDate) => internalValue && (internalValue.start = startDate)
        "
      />
    </PopoverContent>
  </Popover>
</template>
