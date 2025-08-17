import type { Service } from "./service";
import type { Vendor } from "./vendor";

export interface Lead {
    id: string;
    vendor_id: string;
    vendors: Vendor;
    service_id: string;
    service: Service
    forwarded_at: string;
    user_name: string;
    user_email: string;
    type:string;
    status:string;
    message:string;
    created_at:string
}