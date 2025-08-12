import type { LucideIcon } from "lucide-vue-next";


export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: NavItem[];
}


export interface Faq {
    id:string;
    question:string;
    answer:string;
    category:string;
}