
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
        accessorKey: "services",
        header: "Requester Info",
        cell: ({ row }) => {
            const value = row.getValue("services");
            const serviceDetails = value?.service_details || [];

            if (Array.isArray(serviceDetails) && serviceDetails.length > 0) {
                // get latest by created_at
                const latest = [...serviceDetails].sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                )[0];

                   const text = `${latest.company_name} - ${latest.name} (${latest.email})`;
                   return h('div', { class: "max-w-[200px] truncate text-gray-800" }, text);
            }

            return "-";


        }
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
