
import {
    type ColumnDef,
} from "@tanstack/vue-table";
import DataTableRowActions from "~/components/admin/leads/DatatableRowActions.vue"
import type { Lead } from "~/shared/types/leads";


//Lead ID	Date	Service/Tool Name	Requester Info	Sent To	Type
export const columns: ColumnDef<Lead>[] = [
    {
        accessorKey: "id",
        header: "Lead ID",
    },
    {
        accessorKey: "created_at",
        header: "Date",
    },
    {
        accessorKey: "pricing",
        header: "Service/Tool Name",
    },
    {
        accessorKey: "vendors.email",
        header: "Requester Info",
    },
    {
        accessorKey: "vendors.email",
        header: "Sent To",
    },
    {
        accessorKey: "vendors.email",
        header: "Type",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => h(DataTableRowActions, { row }),
    },
];
