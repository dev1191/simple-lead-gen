
import {
    type ColumnDef,
} from "@tanstack/vue-table";
import type { Business } from "~/shared/types/business";
import DataTableRowActions from "./DatatableRowActions.vue";


export const columns: ColumnDef<Business>[] = [
    {
        accessorKey: "business_name",
        header: "Business Name",
    },

    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => h(DataTableRowActions, { row }),
    },
];
