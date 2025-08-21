


export interface SubCategories {
    id: string;
    name: string;
}

export interface ServiceCategories {
    id: string;
    name: string;
    sub_categories: SubCategories
}

export interface FilterOptions {
  categories: string[]
  serviceTypes: string[]
  hasFreeConsultation: boolean | null
  turnaroundTime: string[]
  region: string[]
}

export interface Service {
    id: string;
    service_name: string;
    service_tagline: string;
    service_categories: ServiceCategories
    logo_url: string;
    banner_url: string;
    description: string;
    business_types: string[];
    type_of_service: string;
    highlights: string[];
    included: string[];
    currency_code: string;
    pricing: string;
    turnaround_time: string;
    free_consulatation: boolean;
    url: string;
    client_logos: string[];
    servers: string[];
    vendor_id?: string;
    status: boolean
}