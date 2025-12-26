<template>
    <DefaultLayout>
        <b-row class="justify-content-center">
            <b-col cols="12">
                <b-card>
                    <b-card-header>
                        <b-row class="align-items-center justify-content-between">
                            <b-col lg="3">
                                <b-card-title>🔐Roles y Permisos</b-card-title>
                            </b-col>
                            <b-col lg="2">
                                <b-button type="button" variant="success" @click="ModalRegisterRole = !ModalRegisterRole">
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
                                    <b-th>Rol</b-th>
                                    <b-th>Permisos</b-th>
                                    <b-th>Fecha Registro</b-th>
                                    <b-th class="text-end">Acción</b-th>
                                </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr v-for="(role, index) in roles" :key="index">
                                    <b-td>
                                        {{ role.name }}
                                    </b-td>
                                    <b-td class="align-middle">
                                        <ul>
                                            <li 
                                            v-for="(item, index) in role.permissions_pluck" :key="index"
                                            >
                                                {{ item }}
                                            </li>
                                        </ul>   
                                    </b-td>
                                    <b-td>
                                        {{ role.created_at }}
                                    </b-td>
                                    <b-td class="text-end">
                                        <a href="#" 
                                            @click="editRole(role)"
                                            v-if="role.id != '1'"
                                        >
                                            <i class="las la-pen text-secondary fs-22"></i>
                                        </a>
                                        {{ " " }}
                                        <a href="#" 
                                            @click="deleteRole(role)"
                                            v-if="role.id != '1'"
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
            v-model="ModalRegisterRole"
            :title="`🔐${roleSelected ? 'Edición' : 'Registro'} de Roles y Permisos`"
            :header-class="`bg-${themeColor}`"
            title-class="m-0 text-white"
            :ok-variant="themeColor"
            hide-footer
            centered
            >
            <b-row>
                <b-col lg="12" class="text-center align-self-center">
                    <b-form-input
                        type="text"
                        id="name"
                        v-model="name"
                        placeholder="Nombre del Rol"
                    />
                </b-col>
                <b-col lg="12" class="">
                    <b-table-simple resposive class = "mb-0 table-centered mt-2">
                        <b-thead class="table-light">
                            <b-tr>
                                <b-th>Modulo</b-th>
                                <b-th>Permisos</b-th>
                            </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr v-for="(PERMISO, index) in PERMISOS" :key="index">
                                <b-td>
                                    {{ PERMISO.name }}
                                </b-td>
                                <b-td>
                                    <ul>
                                        <li v-for="(permiso, index2) in PERMISO.permisos" :key="index2">
                                            <b-form-checkbox 
                                            :checked="permissionSelected.includes(permiso.permiso)"
                                            @click="addPermision(permiso)"name="checkbox-1"
                                            >
                                                {{ permiso.name }}
                                            </b-form-checkbox>
                                        </li>
                                    </ul>
                                </b-td>
                                
                            </b-tr>
                        </b-tbody>
                    </b-table-simple>"
                </b-col>
            </b-row>
            <b-col lg="12" class="mt-3">
                <div class="modal-footer">
                    <b-button 
                        type="button"
                        variant="secondary"
                        @click="ModalRegisterRole = !ModalRegisterRole"
                    >
                        Cerrar
                    </b-button>
                    <b-button type="button" variant="primary" @click="store">
                        {{ roleSelected ? 'Editar' : 'Guardar' }}
                    </b-button>
                </div>
            </b-col>
        </b-modal>
    </DefaultLayout>
</template>
<script setup lang="ts">
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { onMounted, ref, watch} from "vue";
import { PERMISOS, type Role, type Roles, type RolePermission, type RoleResponse } from "@/types/roles"; 
import type { AxiosResponse } from "axios";
import HttpClient from "@/helpers/http-client";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Modal } from "bootstrap";

type TVueSwalInstace = typeof Swal & typeof Swal.fire;

const roles = ref<Role[]>([]);
const ModalRegisterRole = ref<boolean>(false);
const themeColor = ref("primary" as const);
const name = ref<string | null>(null);
const permissionSelected = ref<string[]>([]);
const roleSelected = ref<Role | undefined>(undefined);
const search = ref<string | null>(null);

const currentPage = ref<number>(1);
const totalPages = ref<number>(0);
const perPageRows = ref<number>(1);

const list = async () => {
    try {
        const res: AxiosResponse<Roles> = await HttpClient.get(
            "roles?page="+currentPage.value+"&search="+(search.value ? search.value : ""));
        console.log(res);
        roles.value = res.data.roles;
        totalPages.value = res.data.total;
        perPageRows.value = res.data.paginate;
    } catch (error) {
        console.error("Error fetching roles:", error);
    }
};

const reset = () => {
    search.value = null;
    list();
};

const addPermision = (permiso: RolePermission) => {
    let index = permissionSelected.value.findIndex((prm) => prm === permiso.permiso);
    if (index !== -1) {
        permissionSelected.value.splice(index, 1);
    } else {
        permissionSelected.value.push(permiso.permiso);
    }
    console.log(permissionSelected.value);
};

const store = async () => {
    if(!name.value){
        (Swal as TVueSwalInstace).fire(
            "Upps!",
            "Necesitas ingresar un nombre para el rol",
            "error"
        );
        return;
    }
    if(permissionSelected.value.length === 0){
        (Swal as TVueSwalInstace).fire(
            "Upps!",
            "Necesitas seleccionar al menos un permiso",
            "error"
        );
        return;
    }
    try {
        const res: AxiosResponse<RoleResponse> =
            !roleSelected.value ? 
            await HttpClient.post(
            "roles",
            {
                name: name.value,
                permissions: permissionSelected.value,
            })
            :
            await HttpClient.put(
            "roles/" + roleSelected.value?.id,
            {
                name: name.value,
                permissions: permissionSelected.value,
            });
        
        console.log(res);
        if(res.data.code == 405){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                res.data.message,
                "error"
            );
        }else{
            ModalRegisterRole.value = false;
            if(!roleSelected.value){
                if(res.data.role){
                roles.value.unshift(res.data.role);
                }
            } else {
                let index = roles.value.findIndex((rl) => rl.id === roleSelected.value?.id);
                if(index !== -1){
                    if(res.data.role){
                        roles.value[index] = res.data.role;
                    }
                }
            }
            
            (Swal as TVueSwalInstace).fire(
                "Genial!",
                res.data.message,
                "success"
            );
        }
    } catch (error) {
        console.error(error);
    }
};

const editRole = (role:Role) => {
    ModalRegisterRole.value = true;
    roleSelected.value = role;
    name.value = role.name;
    permissionSelected.value = role.permissions_pluck;
};

const deleteRole = (role:Role) => {
    try{
        (Swal as TVueSwalInstace)
            .fire({
                title: "¿Estás seguro?",
                text: `¿Quietes eliminar el rol ${role.name} y sus permisos asociados?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            })
            .then(async (result :any) => {
                if(result.isConfirmed){
                    const res : AxiosResponse<RoleResponse> = await HttpClient.delete(
                        "roles/" + role.id
                    );
                    console.log(res);
                    (Swal as TVueSwalInstace).fire(
                        "Eliminado!",
                        "El rol '" + role.name + "' ha sido eliminado",
                        "success"
                    );
                    let index = roles.value.findIndex(rol => rol.id === role.id);
                    if(index !== -1){
                        roles.value.splice(index, 1);
                    }
                }
            });
    }catch(error){
        console.error(error);
    }
};

watch(currentPage, (value) => {
    list();
});

watch(ModalRegisterRole, (value) => {
    if (!value){ 
        roleSelected.value = undefined;
        name.value = null;
        permissionSelected.value = [];
    }
    
});
onMounted(() => {
    list();
});
</script>
