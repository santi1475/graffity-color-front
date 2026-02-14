<template>
    <DefaultLayout>
            <b-row>
                <b-col cols="12">
                    <b-card no-body>
                        <b-card-body class="p-0">
                            <b-row class="g-0 h-100">
                                <b-col lg="7" class="border-end">
                                    <b-card-title class="fs-16 mb-0 pt-3 ps-4">🛍️ REGISTRAR PRODUCTO</b-card-title>
                                    <b-form class="p-4 pt-3">
                                        <b-form-group
                                            label= "Nombre del Producto:"
                                            class="mb-2 mb-lg-1"
                                        >
                                            <b-form-input
                                                type="text"
                                                id="name-product"
                                                v-model="title"
                                                placeholder="Example: Lapicero"
                                            />
                                        </b-form-group>
                                        <b-form-group>
                                            <b-row> 
                                               <b-col lg="4" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="sku-product" class="form-label mt-2">Categoría: </label>
                                                    <b-form-select id="type_category_list" v-model="categorie_id">
                                                        <option value="">Selec. Categoria</option>
                                                        <template v-for="(categorie, index) in categories" :key="index">
                                                            <option :value="categorie.id">{{ categorie.title }}</option>
                                                        </template>
                                                    </b-form-select>
                                               </b-col> 
                                               <b-col lg="4" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="sku-product" class="form-label mt-2">Marca: </label>
                                                    <b-form-select id="type_brand_list" v-model="brand_id">
                                                        <option value="">Selec. Marca</option>
                                                        <template v-for="(brand, index) in brands" :key="index">
                                                            <option :value="brand.id">{{ brand.name }}</option>
                                                        </template>
                                                    </b-form-select>
                                               </b-col> 
                                               <b-col lg="4" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="sku-product" class="form-label mt-2">Sku: </label>
                                                    <b-form-input
                                                        type="text"
                                                        id="sku-product"
                                                        v-model="sku"
                                                        placeholder="Example: FE4RFF"
                                                    />
                                               </b-col> 
                                            </b-row>
                                            <b-row>
                                                <b-col lg="4" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="price-final-product" class="form-label mt-2">Precio Cliente Final: </label>
                                                    <b-form-input
                                                        type="number"
                                                        v-model="price_general"
                                                        id="price-final-product"
                                                        placeholder="Example: 150"
                                                    />
                                               </b-col> 
                                               <b-col lg="4" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="price-final-product" class="form-label mt-2">Precio Cliente Empresa: </label>
                                                    <b-form-input
                                                        type="number"
                                                        v-model="price_company"
                                                        id="price-empresa-product"
                                                        placeholder="Example: 250"
                                                    />
                                               </b-col> 
                                            </b-row>
                                            <b-row>
                                                <b-col lg="3" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="is-discount-product" class="col-form-label text-lg-end">Descuento: </label>
                                                        <div class="d-flex">
                                                            <b-form-radio name="is_discount" @click="is_discount = 1" value="1" :checked="is_discount == 1" >No</b-form-radio>
                                                            {{ " " }}
                                                            <b-form-radio name="is_discount" @click="is_discount = 2" value="2" :checked="is_discount == 2" class="mx-1">Si</b-form-radio>
                                                        </div>
                                               </b-col> 
                                               <b-col lg="4" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="discount-amount-product" class="col-form-label text-lg-end">Porcentaje: </label>
                                                    <b-form-input
                                                        type="number"
                                                        v-model="max_discount"
                                                        id="discount-amount-product"
                                                        placeholder="Example: 60%"
                                                    />
                                               </b-col> 
                                               <b-col lg="5" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="disponiblidad-product" class="col-form-label text-lg-end">Disponiblidad: </label>
                                                    <b-form-radio name="disponiblidad" @click="disponiblidad = 1" value="1" :checked="disponiblidad == 1">Vender los productos sin stock</b-form-radio>
                                                    <b-form-radio name="disponiblidad" @click="disponiblidad = 2" value="2" :checked="disponiblidad == 2">No vender los productos sin stock</b-form-radio>
                                               </b-col>
                                            </b-row>
                                            <b-row>
                                                <b-col lg="4" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="is_icbper-product" class="col-form-label text-lg-end">Bolsa de Plastico: </label>
                                                    <div class="d-flex">
                                                        <b-form-radio name="is_icbper" @click="is_icbper = 0" value="0" :checked="is_icbper == 0">No</b-form-radio>
                                                        <b-form-radio name="is_icbper" @click="is_icbper = 1" value="1" :checked="is_icbper == 1">Si</b-form-radio>    
                                                    </div>
                                               </b-col> 
                                               <b-col lg="4" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="is_ivap-product" class="col-form-label text-lg-end">Arroz Pilado: </label>
                                                    <div class="d-flex">
                                                        <b-form-radio name="is_ivap" @click="is_ivap = 0" value="0" :checked="is_ivap == 0">No</b-form-radio>
                                                        <b-form-radio name="is_ivap" @click="is_ivap = 1" value="1" :checked="is_ivap == 1">Si</b-form-radio>
                                                    </div>
                                               </b-col>
                                               <b-col lg="4" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="is_isc-product" class="col-form-label text-lg-end">ISC: </label>
                                                    <div class="d-flex">
                                                        <b-form-radio name="is_isc" @click="is_isc = 0" value="0" :checked="is_isc == 0">No</b-form-radio>
                                                        <b-form-radio name="is_isc" @click="is_isc = 1" class="mx-1" value="1" :checked="is_isc == 1">Si</b-form-radio>
                                                    </div>
                                               </b-col>
                                            </b-row>
                                            <b-row>
                                                <b-col lg="4" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="isc-amount-product" class="col-form-label text-lg-end">Porcentaje: </label>
                                                    <b-form-input
                                                        type="number"
                                                        v-model="percentage_isc"
                                                        id="isc-amount-product"
                                                        placeholder="Example: 60%"
                                                    />
                                               </b-col>
                                               <b-col lg="5" cols="6" class="mb-2 mb-lg-1">
                                                    <label for="is_especial_nota-product" class="col-form-label text-lg-end">¿Para Nota Electronica?: </label>
                                                    <div class="d-flex">
                                                        <b-form-radio name="is_especial_nota" @click="is_especial_nota = 0" value="0" :checked="is_especial_nota == 0">No</b-form-radio>
                                                        <b-form-radio name="is_especial_nota" @click="is_especial_nota = 1" class="mx-1" value="1" :checked="is_especial_nota == 1">Si</b-form-radio>
                                                    </div>
                                               </b-col>
                                            </b-row>
                                            <b-row>
                                                <b-col lg="3" md="1">
                                                    <label for="include_igv-product" class="col-form-label text-lg-end">Incluye IGV: </label>
                                                    <div class="d-flex">
                                                        <b-form-radio name="include_igv" @click="include_igv = 1" value="1" :checked="include_igv == 1">No</b-form-radio>
                                                        <b-form-radio name="include_igv" @click="include_igv = 2" class="mx-1" value="2" :checked="include_igv == 2">Si</b-form-radio>
                                                    </div>
                                                </b-col>
                                                <b-col lg="4" md="2">
                                                    <label for="price_base_igv" class="col-form-label text-lg-end me-3">Precio Base C.F: </label>
                                                    S/. <span >{{ getPriceBaseCF() }}</span>
                                                    <label for="price_base_igv" class="col-form-label text-lg-end me-3">Precio Base C.E: </label>
                                                    S/. <span>{{ getPriceBaseCE() }}</span>
                                                </b-col>
                                            </b-row>
                                            <b-row>
                                                <b-col lg="5" md="3">
                                                    <label for="units-product" class="col-form-label text-lg-end">Unidades: </label>
                                                    <b-form-select id="type_units_list" v-model="unidad_medida">
                                                        <option value="">Selec. Unidad</option>
                                                        <template v-for="(unit, index) in units" :key="index">
                                                            <option :value="unit.code">{{ unit.name }}</option>
                                                        </template>
                                                    </b-form-select>
                                                </b-col>
                                                <b-col lg="5" md="3">
                                                    <label for="stock-product" class="col-form-label text-lg-end">Stock: </label>
                                                    <b-form-input
                                                        type="number"
                                                        id="stock-product"
                                                        v-model="stock"
                                                        placeholder="Example: 5"
                                                    />
                                                </b-col>
                                            </b-row>
                                        </b-form-group>
                                    </b-form>
                                </b-col>
                                <b-col lg="5" class="align-self-center">
                                    <b-row class="align-self-center">
                                        <b-col class="d-flex justify-content-start ps-4">
                                            <label>ESCANER DE CÓDIGO DE BARRAS</label>
                                        </b-col>
                                        <b-col>
                                                <b-button variant="outline-secondary"">Escanear</b-button>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col lg="6" cols="2" class="ms-3">
                                            <label for="isc-amount-product" class="col-form-label text-lg-end">Codigo: </label>
                                            <b-form-input
                                                type="number"
                                                v-model="percentage_isc"
                                                id="isc-amount-product"
                                                placeholder="Example: 60%"
                                            />
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-form class="p-4 pb-0">
                                            <label for="description-product" class="col-form-label text-lg-end">Descripción: </label>
                                            <b-form-textarea type="textarea" v-model="description" rows="5" id="description-product"/>
                                        </b-form>
                                    </b-row>
                                    <b-row>
                                        <b-form class="p-4 pt-2">
                                            <label for="image-product" class="col-form-label text-lg-end">Imagen del Producto: </label>
                                            <b-form-file id="image-product" @change="loadFile" accept="image/*"/>
                                            <div v-if="IMAGEN_PREVIZUALIZA" class="mt-3">
                                                <b-img :src="IMAGEN_PREVIZUALIZA" thumbnail fluid alt="Imagen del producto"/>
                                            </div>
                                        </b-form>
                                    </b-row>
                                    <b-row>
                                        <b-col class="d-flex justify-content-end me-3   ">
                                            <b-button variant="secondary" @click="clearFile">Limpiar</b-button>
                                            <b-button variant="primary" class="ms-2" @click="store">Registrar Producto</b-button>
                                        </b-col>
                                    </b-row>
                                </b-col>
                            </b-row>
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>
    </DefaultLayout>
</template>
<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { onMounted, ref, watch } from 'vue';
import HttpClient from '@/helpers/http-client';
import type { AxiosResponse } from 'axios';
import { UNITS, type ProductConfigResponse } from '@/types/products';

const title = ref<string>("");
const sku = ref<string>("");
const categorie_id = ref<string>("");
const categories = ref<ProductCategorie[]>([]);
const brand_id = ref<string>("");
const brands = ref<ProductBrand[]>([]);
const next_product_id = ref<number | null>(null);
const price_general = ref<number>(0);
const price_company = ref<number>(0);
const description = ref<string>("");
const is_discount = ref<number>(1);
const max_discount = ref<number>(0);
const disponiblidad = ref<number>(1);
const is_icbper = ref<number>(0);
const is_ivap = ref<number>(0);
const is_isc = ref<number>(0);
const percentage_isc = ref<number>(0);
const is_especial_nota = ref<number>(0);
const include_igv = ref<number>(1);
const unidad_medida = ref<string>("NIU");
const units = ref<ProductsUnit[]>(UNITS);
const stock = ref<number>(0);
const FILE_IMAGEN = ref<File | null>(null);
const IMAGEN_PREVIZUALIZA = ref<string | ArrayBuffer | null>(null);
const currentPage = ref<number>(1);
const search = ref<string | null>(null);


import Swal from "sweetalert2/dist/sweetalert2.js";
import type { ProductBrand, ProductCategorie, ProductResponse, ProductsUnit } from '@/types/products';
type TVueSwalInstace = typeof Swal & typeof Swal.fire;

const getPriceBaseCF = () => {
    return include_igv.value == 1 ? price_general.value : Number((price_general.value / 1.18).toFixed(6));
};
const getPriceBaseCE = () => {
    return include_igv.value == 1 ? price_company.value : Number((price_company.value / 1.18).toFixed(6));
};

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
    FILE_IMAGEN
.value = $event.target.files[0];
    let reader = new FileReader();
    if(FILE_IMAGEN
.value){
        reader.readAsDataURL(FILE_IMAGEN
    .value);
        reader.onloadend = () => IMAGEN_PREVIZUALIZA.value = reader.result;
    }
}

const config = async () => {
    try {
        const res: AxiosResponse<ProductConfigResponse> = await HttpClient.get(
            'products/config');
        console.log(res);
        categories.value = res.data.categories;
        brands.value = res.data.brands;
        next_product_id.value = res.data.next_product_id ?? null;
        generateSKU();
        
    } catch (error) {
        console.error(error);
    }
};

const store = async()=>{
    try{
        if(!title.value.trim()){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "El nombre del producto es obligatorio.",
                "warning"
            );
            return;
        }
        if(!sku.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "El sku del producto es obligatorio.",
                "warning"
            );
            return;
        }
        if(!categorie_id.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "La categoria del producto es obligatoria.",
                "warning"
            );
            return;
        }
        if(!brand_id.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "La marca del producto es obligatoria.",
                "warning"
            );
            return;
        }
        if(!unidad_medida.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "La unidad de medida del producto es obligatoria.",
                "warning"
            );
            return;
        }
        if(!description.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "La descripción del producto es obligatoria.",
                "warning"
            );
            return;
        }
        if(!is_discount.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Debe seleccionar si el producto tiene descuento o no.",
                "warning"
            );
            return;
        }
        if(is_discount.value === 2 && max_discount.value <= 0){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Debe poner el porcentaje del descuento.",
                "warning"
            );
            return;
        }
        if(is_isc.value === 1 && percentage_isc.value <= 0){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Debe poner el porcentaje del ISC.",
                "warning"
            );
            return;
        }
        if(!FILE_IMAGEN.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "La imagen del producto es obligatoria.",
                "warning"
            );
            return;
        }
        if(price_general.value < 0){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "El precio para cliente final debe ser mayor a 0.",
                "warning"
            );
            return;
        }
        if(price_company.value < 0){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "El precio para un cliente empresa debe ser mayor a 0.",
                "warning"
            );
            return;
        }
        if(stock.value < 0){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "El stock del producto debe ser mayor o igual a 0.",
                "warning"
            );
            return;
        }
        let formData = new FormData();
        formData.append("title",title.value);
        formData.append("sku",sku.value);
        formData.append("categorie_id",categorie_id.value);
        formData.append("brand_id",brand_id.value);
        formData.append("price_general",price_general.value+"");
        formData.append("price_company",price_company.value+"");
        formData.append("description",description.value);
        formData.append("is_discount",is_discount.value+"");
        formData.append("max_discount",max_discount.value+"");
        formData.append("disponiblidad",disponiblidad.value+"");
        formData.append("include_igv",include_igv.value+"");
        formData.append("is_icbper",is_icbper.value+"");
        formData.append("is_ivap",is_ivap.value+"");
        formData.append("unidad_medida",unidad_medida.value+"");
        formData.append("stock",stock.value+"");

        formData.append("is_isc",is_isc.value+"");
        formData.append("percentage_isc",percentage_isc.value+"");
        formData.append("is_especial_nota",is_especial_nota.value+"");
        formData.append("image",FILE_IMAGEN.value);

        const res: AxiosResponse<ProductResponse> = await HttpClient.post('products',formData);
        console.log(res);
        
        if(res.data.code === 405){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                res.data.message,
                "error"
            );
            clearFile();
        }else{
            (Swal as TVueSwalInstace).fire(
                "¡Éxito!",
                res.data.message,
                "success"
            );
            clearFile();
        }

    }
    catch(error:any){
        if(error.response?.data){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                error.response?.data.message,
                "error"
            );
        }
    }
}
const clearFile = () => {
    title.value = "";
    sku.value = "";
    categorie_id.value = "";
    brand_id.value = "";
    price_general.value = 0;
    price_company.value = 0;
    description.value = "";
    is_discount.value = 1;
    max_discount.value = 0;
    disponiblidad.value = 1;
    is_icbper.value = 0;
    is_ivap.value = 0;
    is_isc.value = 0;
    percentage_isc.value = 0;
    is_especial_nota.value = 0;
    include_igv.value = 1;
    unidad_medida.value = "NIU";
    stock.value = 0;
    FILE_IMAGEN.value = null;
    IMAGEN_PREVIZUALIZA.value = null;
}
const generateSKU = () =>{
    if (!next_product_id.value) {
        sku.value = "";
        return;
    }
    const brand = brands.value.find((item) => item.id === brand_id.value);
    const category = categories.value.find((item) => item.id === categorie_id.value);
    const brandPrefix = brand?.name ? brand.name.slice(0, 3).toUpperCase() : "GEN";
    const categoryPrefix = category?.title ? category.title.slice(0, 3).toUpperCase() : "VAR";
    const correlative = String(next_product_id.value).padStart(8, "0");
    sku.value = `${brandPrefix}-${categoryPrefix}-${correlative}`;
}
onMounted(()=>{
    config();
});

watch([brand_id, categorie_id], () => {
    generateSKU();
});
</script>