
import {
  type ColumnDef,
} from "@tanstack/vue-table";
import Icon from "~/components/Icon.vue";
import Badge from "~/components/ui/badge/Badge.vue";
import type { BlogPost } from "~/shared/types/blogPost";
import { format } from "date-fns";
import DataTableRowActions from "./RowActions.vue";


export const columns: ColumnDef<BlogPost>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },

    {
        accessorKey: "profiles.display_name",
        header: "Author",
    },

    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const value = row.getValue("category");
            return h(Badge, { variant: "secondary" }, () => value);
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const value = row.getValue("status");
            const className =
                value === "Published"
                    ? "bg-green-200 text-green-700 font-semibold"
                    : "bg-yellow-200 text-yellow-700 font-semibold";
            return h(Badge, { class: className, variant: "secondary" }, () => value);
        },
    },
    {
        accessorKey: "created_at",
        header: "Publish Date",
        cell: ({ row }) => {
            const value = row.getValue("created_at");
            const date = new Date(value);
            return h("div", { class: "flex items-center gap-1" }, [
                h(Icon, { name: "Calendar" }),
                format(date, "yyyy-MM-dd"),
            ]);
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => h(DataTableRowActions, { row }),
    },
];
