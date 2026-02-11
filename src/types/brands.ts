export type Brand = {
    id: string;
    name: string;
    icon_name?: string;
    state: number;
    image: string | null;
    created_at: string;
};

export type Brands = {
    total: number;
    paginate: number;
    brands: Brand[];
};

export type BrandResponse = {
    message: string;
    code: number;
    brand?: Brand;
};
