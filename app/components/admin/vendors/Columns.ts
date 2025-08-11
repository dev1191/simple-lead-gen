
import {
    type ColumnDef,
} from "@tanstack/vue-table";
import Badge from "~/components/ui/badge/Badge.vue";
import DataTableRowActions from "./DatatableRowActions.vue";
import type { Vendor } from "~/shared/types/vendor";


export const columns: ColumnDef<Vendor>[] = [
    {
        accessorKey: "name",
        header: "Vendor Name",
    },

    {
        accessorKey: "email",
        header: "Contact Email",
    },
    {
        accessorKey: "service_listed",
        header: " Services Listed",
    },
    {
        accessorKey: "monthly_leads",
        header: "Leads This Month",
    },
    {
        accessorKey: "total_leads",
        header: "Total Leads",
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
