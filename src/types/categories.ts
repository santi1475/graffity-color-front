export type Categorie ={
    id: string;
    title: string;
    icon_name?: string;
    state:number;
    imagen: string | null;
    created_at: string;
}
export type Categories = {
    total: number;
    paginate: number;
    categories: Categorie[];
}
export type CategorieResponse = {
    message: string;
    code: number;
    categorie?: Categorie;
}
