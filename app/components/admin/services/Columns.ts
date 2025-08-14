
import {
    type ColumnDef,
} from "@tanstack/vue-table";
import Badge from "~/components/ui/badge/Badge.vue";
import DataTableRowActions from "./DatatableRowActions.vue";
import type { Vendor } from "~/shared/types/vendor";


export const columns: ColumnDef<Vendor>[] = [
    {
        accessorKey: "service_name",
        header: "Service Name",
    },

    {
        accessorKey: "category",
        header: "Category",
    },
        {
        accessorKey: "vendors.name",
        header: "Provider Name",
    },
    {
        accessorKey: "pricing",
        header: "Price per Lead",
    },
    {
        accessorKey: "vendors.email",
        header: "Contact Email",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const value = row.getValue("status");
            const className =
                value 
                    ? "bg-green-200 text-green-700 font-semibold rounded-xl"
                    : "bg-yellow-200 text-yellow-700 font-semibold rounded-xl";
            return h(Badge, { class: className, variant: "secondary" }, () =>  value ? 'Active' :'Pause');
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => h(DataTableRowActions, { row }),
    },
];
