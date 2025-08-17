
import {
    type ColumnDef,
} from "@tanstack/vue-table";
import Badge from "~/components/ui/badge/Badge.vue";
import DataTableRowActions from "./DatatableRowActions.vue";
import type { Vendor } from "~/shared/types/vendor";
import { ExternalLink } from "lucide-vue-next";
import { NuxtLink } from "#components";
import Button from "~/components/ui/button/Button.vue";
import { toolCategories } from "~/shared/constants";


export const columns: ColumnDef<Vendor>[] = [
    {
        accessorKey: "name",
        header: "Tool Name",
    },

    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const value = row.getValue("category") as string;
            const category = toolCategories.find((cat) => cat.value === value);

            if (!category) return '-';

            return h(
                Badge,
                { variant: "secondary",class:"font-semibold" }, // you can use "default", "secondary", "outline", etc.
                { default: () => category.label }
            );
        },

    },
    {
        accessorKey: "affiliate_url",
        header: "Affiliate Link",
        cell: ({ row }) => {
            const value = row.getValue("affiliate_url") as string;

            if (!value) return null;

            return h(
                "div",
                { class: "flex items-center gap-2" },
                [
                    // show plain value
                    h("span", value),

                    // shadcn-vue Button wrapping NuxtLink
                    h(
                        NuxtLink,
                        {
                            to: value,
                            target: "_blank",
                            rel: "noopener noreferrer"
                        },
                        {
                            default: () =>
                                h(
                                    Button,
                                    { variant: "ghost", size: "icon", class: "text-slate-600" },
                                    {
                                        default: () => h(ExternalLink, { class: "w-4 h-4" })
                                    }
                                )
                        }
                    )
                ]
            );
        },
    },
    {
        accessorKey: "clicks_count",
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
