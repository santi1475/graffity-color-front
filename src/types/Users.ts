export type RoleUser = {
    id?: string,
    name: string,
}
export type User = {
    id: number,
    name: string,
    surname: string,
    full_name: string,
    email: string,
    role_id: string,
    role: RoleUser,
    phone: number,
    state: number,
    avatar?: string,
    type_document?: string,
    n_document: number,
    gender: string,
    created_at: string,
}
export type Users = {
    users: {
        data: User[],
    },
    total: number,
    paginate: number,
    roles: RoleUser[],
}
export type UserResponse = {
    message: string,
    code: number,
    user?: User,
}
