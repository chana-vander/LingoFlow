export interface User{
    id:number,
    name:string,
    email:string,
    password:string,
    role:string
}
export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
}