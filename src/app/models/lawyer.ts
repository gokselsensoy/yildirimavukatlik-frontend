import { LawyerImage } from "./lawyerImage";

export interface Lawyer
{
    id:number;
    sortId:number;
    name:string;
    position:string;
    description:string;
    lawyerImages: LawyerImage[];
}