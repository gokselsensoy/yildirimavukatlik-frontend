import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Lawyer } from '../models/lawyer';
import { SingleResponseModel } from '../models/singleResponseModel';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { LawyerDetailDto } from '../models/lawyerDetails';

@Injectable({
  providedIn: 'root'
})
export class LawyerService {

  apiUrl = "https://localhost:44345/api/";

  constructor(private httpClient:HttpClient) { }

  getLawyers():Observable<ListResponseModel<Lawyer>> {
    let newPath = this.apiUrl + "lawyer/getall"
    return this.httpClient.get<ListResponseModel<Lawyer>>(newPath);
    }

  lawyerAdd(lawyer:Lawyer):Observable<SingleResponseModel<number>>{
    return this.httpClient.post<SingleResponseModel<number>>(this.apiUrl+"lawyer/add",lawyer)
    }

    getBySortId(sortId: number): Observable<ListResponseModel<Lawyer>> {
      let newPath = this.apiUrl + 'lawyer/getlawyersbysortid?sortid=' + sortId;
      return this.httpClient.get<ListResponseModel<Lawyer>>(newPath);
    }

    getLawyerDetails(lawyerId: number){
      let newPath = this.apiUrl + 'lawyer/getlawyerdetails?lawyerid=' + lawyerId;
      return this.httpClient.get<SingleResponseModel<LawyerDetailDto>>(newPath);
    }

    delete(lawyer: Lawyer): Observable<ResponseModel> {
      let newPath = this.apiUrl + 'lawyer/delete'
      return this.httpClient.post<ResponseModel>(newPath, lawyer)
    }
    
    update(lawyer: Lawyer): Observable<ResponseModel> {
      let newPath = this.apiUrl + 'lawyer/update'
      return this.httpClient.post<ResponseModel>(newPath, lawyer)
    }
}