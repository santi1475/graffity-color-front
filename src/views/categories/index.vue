<template>
    <DefaultLayout>
        <b-row class="justify-content-center">
            <b-col cols="12">
                <b-card>
                    <b-card-header>
                        <b-row class="align-items-center justify-content-between">
                            <b-col lg="3">
                                <b-card-title>🗿 Categorias</b-card-title>
                            </b-col>
                            <b-col lg="2">
                                <b-button type="button" variant="success" @click="ModalRegisterCategorie = !ModalRegisterCategorie">
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
                                    <b-th>Categoria</b-th>
                                    <b-th>Estado</b-th>
                                    <b-th>Fecha Registro</b-th>
                                    <b-th class="text-end">Acción</b-th>
                                </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr v-for="(categorie, index) in categories" :key="index">
                                    <b-td>
                                        <div>
                                            <img :src="categorie.imagen" 
                                                alt="image" 
                                                style="border-radius: 50%; width: 52px; height: 52px; object-fit: cover; margin-right: 12px;"
                                            />
                                            <span class="mk-2">
                                                {{ categorie.title }}
                                            </span>
                                        </div>
                                    </b-td>
                                    <b-td>
                                        <b-badge variant="primary" v-if="categorie.state == 1">Activo</b-badge>
                                            <b-badge variant="danger" v-if="categorie.state == 2">Inactivo</b-badge>
                                    </b-td>
                                    <b-td>
                                        {{ categorie.created_at }}
                                    </b-td>
                                    <b-td class="text-end">
                                        <a href="#" 
                                            @click="editCategorie(categorie)"
                                        >
                                            <i class="las la-pen text-secondary fs-22"></i>
                                        </a>
                                        {{ " " }}
                                        <a href="#" 
                                            @click="deleteCategorie(categorie)"
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
        <b-modal
            v-model="ModalRegisterCategorie"
            :title="`🔐${categorieSelected ? 'Edición' : 'Registro'} de Categoria`"
            :header-class="`bg-${themeColor}`"
            title-class="m-0 text-white"
            :ok-variant="themeColor"
            hide-footer
            centered
            size="lg"
            >
            <b-row>
                    <b-col lg="8">
                        <label for="name-user" class="col-form-label text-lg-end">Nombre de Categoria: </label>
                        <b-form-input
                            type="text"
                            id="name-user"
                            v-model="name"
                            placeholder="Example: Jose"
                        />
                    </b-col>
                    <b-col lg="3">
                        <label for="state-user" class="col-form-label text-lg-end">Estado: </label>
                        <b-form-radio name="state-user" @click="state = 1" value="1" :checked="state == 1">Activo</b-form-radio>
                        {{ " " }}
                        <b-form-radio name="state-user" @click="state = 2" value="2" :checked="state == 2">Inactivo</b-form-radio>
                    </b-col>
                    <b-col lg="5">
                        <label for="avatar-user" class="col-form-label text-lg-end">Imagen de Categoria: </label>
                        <b-input-group class="mb-3">
                            <b-form-file @change="loadFile($event)"  />
                            <b-input-group-text>Upload</b-input-group-text>
                        </b-input-group>

                        <img v-if="IMAGEN_PREVIZUALIZA" :src="IMAGEN_PREVIZUALIZA" alt="" width="100px" class="rounded d-block mx-auto" />
                    </b-col>

            </b-row>
            <b-col lg="12" class="mt-3">
                <div class="modal-footer">
                    <b-button 
                        type="button"
                        variant="secondary"
                        @click="ModalRegisterCategorie = !ModalRegisterCategorie"
                    >
                        Cerrar
                    </b-button>
                    <b-button type="button" variant="primary" @click="store">
                        {{ categorieSelected ? 'Editar' : 'Guardar' }}
                    </b-button>
                </div>
            </b-col>
        </b-modal>
    </DefaultLayout>
</template>
<script setup lang="ts">
import HttpClient from '@/helpers/http-client';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import type { Categorie, Categories } from '@/types/categories';
import type { AxiosResponse } from 'axios';
import { onMounted, ref, watch } from 'vue';
import type { CategorieResponse } from '@/types/categories';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { clear } from 'console';
import { FILE } from 'dns';
type TVueSwalInstace = typeof Swal & typeof Swal.fire;

const categories = ref<Categorie[]>([]);
const currentPage = ref<number>(1);
const totalPages = ref<number>(0);
const perPageRows = ref<number>(1);
const search = ref<string | null>(null);
const ModalRegisterCategorie = ref<boolean>(false);
const themeColor = ref("primary" as const);
const categorieSelected = ref<Categorie | undefined>(undefined);

const name = ref<string>("");
const state = ref<number>(1);
const IMAGEN_PREVIZUALIZA = ref<string | ArrayBuffer | null>("");
const FILE_IMAGEN = ref<File | undefined>(undefined);

const list = async () => {
    try {
        const res: AxiosResponse<Categories> = await HttpClient.get(
            "categories?page="+currentPage.value+"&search="+(search.value ? search.value : ""));
        console.log(res);
        categories.value = res.data.categories;
        totalPages.value = res.data.total;
        perPageRows.value = res.data.paginate;
    } catch (error) {
        console.error("Error fetching roles:", error);
    }
};
const store = async () =>{
    try{
        if(!name.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Necesitas ingresar el nombre de la categoria.",
                "error"
            );
            return;
        }
        
        let formData = new FormData();
        formData.append("title", name.value);
        formData.append("state", state.value+"");
        if(FILE_IMAGEN.value){
            formData.append("image", FILE_IMAGEN
        .value);
        }

        const res: AxiosResponse<CategorieResponse> =
            !categorieSelected.value ? 
            await HttpClient.post(
            "categories",formData)
            :
            await HttpClient.post(
            "categories/"+categorieSelected.value?.id,formData);
            
        
        console.log(res);
        if(res.data.code == 405){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                res.data.message,
                "error"
            );
        }else{
            ModalRegisterCategorie.value = false;
            if(!categorieSelected.value){
                if(res.data.categorie){
                categories.value.unshift(res.data.categorie);
                }
            } else {
                let index = categories.value.findIndex((cat) => cat.id === categorieSelected.value?.id);
                if(index !== -1){
                    if(res.data.categorie){
                        categories.value[index] = res.data.categorie;
                    }
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

const editCategorie = (categorie:Categorie) =>{
    ModalRegisterCategorie.value = true;
    categorieSelected.value = categorie;
    name.value = categorieSelected.value.title;
    IMAGEN_PREVIZUALIZA.value = categorie.imagen ?? '';
    FILE_IMAGEN.value = undefined;
}

const deleteCategorie = (categorie:Categorie) =>{
    try{
        (Swal as TVueSwalInstace)
            .fire({
                title: "¿Estás seguro?",
                text: `¿Quietes eliminar la categoria ${categorie.title} y sus permisos asociados?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            })
            .then(async (result :any) => {
                if(result.isConfirmed){
                    const res : AxiosResponse<CategorieResponse> = await HttpClient.delete(
                        "categories/" + categorie.id
                    );
                    console.log(res);
                    (Swal as TVueSwalInstace).fire(
                        "Eliminado!",
                        "La categoria '" + categorie.title + "' ha sido eliminado",
                        "success"
                    );
                    let index = categories.value.findIndex(cat => cat.id === categorie.id);
                    if(index !== -1){
                        categories.value.splice(index, 1);
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
watch(ModalRegisterCategorie, (value) => {
    if (value == false){
        categorieSelected.value = undefined;
        clearfile();
    }
    
});
onMounted(() => {
    list();
});
</script>