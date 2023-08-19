import { LoginModel } from "./loginModel";

export interface RegisterModel extends LoginModel {
    firstName: string,
    lastName: string
}


// export interface RegisterModel{
//     firstName:string;
//     lastName:string;
//     email:string;
//     password:string;
// }