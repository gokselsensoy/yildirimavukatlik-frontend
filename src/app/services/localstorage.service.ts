import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getItem(key: string){
    return localStorage.getItem(key);
  }

  removeToken(key: string){
    localStorage.removeItem(key);
  }

  add(key: string, value: string) {
    return localStorage.setItem(key, value);
  }

  // saveToken(token:string){
  //   localStorage.setItem('token',token);
    
  // }
}