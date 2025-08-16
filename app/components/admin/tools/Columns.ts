
import {
    type ColumnDef,
} from "@tanstack/vue-table";
import Badge from "~/components/ui/badge/Badge.vue";
import DataTableRowActions from "./DatatableRowActions.vue";
import type { Vendor } from "~/shared/types/vendor";


export const columns: ColumnDef<Vendor>[] = [
    {
        accessorKey: "name",
        header: "Tool Name",
    },

    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "affiliate_url",
        header: "Affiliate Link",
    },
    {
        accessorKey: "clicks",
        header: "Clicks",
    },
    {
        accessorKey: "conversions",
        header: "Conversions",
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const value = row.getValue("status");
            const className =
                value
                    ? "bg-green-200 text-green-700 font-semibold rounded-xl"
                    : "bg-slate-200 text-slate-700 font-semibold rounded-xl";
            return h(Badge, { class: className, variant: "secondary" }, () => value ? 'Active' : 'Inactive');
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => h(DataTableRowActions, { row }),
    },
];
