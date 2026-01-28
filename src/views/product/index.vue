<template>
    <DefaultLayout>
        <b-row class="justify-content-center">
            <b-col cols="12">
                <b-card>
                    <b-card-header>
                        <b-row class="align-items-center justify-content-between">
                            <b-col lg="3">
                                <b-card-title>🗿 Productos</b-card-title>
                            </b-col>
                            <b-col lg="2">
                                <b-button
                                    type="button"
                                    variant="success"
                                    :to="{ name: 'products.register' }"
                                    tag="router-link"
                                >
                                    <i class="far fa-plus-square ml-3"></i> Registrar
                                </b-button>
                            </b-col>
                        </b-row>
                        <b-row class="align-items-center pt-1">
                            <b-col lg="3">
                                <b-form-input
                                    type="text"
                                    id="search"
                                    v-model="search"
                                    placeholder="Buscar por nombre o sku"
                                />
                            </b-col>
                            <b-col lg="3" md="3">
                                <b-button type="button" variant="success" @click="list">
                                    <i class="fas fa-search"></i>
                                </b-button>
                                <b-button type="button" variant="dark" @click="reset" class="mx-2">
                                    <i class="fas fa-sync"></i>
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-card-header>
                    <b-card-body class="pt-0">
                        <b-table-simple responsive class="mb-0 table-centered">
                            <b-thead class="table-light">
                                <b-tr>
                                    <b-th>Producto</b-th>
                                    <b-th>Sku</b-th>
                                    <b-th>Categoria</b-th>
                                    <b-th>Precio C.F.</b-th>
                                    <b-th>Precio C.E.</b-th>
                                    <b-th>Estado</b-th>
                                    <b-th>Unidad</b-th>
                                    <b-th>Stock</b-th>
                                    <b-th>Incluye IGV</b-th>
                                    <b-th>Fecha de registro</b-th>
                                    <b-th class="text-end">Acciones</b-th>
                                </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr v-for="(product, index) in products" :key="product.id ?? index">
                                    <b-td>
                                        <div class="d-flex align-items-center">
                                            <img :src="product.imagen" 
                                                alt="image" 
                                                style="border-radius: 50%; width: 52px; height: 52px; object-fit: cover; margin-right: 12px;"
                                            />
                                            <span class="mk-2">
                                                {{ product.title }}
                                            </span>
                                        </div>
                                    </b-td>
                                    <b-td>
                                        {{ product.sku }}
                                    </b-td>
                                    <b-td>
                                        {{ product.categorie?.title || 'Sin categoría' }}
                                    </b-td>
                                    <b-td>
                                        S/. {{ product.price_general }}
                                    </b-td>
                                    <b-td>
                                        S/. {{ product.price_company }}
                                    </b-td>
                                    <b-td>
                                        <b-badge variant="primary" v-if="product.state == 1">Activo</b-badge>
                                        <b-badge variant="danger" v-else>Inactivo</b-badge>
                                    </b-td>
                                    <b-td>
                                        {{ product.unidad_medida }}
                                    </b-td>
                                    <b-td>
                                        {{ product.stock }}
                                    </b-td>
                                    <b-td>
                                        {{ product.include_igv === 2 ? 'Sí' : 'No' }}
                                    </b-td>
                                    <b-td>
                                        {{ product.created_at }}
                                    </b-td>
                                    <b-td class="text-end">
                                        <a href="#" 
                                            @click.prevent="editProduct(product)"
                                        >
                                            <i class="las la-pen text-secondary fs-22"></i>
                                        </a>
                                        {{ " " }}
                                        <a href="#" 
                                            @click.prevent="deleteProduct(product)"
                                        >
                                            <i class="las la-trash-alt text-secondary fs-22"></i>
                                        </a>
                                    </b-td>
                                </b-tr>  
                            </b-tbody>
                        </b-table-simple>
                        <b-pagination
                            v-model="currentPage"
                            :total-rows="totalPages"
                            :per-page="perPageRows"
                            first-number
                            last-number
                        />
                    </b-card-body>
                </b-card>
            </b-col>
        </b-row>
        
    </DefaultLayout>
</template>
<script setup lang="ts">
import HttpClient from '@/helpers/http-client';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import type { Product, Products, ProductResponse } from '@/types/products';
import type { AxiosResponse } from 'axios';
import { onMounted, ref, watch } from 'vue';
import Swal from "sweetalert2/dist/sweetalert2.js";
type TVueSwalInstace = typeof Swal & typeof Swal.fire;

const products = ref<Product[]>([]);
const currentPage = ref<number>(1);
const totalPages = ref<number>(0);
const perPageRows = ref<number>(1);
const search = ref<string | null>(null);
const ModalRegisterProduct = ref<boolean>(false);
const themeColor = ref("primary" as const);
const productSelected = ref<Product | undefined>(undefined);

const name = ref<string>("");
const state = ref<number>(1);
const IMAGEN_PREVIZUALIZA = ref<string | ArrayBuffer | null>("");
const FILE_IMAGEN = ref<File | undefined>(undefined);

const list = async () => {
    try {
        const res: AxiosResponse<Products> = await HttpClient.get(
            "products?page="+currentPage.value+"&search="+(search.value ? search.value : ""));
        console.log(res);
        products.value = res.data.products.data;
        totalPages.value = res.data.total;
        perPageRows.value = res.data.paginate;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

const store = async () =>{
    try{
        if(!name.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Necesitas ingresar el nombre del producto.",
                "error"
            );
            return;
        }
        if(!productSelected.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Debes seleccionar un producto para editarlo.",
                "error"
            );
            return;
        }
        
        let formData = new FormData();
        formData.append("title", name.value);
        formData.append("state", state.value+"");
        formData.append("sku", productSelected.value.sku);
        formData.append("categorie_id", productSelected.value.categorie_id+"");
        formData.append("price_general", productSelected.value.price_general+"");
        formData.append("price_company", productSelected.value.price_company+"");
        formData.append("description", productSelected.value.description);
        formData.append("is_discount", productSelected.value.is_discount+"");
        formData.append("max_discount", productSelected.value.max_discount+"");
        formData.append("disponiblidad", productSelected.value.disponiblidad+"");
        formData.append("include_igv", productSelected.value.include_igv+"");
        formData.append("is_icbper", productSelected.value.is_icbper+"");
        formData.append("is_ivap", productSelected.value.is_ivap+"");
        formData.append("unidad_medida", productSelected.value.unidad_medida);
        formData.append("stock", productSelected.value.stock+"");
        const isIsc = (productSelected.value as Record<string, unknown>).is_isc ?? 0;
        formData.append("is_isc", `${isIsc}`);
        formData.append("percentage_isc", productSelected.value.percentage_isc+"");
        formData.append("is_especial_nota", productSelected.value.is_especial_nota+"");
        if(FILE_IMAGEN.value){
            formData.append("image", FILE_IMAGEN.value);
        }

        const res: AxiosResponse<ProductResponse> =
            await HttpClient.post(
            "products/"+productSelected.value?.id,formData);
            
        
        console.log(res);
        if(res.data.code == 405){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                res.data.message,
                "error"
            );
        }else{
            ModalRegisterProduct.value = false;
            if(res.data.product){
                let index = products.value.findIndex((prod) => prod.id === productSelected.value?.id);
                if(index !== -1){
                        products.value[index] = res.data.product;
                }
            }
            
            (Swal as TVueSwalInstace).fire(
                "Genial!",
                res.data.message,
                "success"
            );
        }
    }catch(error: any){
        console.log(error);
        if(error.response?.data){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                error.response?.data.message,
                "error"
            );
        }
    }
}

const editProduct = (product:Product) =>{
    ModalRegisterProduct.value = true;
    productSelected.value = product;
    name.value = productSelected.value.title;
    state.value = productSelected.value.state;
    IMAGEN_PREVIZUALIZA.value = product.imagen ?? '';
    FILE_IMAGEN.value = undefined;
}

const deleteProduct = (product:Product) =>{
    try{
        (Swal as TVueSwalInstace)
            .fire({
                title: "¿Estás seguro?",
                text: `¿Quietes eliminar el producto ${product.title}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            })
            .then(async (result :any) => {
                if(result.isConfirmed){
                    const res : AxiosResponse<ProductResponse> = await HttpClient.delete(
                        "products/" + product.id
                    );
                    console.log(res);
                    (Swal as TVueSwalInstace).fire(
                        "Eliminado!",
                        "El producto '" + product.title + "' ha sido eliminado",
                        "success"
                    );
                    let index = products.value.findIndex(prod => prod.id === product.id);
                    if(index !== -1){
                        products.value.splice(index, 1);
                    }
                }
            });
    }catch(error){
        console.error(error);
    }
}
const loadFile = ($event:any) => {
    if($event.target.files[0].type.indexOf("image") < 0){
        IMAGEN_PREVIZUALIZA.value = null;
        (Swal as TVueSwalInstace).fire(
            "Upps!",
            "Solamente se permiten archivos de tipo imagen.",
            "error"
        );
        return;
    }
    FILE_IMAGEN.value = $event.target.files[0];
    let reader = new FileReader();
    if(FILE_IMAGEN.value){
        reader.readAsDataURL(FILE_IMAGEN.value);
        reader.onloadend = () => IMAGEN_PREVIZUALIZA.value = reader.result;
    }
}
const clearfile = () => {
    name.value = "";
    state.value = 1;
    IMAGEN_PREVIZUALIZA.value = "";
    FILE_IMAGEN.value = undefined;
}
const reset = () => {
    search.value = null;
    list();
}
watch(currentPage, (value) => {
    list();
});
watch(ModalRegisterProduct, (value) => {
    if (value == false){
        productSelected.value = undefined;
        clearfile();
    }
    
});
onMounted(() => {
    list();
});
</script>