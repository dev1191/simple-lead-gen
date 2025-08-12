
import {
    type ColumnDef,
} from "@tanstack/vue-table";
import DataTableRowActions from "./DataTableRowActions.vue";
import type { Faq } from "~/shared/types";


export const columns: ColumnDef<Faq>[] = [
    {
        accessorKey: "question",
        header: "Question",
    },

    {
        accessorKey: "answer",
        header: "Answer",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => h(DataTableRowActions, { row }),
    },
];
