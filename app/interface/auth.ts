export interface User {
    email?: string;
    name?: string;
    surname?: string;
    password?: string;
    role?: Role;
    token?: string;
    permissions?: Array<string>;
}
export interface Role {
    id?: string;
    name?: string;
}
export interface ResponseAuthLogin {
    user?: User;
    access_token?: string;
}