
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
        accessorKey: "services",
        header: " Services Listed",
        cell: ({ row }) => {
            const value = row.getValue("services");
            return h("div", {}, value.length);
        }
    },
    {
        accessorKey: "monthly_leads",
        header: "Leads This Month",
        cell: ({ row }) => {
            const leads = row.getValue("leads"); // all leads
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            // Filter leads for current month
            const monthlyLeads = leads.filter((lead: any) => {
                const createdAt = new Date(lead.created_at);
                return (
                    createdAt.getMonth() === currentMonth &&
                    createdAt.getFullYear() === currentYear
                );
            });

            return monthlyLeads.length;
        },
    },
    {
        accessorKey: "leads",
        header: "Total Leads",
        cell: ({ row }) => {
            const value = row.getValue("leads");
            return h("div", {}, value.length);
        }
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
