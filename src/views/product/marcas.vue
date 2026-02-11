<template>
    <DefaultLayout>
        <b-row class="justify-content-center">
            <b-col cols="12">
                <b-card>
                    <b-card-header>
                        <b-row class="align-items-center justify-content-between">
                            <b-col lg="3">
                                <b-card-title>🏷️ Marcas</b-card-title>
                            </b-col>
                            <b-col lg="2">
                                <b-button type="button" variant="success" @click="ModalRegisterBrand = !ModalRegisterBrand">
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
                                    placeholder="Buscar por nombre"
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
                                    <b-th>Marca</b-th>
                                    <b-th>Estado</b-th>
                                    <b-th>Fecha Registro</b-th>
                                    <b-th class="text-end">Accion</b-th>
                                </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr v-for="(brand, index) in brands" :key="index">
                                    <b-td>
                                        <div>
                                            <img
                                                v-bind:src="brand.image || ''"
                                                alt="image"
                                                style="border-radius: 50%; width: 52px; height: 52px; object-fit: cover; margin-right: 12px;"
                                            />
                                            <span class="mk-2">
                                                {{ brand.name }}
                                            </span>
                                        </div>
                                    </b-td>
                                    <b-td>
                                        <b-badge variant="primary" v-if="brand.state == 1">Activo</b-badge>
                                        <b-badge variant="danger" v-if="brand.state == 2">Inactivo</b-badge>
                                    </b-td>
                                    <b-td>
                                        {{ brand.created_at }}
                                    </b-td>
                                    <b-td class="text-end">
                                        <a href="#" @click="editBrand(brand)">
                                            <i class="las la-pen text-secondary fs-22"></i>
                                        </a>
                                        {{ " " }}
                                        <a href="#" @click="deleteBrand(brand)">
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
        <b-modal
            v-model="ModalRegisterBrand"
            :title="`🔐${brandSelected ? 'Edicion' : 'Registro'} de Marca`"
            :header-class="`bg-${themeColor}`"
            title-class="m-0 text-white"
            :ok-variant="themeColor"
            hide-footer
            centered
            size="lg"
        >
            <b-row>
                <b-col lg="8">
                    <label for="name-brand" class="col-form-label text-lg-end">Nombre de Marca: </label>
                    <b-form-input
                        type="text"
                        id="name-brand"
                        v-model="name"
                        placeholder="Example: Nike"
                    />
                </b-col>
                <b-col lg="3">
                    <label for="state-brand" class="col-form-label text-lg-end">Estado: </label>
                    <b-form-radio name="state-brand" @click="state = 1" value="1" :checked="state == 1">Activo</b-form-radio>
                    {{ " " }}
                    <b-form-radio name="state-brand" @click="state = 2" value="2" :checked="state == 2">Inactivo</b-form-radio>
                </b-col>
            </b-row>
            <b-row>
                <b-col lg="6">
                    <IconSelector 
                        v-model="icon_name"
                        label="Icono de Marca"
                    />
                </b-col>
                <b-col lg="6">
                    <label for="image-brand" class="col-form-label text-lg-end">Imagen de Marca: </label>
                    <b-input-group class="mb-3">
                        <b-form-file @change="loadFile($event)" />
                        <b-input-group-text>Upload</b-input-group-text>
                    </b-input-group>
                    <img v-if="IMAGEN_PREVIZUALIZA" :src="String(IMAGEN_PREVIZUALIZA)" alt="" width="100px" class="rounded d-block mx-auto" />
                </b-col>
            </b-row>
            <b-col lg="12" class="mt-3">
                <div class="modal-footer">
                    <b-button
                        type="button"
                        variant="secondary"
                        @click="ModalRegisterBrand = !ModalRegisterBrand"
                    >
                        Cerrar
                    </b-button>
                    <b-button type="button" variant="primary" @click="store">
                        {{ brandSelected ? 'Editar' : 'Guardar' }}
                    </b-button>
                </div>
            </b-col>
        </b-modal>
    </DefaultLayout>
</template>
<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import IconSelector from '@/layouts/components/IconSelector.vue';
import HttpClient from '@/helpers/http-client';
import type { Brand, Brands, BrandResponse } from '@/types/brands';
import type { AxiosResponse } from 'axios';
import { onMounted, ref, watch } from 'vue';
import Swal from "sweetalert2/dist/sweetalert2.js";
type TVueSwalInstace = typeof Swal & typeof Swal.fire;

const brands = ref<Brand[]>([]);
const currentPage = ref<number>(1);
const totalPages = ref<number>(0);
const perPageRows = ref<number>(1);
const search = ref<string | null>(null);
const ModalRegisterBrand = ref<boolean>(false);
const themeColor = ref("primary" as const);
const brandSelected = ref<Brand | undefined>(undefined);

const name = ref<string>("");
const icon_name = ref<string>("Badge");
const state = ref<number>(1);
const IMAGEN_PREVIZUALIZA = ref<string | ArrayBuffer | null>("");
const FILE_IMAGEN = ref<File | undefined>(undefined);

const normalizeBrand = (brand: Brand): Brand => {
    return {
        ...brand,
        icon_name: brand.icon_name ?? "Badge",
        image: brand.image ?? null,
    };
};

const list = async () => {
    try {
        const res: AxiosResponse<Brands> = await HttpClient.get(
            "brands?page=" + currentPage.value + "&search=" + (search.value ? search.value : "")
        );
        brands.value = res.data.brands.map(normalizeBrand);
        totalPages.value = res.data.total;
        perPageRows.value = res.data.paginate;
    } catch (error) {
        console.error("Error fetching brands:", error);
    }
};

const store = async () => {
    try {
        if (!name.value) {
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Necesitas ingresar el nombre de la marca.",
                "error"
            );
            return;
        }

        const formData = new FormData();
        formData.append("name", name.value);
        formData.append("state", state.value + "");
        formData.append("icon_name", icon_name.value);
        if (FILE_IMAGEN.value) {
            formData.append("image", FILE_IMAGEN.value);
        }

        const res: AxiosResponse<BrandResponse> = !brandSelected.value
            ? await HttpClient.post("brands", formData)
            : await HttpClient.post("brands/" + brandSelected.value?.id, formData);

        if (res.data.code == 405 || res.data.code == 400) {
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                res.data.message,
                "error"
            );
        } else {
            ModalRegisterBrand.value = false;
            if (!brandSelected.value) {
                if (res.data.brand) {
                    brands.value.unshift(normalizeBrand(res.data.brand));
                }
            } else {
                const index = brands.value.findIndex((item) => item.id === brandSelected.value?.id);
                if (index !== -1) {
                    if (res.data.brand) {
                        brands.value[index] = normalizeBrand(res.data.brand);
                    }
                }
            }

            (Swal as TVueSwalInstace).fire(
                "Genial!",
                res.data.message,
                "success"
            );
        }
    } catch (error: any) {
        if (error.response?.data) {
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                error.response?.data.message,
                "error"
            );
        }
    }
};

const editBrand = (brand: Brand) => {
    ModalRegisterBrand.value = true;
    brandSelected.value = brand;
    name.value = brandSelected.value.name;
    icon_name.value = brandSelected.value.icon_name ?? "Badge";
    IMAGEN_PREVIZUALIZA.value = brand.image ?? "";
    FILE_IMAGEN.value = undefined;
};

const deleteBrand = (brand: Brand) => {
    try {
        (Swal as TVueSwalInstace)
            .fire({
                title: "¿Estas seguro?",
                text: `¿Quietes eliminar la marca ${brand.name}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "Cancelar",
            })
            .then(async (result: any) => {
                if (result.isConfirmed) {
                    const res: AxiosResponse<BrandResponse> = await HttpClient.delete(
                        "brands/" + brand.id
                    );
                    console.log(res);
                    (Swal as TVueSwalInstace).fire(
                        "Eliminado!",
                        "La marca '" + brand.name + "' ha sido eliminada",
                        "success"
                    );
                    const index = brands.value.findIndex((item) => item.id === brand.id);
                    if (index !== -1) {
                        brands.value.splice(index, 1);
                    }
                }
            });
    } catch (error) {
        console.error(error);
    }
};

const loadFile = ($event: any) => {
    if ($event.target.files[0].type.indexOf("image") < 0) {
        IMAGEN_PREVIZUALIZA.value = null;
        (Swal as TVueSwalInstace).fire(
            "Upps!",
            "Solamente se permiten archivos de tipo imagen.",
            "error"
        );
        return;
    }
    FILE_IMAGEN.value = $event.target.files[0];
    const reader = new FileReader();
    if (FILE_IMAGEN.value) {
        reader.readAsDataURL(FILE_IMAGEN.value);
        reader.onloadend = () => (IMAGEN_PREVIZUALIZA.value = reader.result);
    }
};

const clearfile = () => {
    name.value = "";
    icon_name.value = "Badge";
    state.value = 1;
    IMAGEN_PREVIZUALIZA.value = "";
    FILE_IMAGEN.value = undefined;
};

const reset = () => {
    search.value = null;
    list();
};

watch(currentPage, () => {
    list();
});

watch(ModalRegisterBrand, (value) => {
    if (value == false) {
        brandSelected.value = undefined;
        clearfile();
    }
});

onMounted(() => {
    list();
});

</script>