import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf } from 'rxjs';
import { LawyerImage } from '../models/lawyerImage';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';


@Injectable({
    providedIn: 'root'
  })
  export class LawyerImageService {
    apiUrl="https://localhost:44345/"
    constructor(private httpClient:HttpClient) { }
  
    // getLawyerImages():Observable<ListResponseModel<LawyerImage>>{
    //   let newPath=this.apiUrl+"api/lawyerimage/getall";
    //   return this.httpClient.get<ListResponseModel<LawyerImage>>(newPath);
    // }
  
    getLawyerImagesByLawyerId(lawyerId:number):Observable<ListResponseModel<LawyerImage>>{
      let newPath=this.apiUrl+"api/lawyerimage/getbylawyerid?lawyerId="+lawyerId;
      return this.httpClient.get<ListResponseModel<LawyerImage>>(newPath);
    }

    getAllLawyerImages():Observable<ListResponseModel<LawyerImage>>{
      let newUrl = this.apiUrl + "api/lawyerimage/getall";
      return this.httpClient.get<ListResponseModel<LawyerImage>>(newUrl);
    }

    getImagePath(imagePath: string) {
      return this.apiUrl + imagePath
    }
  
    uploadImage(image: File, lawyerId: number): Observable<ResponseModel> {
      let newPath = this.apiUrl + "api/lawyerimage/add"
      const sendForm = new FormData();
      sendForm.append('lawyerId', JSON.stringify(lawyerId))
      sendForm.append('lawyerImage', image, image.name)
      // sendForm.append()
      return this.httpClient.post<ResponseModel>(newPath, sendForm);
    }
  
    deleteImage(lawyerImage: LawyerImage): Observable<ResponseModel> {
      let newPath = this.apiUrl + "api/lawyerimage/delete";
      return this.httpClient.post<ResponseModel>(newPath, lawyerImage);
    }
  }