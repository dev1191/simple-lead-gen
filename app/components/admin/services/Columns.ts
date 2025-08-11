
import {
    type ColumnDef,
} from "@tanstack/vue-table";
import Badge from "~/components/ui/badge/Badge.vue";
import DataTableRowActions from "./DatatableRowActions.vue";
import type { Vendor } from "~/shared/types/vendor";


export const columns: ColumnDef<Vendor>[] = [
    {
        accessorKey: "title",
        header: "Service Name",
    },

    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "price",
        header: "Price per Lead",
    },
    {
        accessorKey: "price",
        header: "Contact Email",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const value = row.getValue("status");
            const className =
                value === "Active"
                    ? "bg-green-200 text-green-700 font-semibold rounded"
                    : "bg-slate-200 text-slate-700 font-semibold rounded";
            return h(Badge, { class: className, variant: "secondary" }, () => value);
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => h(DataTableRowActions, { row }),
    },
];
