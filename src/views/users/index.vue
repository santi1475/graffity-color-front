<template>
    <DefaultLayout>
        <b-row class="justify-content-center">
            <b-col cols="12">
                <b-card>
                    <b-card-header>
                        <b-row class="align-items-center justify-content-between">
                            <b-col lg="3">
                                <b-card-title>💁 Usuarios</b-card-title>
                            </b-col>
                            <b-col lg="2">
                                <b-button type="button" variant="success" @click="ModalRegisterUser = !ModalRegisterUser">
                                    <i class="far fa-plus-square ml-3"></i> Registrar
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-card-header>
                    <b-card-body class="pt-0">
                        <b-table-simple responsive class="mb-0 table-centered">
                            <b-thead class="table-light">
                                <b-tr>
                                    <b-th>Nombre y Apellido</b-th>
                                    <b-th>Email</b-th>
                                    <b-th>Teléfono</b-th>
                                    <b-th>Rol</b-th>
                                    <b-th>Estado</b-th>
                                    <b-th>Fecha Registro</b-th>
                                    <b-th class="text-end">Acción</b-th>
                                </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr v-for="(user, index) in users" :key="index">
                                    <b-td>
                                        {{ user.full_name }}
                                    </b-td>
                                    <b-td>
                                        {{ user.email }}
                                    </b-td>
                                    <b-td>
                                        {{ user.phone }}
                                    </b-td>
                                    <b-td>
                                        {{ user.role.name }}
                                    </b-td>
                                    <b-td>
                                        <b-badge variant="primary" v-if="user.state == 1">Activo</b-badge>
                                            <b-badge variant="danger" v-if="user.state == 2">Inactivo</b-badge>
                                    </b-td>
                                    <b-td>
                                        {{ user.created_at }}
                                    </b-td>
                                    <b-td class="text-end">
                                        <a href="#" 
                                            @click="editUser(user)"
                                        >
                                            <i class="las la-pen text-secondary fs-22"></i>
                                        </a>
                                        {{ " " }}
                                        <a href="#" 
                                            @click="deleteUser(user)"
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
            v-model="ModalRegisterUser"
            :title="`🔐${userSelected ? 'Edición' : 'Registro'} de Usuario`"
            :header-class="`bg-${themeColor}`"
            title-class="m-0 text-white"
            :ok-variant="themeColor"
            hide-footer
            centered
            size="lg"
            >
            <b-row>
                    <b-col lg="5">
                        <label for="name-user" class="col-form-label text-lg-end">Nombre: </label>
                        <b-form-input
                            type="text"
                            id="name-user"
                            v-model="name"
                            placeholder="Example: Jose"
                        />
                    </b-col>
                    <b-col lg="5">
                        <label for="surname-user" class="col-form-label text-lg-end">Apellido: </label>
                        <b-form-input
                            type="text"
                            id="surname-user"
                            v-model="surname"
                            placeholder="Example: Jose"
                        />
                    </b-col>
                    <b-col lg="4">
                        <label for="email-user" class="col-form-label text-lg-end">Email: </label>
                        <b-form-input
                            type="text"
                            id="email-user"
                            v-model="email"
                            placeholder="Example: laravest@gmail.com"
                        />
                    </b-col>
                    <b-col lg="4">
                        <label for="phone-user" class="col-form-label text-lg-end">Telefono: </label>
                        <b-form-input
                            type="number"
                            id="phone-user"
                            v-model="phone"
                            placeholder="Example: ########"
                        />
                    </b-col>
                    <b-col lg="4">
                        <label for="role_user" class="col-form-label text-lg-end">Role: </label>
                        <b-form-select id="type_document_list" v-model="role_id">
                            <option value="">Selec. Rol</option>
                            <template v-for="(role, index) in roles" :key="index">
                                <option :value="role.id">{{ role.name }}</option>
                            </template>
                        </b-form-select>
                    </b-col>
                    <b-col lg="4">
                        <label for="type-document-user" class="col-form-label text-lg-end">Tipo de documento: </label>
                        <b-form-select id="type_document_list" v-model="type_document">
                            <option value="DNI">DNI</option>
                            <option value="PASAPORTE">PASAPORTE</option>
                            <option value="CARNET DE EXTRANJERIA">CARNET DE EXTRANJERIA</option>
                            <option value="TARJETA MILITAR">TARJETA MILITAR</option>
                        </b-form-select>
                    </b-col>
                    <b-col lg="4">
                        <label for="n_document-user" class="col-form-label text-lg-end">N° de Documento: </label>
                        <b-form-input
                            type="number"
                            id="n_document-user"
                            v-model="n_document"
                            placeholder="Example: #######"
                        />
                    </b-col>
                    <b-col lg="4">
                        <label for="gender-user" class="col-form-label text-lg-end">Genero: </label>
                        <b-form-radio name="gender-user" @click="gender = 'M'" value="M" :checked="gender == 'M'">Masculino</b-form-radio>
                        {{ " " }}
                        <b-form-radio name="gender-user" @click="gender = 'F'" value="F" :checked="gender == 'F'">Femenino</b-form-radio>
                    </b-col>
                    <b-col lg="3">
                        <label for="state-user" class="col-form-label text-lg-end">Estado: </label>
                        <b-form-radio name="state-user" @click="state = 1" value="1" :checked="state == 1">Activo</b-form-radio>
                        {{ " " }}
                        <b-form-radio name="state-user" @click="state = 2" value="2" :checked="state == 2">Inactivo</b-form-radio>
                    </b-col>
                    <b-col lg="4">
                        <label for="password-user" class="col-form-label text-lg-end">Contraseña: </label>
                        <b-form-input
                            type="password"
                            id="password-user"
                            v-model="password"
                            placeholder="*********"
                        />
                    </b-col>
                    <b-col lg="5">
                        <label for="avatar-user" class="col-form-label text-lg-end">Avatar de Usuario: </label>
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
                        @click="ModalRegisterUser = !ModalRegisterUser"
                    >
                        Cerrar
                    </b-button>
                    <b-button type="button" variant="primary" @click="store">
                        {{ userSelected ? 'Editar' : 'Guardar' }}
                    </b-button>
                </div>
            </b-col>
        </b-modal>
    </DefaultLayout>
</template>
<script setup lang="ts">
import HttpClient from '@/helpers/http-client';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import type { RoleUser, User, Users } from '@/types/Users';
import type { AxiosResponse } from 'axios';
import { onMounted, ref, watch } from 'vue';
import type { UserResponse } from '@/types/Users';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { clear } from 'console';
type TVueSwalInstace = typeof Swal & typeof Swal.fire;

const users = ref<User[]>([]);
const currentPage = ref<number>(1);
const totalPages = ref<number>(0);
const perPageRows = ref<number>(1);
const search = ref<string | null>(null);
const ModalRegisterUser = ref<boolean>(false);
const themeColor = ref("primary" as const);
const userSelected = ref<User | undefined>(undefined);
const roles = ref<RoleUser[]>([]);

const name = ref<string>("");
const surname = ref<string>("");
const email = ref<string>("");
const phone = ref<string>("");
const role_id = ref<number>(0);
const type_document = ref<string>("DNI");
const n_document = ref<number>(0);
const gender = ref<string>("M");
const state = ref<number>(1);
const password = ref<string>("");
const IMAGEN_PREVIZUALIZA = ref<string | ArrayBuffer | null>(null);
const FILE_AVATAR = ref<File | undefined>(undefined);

const list = async () => {
    try {
        const res: AxiosResponse<Users> = await HttpClient.get(
            "users?page="+currentPage.value+"&search="+(search.value ? search.value : ""));
        console.log(res);
        users.value = res.data.users.data;
        totalPages.value = res.data.total;
        perPageRows.value = res.data.paginate;
        roles.value = res.data.roles;
    } catch (error) {
        console.error("Error fetching roles:", error);
    }
};
const store = async () =>{
    try{
        if(!name.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Necesitas ingresar el nombre del usuario.",
                "error"
            );
            return;
        }
        if(!surname.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Necesitas ingresar el apellido del usuario.",
                "error"
            );
            return;
        }
        if(!email.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Necesitas ingresar el email del usuario.",
                "error"
            );
            return;
        }
        if(!role_id.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Necesitas seleccionar el rol del usuario.",
                "error"
            );
            return;
        }
        if(!n_document.value){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                "Necesitas ingresar el N° de documento del usuario.",
                "error"
            );
            return;
        }
        if(!password.value){
            if(!userSelected.value){
                (Swal as TVueSwalInstace).fire(
                    "Upps!",
                    "Necesitas ingresar la contraseña del usuario.",
                    "error"
                );
                return;
            }
        }

        let formData = new FormData();
        formData.append("name", name.value);
        formData.append("surname", surname.value);
        formData.append("email", email.value);
        formData.append("phone", phone.value+"");
        formData.append("role_id", role_id.value+"");
        formData.append("type_document", type_document.value);
        formData.append("n_document", n_document.value+"");
        if(password.value){
            formData.append("password", password.value);
        }
        formData.append("gender",gender.value);
        formData.append("state", state.value+"");
        if(FILE_AVATAR.value){
            formData.append("avatar", FILE_AVATAR.value);
        }

        const res: AxiosResponse<UserResponse> =
            !userSelected.value ? 
            await HttpClient.post(
            "users",formData)
            :
            await HttpClient.put(
            `users/${userSelected.value.id}`,formData);
            
        
        console.log(res);
        if(res.data.code == 405){
            (Swal as TVueSwalInstace).fire(
                "Upps!",
                res.data.message,
                "error"
            );
        }else{
            ModalRegisterUser.value = false;
            if(!userSelected.value){
                if(res.data.user){
                users.value.unshift(res.data.user);
                }
            } else {
                let index = users.value.findIndex((usr) => usr.id === userSelected.value?.id);
                if(index !== -1){
                    if(res.data.user){
                        users.value[index] = res.data.user;
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

const editUser = (user:User) =>{

}
const deleteUser = (user:User) =>{

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
    FILE_AVATAR.value = $event.target.files[0];
    let reader = new FileReader();
    if(FILE_AVATAR.value){
        reader.readAsDataURL(FILE_AVATAR.value);
        reader.onloadend = () => IMAGEN_PREVIZUALIZA.value = reader.result;
    }
}
const clearfile = () => {
    name.value = "";
    surname.value = "";
    email.value = "";
    phone.value = '';
    state.value = 1;
    role_id.value = 0;
    type_document.value = "";
    n_document.value = 0;
    IMAGEN_PREVIZUALIZA.value = "";
    FILE_AVATAR.value = undefined;
    gender.value = '';
    password.value = '';
    role_id.value = 0;
}
watch(ModalRegisterUser, (value) => {
    if (value == false){
        clearfile();
    }
    
});
onMounted(() => {
    list();
});
</script>