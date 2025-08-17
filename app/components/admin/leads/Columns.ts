
import {
    type ColumnDef,
} from "@tanstack/vue-table";
import DataTableRowActions from "~/components/admin/leads/DatatableRowActions.vue"
import Icon from "~/components/Icon.vue";
import Badge from "~/components/ui/badge/Badge.vue";
import type { Lead } from "~/shared/types/leads";
import { format } from "date-fns";


//Lead ID	Date	Service/Tool Name	Requester Info	Sent To	Type
export const columns: ColumnDef<Lead>[] = [
    {
        accessorKey: "id",
        header: "Lead ID",
        cell: ({ row }) => {
            const value = row.getValue("id");
            return h("div", { class: "flex items-center gap-1" }, [
                `L00${value}`
            ]);
        }
    },
    {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => {
            const value = row.getValue("created_at");
            const date = new Date(value);
            return h("div", { class: "flex items-center gap-1" }, [
                format(date, "yyyy-MM-dd"),
            ]);
        },
    },
    {
        accessorKey: "services.service_name",
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
        accessorKey: "type",
        header: "type",
        cell: ({ row }) => {
            const value = row.getValue("type");
            const className =
                value
                    ? "bg-primary text-white font-semibold rounded-xl"
                    : "bg-slate-200 text-slate-700 font-semibold rounded-xl";
            return h(Badge, { class: className, variant: "secondary" }, () => value);
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => h(DataTableRowActions, { row }),
    },
];
