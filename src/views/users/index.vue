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
                                <b-button type="button" variant="success">
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
    </DefaultLayout>
</template>
<script setup lang="ts">
import HttpClient from '@/helpers/http-client';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import type { User, Users } from '@/types/Users';
import type { AxiosResponse } from 'axios';
import { onMounted, ref } from 'vue';


const users = ref<User[]>([]);
const currentPage = ref<number>(1);
const totalPages = ref<number>(0);
const perPageRows = ref<number>(1);
const search = ref<string | null>(null);

const list = async () => {
    try {
        const res: AxiosResponse<Users> = await HttpClient.get(
            "users?page="+currentPage.value+"&search="+(search.value ? search.value : ""));
        console.log(res);
        users.value = res.data.users.data;
        totalPages.value = res.data.total;
        perPageRows.value = res.data.paginate;
    } catch (error) {
        console.error("Error fetching roles:", error);
    }
};

const editUser = (user:User) =>{

}
const deleteUser = (user:User) =>{

}
onMounted(() => {
    list();
});
</script>