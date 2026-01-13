<template>
    <DefaultLayout>
        <b-card>
            <b-card-header>
                <b-card-title>🛍️ REGISTRAR PRODUCTO</b-card-title>
            </b-card-header>
            <b-card-body class="pt-0">
                <b-row>
                    <b-col lg="5" md="5">
                        <label for="name-product" class="col-form-label text-lg-end">Nombre del Producto: </label>
                        <b-form-input
                            type="text"
                            id="name-product"
                            v-model="title"
                            placeholder="Example: Pollos"
                        />
                    </b-col>
                    <b-col lg="4" md="4">
                        <label for="sku-product" class="col-form-label text-lg-end">Sku: </label>
                        <b-form-input
                            type="text"
                            id="sku-product"
                            v-model="sku"
                            placeholder="Example: FE4RFF"
                        />
                    </b-col>
                    <b-col lg="3" md="3">
                        <label for="categorie-product" class="col-form-label text-lg-end">Categoria: </label>
                        <b-form-select id="type_category_list" v-model="categorie_id">
                            <option value="">Selec. Categoria</option>
                            <template v-for="(categorie, index) in categories" :key="index">
                                <option :value="categorie.id">{{ categorie.name }}</option>
                            </template>
                        </b-form-select>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="3" md="3">
                        <label for="price-final-product" class="col-form-label text-lg-end">Precio Cliente Final: </label>
                        <b-form-input
                            type="number"
                            v-model="price_general"
                            id="price-final-product"
                            placeholder="Example: 150"
                        />
                    </b-col>
                    <b-col lg="3" md="3">
                        <label for="price-empresa-product" class="col-form-label text-lg-end">Precio Cliente Empresa: </label>
                        <b-form-input
                            type="number"
                            v-model="price_company"
                            id="price-empresa-product"
                            placeholder="Example: 250"
                        />
                    </b-col>
                    <b-col lg="5" md="5">
                        <label for="description-product" class="col-form-label text-lg-end">Descripción: </label>
                        <b-form-textarea type="textarea" v-model="description" rows="5" id="description-product" />
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="3" md="2">
                        <label for="is-discount-product" class="col-form-label text-lg-end">Descuento: </label>
                        <div class="d-flex">
                            <b-form-radio name="is_discount" @click="is_discount = 1" value="1" :checked="is_discount == 1" >No</b-form-radio>
                            {{ " " }}
                            <b-form-radio name="is_discount" @click="is_discount = 2" value="2" :checked="is_discount == 2" class="mx-1">Si</b-form-radio>
                        </div>
                    </b-col>
                    <b-col lg="3" md="3" v-if="is_discount == 2">
                        <label for="discount-amount-product" class="col-form-label text-lg-end">Porcentaje: </label>
                        <b-form-input
                            type="number"
                            v-model="max_discount"
                            id="discount-amount-product"
                            placeholder="Example: 60%"
                        />
                    </b-col>

                    <b-col lg="3" md="3">
                        <label for="disponiblidad-product" class="col-form-label text-lg-end">Disponiblidad: </label>
                        <b-form-radio name="disponiblidad" @click="disponiblidad = 1" value="1" :checked="disponiblidad == 1">Vender los productos sin stock</b-form-radio>
                        <b-form-radio name="disponiblidad" @click="disponiblidad = 2" value="2" :checked="disponiblidad == 2">No vender los productos sin stock</b-form-radio>
                    </b-col>

                    <b-col lg="3" md="3">
                        <label for="is_icbper-product" class="col-form-label text-lg-end">Bolsa de Plastico: </label>
                        <b-form-radio name="is_icbper" @click="is_icbper = 0" value="0" :checked="is_icbper == 0">No</b-form-radio>
                        <b-form-radio name="is_icbper" @click="is_icbper = 1" value="1" :checked="is_icbper == 1">Si</b-form-radio>
                    </b-col>

                    <b-col lg="3" md="3">
                        <label for="is_ivap-product" class="col-form-label text-lg-end">Arroz Pilado: </label>
                        <b-form-radio name="is_ivap" @click="is_ivap = 0" value="0" :checked="is_ivap == 0">No</b-form-radio>
                        <b-form-radio name="is_ivap" @click="is_ivap = 1" value="1" :checked="is_ivap == 1">Si</b-form-radio>
                    </b-col>
                    <b-col lg="2" md="3">
                        <label for="is_isc-product" class="col-form-label text-lg-end">ISC: </label>
                        <div class="d-flex">
                            <b-form-radio name="is_isc" @click="is_isc = 0" value="0" :checked="is_isc == 0">No</b-form-radio>
                            <b-form-radio name="is_isc" @click="is_isc = 1" class="mx-1" value="1" :checked="is_isc == 1">Si</b-form-radio>
                        </div>
                    </b-col>
                    <b-col lg="2" md="3" v-if="is_isc == 1">
                        <label for="isc-amount-product" class="col-form-label text-lg-end">Porcentaje: </label>
                        <b-form-input
                            type="number"
                            v-model="percentage_isc"
                            id="isc-amount-product"
                            placeholder="Example: 60%"
                        />
                    </b-col>
                    <b-col lg="2" md="3">
                        <label for="is_especial_nota-product" class="col-form-label text-lg-end">¿Para Nota Electronica?: </label>
                        <div class="d-flex">
                            <b-form-radio name="is_especial_nota" @click="is_especial_nota = 0" value="0" :checked="is_especial_nota == 0">No</b-form-radio>
                            <b-form-radio name="is_especial_nota" @click="is_especial_nota = 1" class="mx-1" value="1" :checked="is_especial_nota == 1">Si</b-form-radio>
                        </div>
                    </b-col>
                    <b-col lg="1" md="1">
                        <label for="include_igv-product" class="col-form-label text-lg-end">Incluye IGV: </label>
                        <b-form-radio name="include_igv" @click="include_igv = 1" value="1" :checked="include_igv == 1">No</b-form-radio>
                        <b-form-radio name="include_igv" @click="include_igv = 2" value="2" :checked="include_igv == 2">Si</b-form-radio>
                    </b-col>
                    <b-col lg="2" md="2">
                        <label for="price_base_igv" class="col-form-label text-lg-end">Precio Base C.F: </label>
                        S/. <span>{{ getPriceBaseCF() }}</span>
                        <label for="price_base_igv" class="col-form-label text-lg-end">Precio Base C.E: </label>
                        S/. <span>{{ getPriceBaseCE() }}</span>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col lg="3" md="3">
                        <label for="units-product" class="col-form-label text-lg-end">Unidades: </label>
                        <b-form-select id="type_units_list" v-model="unidad_medida">
                            <option value="">Selec. Unidad</option>
                            <template v-for="(unit, index) in units" :key="index">
                                <option :value="unit.code">{{ unit.name }}</option>
                            </template>
                        </b-form-select>
                    </b-col>
                    <b-col lg="3" md="3">
                        <label for="stock-product" class="col-form-label text-lg-end">Stock: </label>
                        <b-form-input
                            type="number"
                            id="stock-product"
                            v-model="stock"
                            placeholder="Example: 5"
                        />
                    </b-col>
                    <b-col lg="5">
                        <label for="imagen-product" class="col-form-label text-lg-end">Imagen: </label>
                        <b-input-group class="mb-3">
                            <b-form-file @change="loadFile($event)"  />
                            <b-input-group-text>Upload</b-input-group-text>
                        </b-input-group>

                        <img v-if="IMAGEN_PREVIZUALIZA" :src="IMAGEN_PREVIZUALIZA" alt="" width="150px" class="rounded d-block mx-auto" />
                    </b-col>


                    <b-col lg="12" class="mt-3">
                        <div class="modal-footer">
                            <b-button type="button" variant="primary" @click="store">
                                Guardar
                            </b-button>
                        </div>
                    </b-col>
                </b-row>
            </b-card-body>
        </b-card>
    </DefaultLayout>
</template>
<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { ref } from 'vue';

const title = ref<string>("");
const sku = ref<string>("");
const categorie_id = ref<string>("");
const categories = ref<any[]>([]);
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
const unidad_medida = ref<string>("");
const units = ref<any[]>([]);
const stock = ref<number>(0);
</script>
