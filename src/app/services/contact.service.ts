import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Contact } from '../models/contact';
import { SingleResponseModel } from '../models/singleResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  apiUrl = "https://localhost:44345/api/";

  constructor(private httpClient:HttpClient) { }


  getContacts():Observable<ListResponseModel<Contact>> {
    let newPath = this.apiUrl + "contact/getall"
    return this.httpClient.get<ListResponseModel<Contact>>(newPath);
    }

  contactAdd(contact:Contact):Observable<SingleResponseModel<number>>{
    return this.httpClient.post<SingleResponseModel<number>>(this.apiUrl+"contact/add",contact)
    }

  delete(contact: Contact): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'contact/delete'
    return this.httpClient.post<ResponseModel>(newPath, contact)
    }
}
