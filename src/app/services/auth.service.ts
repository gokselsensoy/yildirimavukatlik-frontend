import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable } from 'rxjs';
import { LoginModel } from '../models/loginModel';
import { RegisterModel } from '../models/registerModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { LocalstorageService } from './localstorage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserModel } from '../models/userModel';
import { UserForLogin } from '../models/userForLogin';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user : UserModel
  apiUrl = 'https://localhost:44345/api/auth/';

  private loggedIn = new BehaviorSubject<boolean>(this.isTokenExpired()); //https://loiane.com/2017/08/angular-hide-navbar-login-page/

  public get loginStatus() {
    return this.loggedIn.asObservable();
  }

  public get isLoggedIn() {
    return this.loggedIn.getValue();
  }

  public set isLoggedIn(status: boolean) {
    this.loggedIn.next(status);
  }


  constructor(private httpClient:HttpClient,private localStorageService:LocalstorageService,private jwtHelper:JwtHelperService) { }


  private isTokenExpired(): boolean {
    let token = this.getToken();
    if (token != null) {
      return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  private getToken(): string | null {
    return this.localStorageService.getItem("token");
  }

  login(user: LoginModel): Observable<SingleResponseModel<TokenModel>> {
    let newPath = this.apiUrl + 'login'
    return this.httpClient.post<SingleResponseModel<TokenModel>>(newPath, user)
  }

  logOut() {
    this.localStorageService.removeToken("token");
    this.loggedIn.next(false);
  }

  register(newUser: RegisterModel): Observable<SingleResponseModel<TokenModel>> {
    let newPath = this.apiUrl + 'register'
    return this.httpClient.post<SingleResponseModel<TokenModel>>(newPath, newUser);
  }
  
  getUser(): UserForLogin | undefined {
    let token = this.getToken();
    if (token != null) {
      let tokenDetails = Object.entries(this.jwtHelper.decodeToken(token));
      let user: UserForLogin = new UserForLogin;
      tokenDetails.forEach(detail => {
        switch (detail[0]) {
          case "email": {
            user.email = String(detail[1]);
            break;
          }
          case "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": {
            user.name = String(detail[1]);
            break;
          }
          case "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": {
            user.roles = detail[1] as Array<string>
            break;
          }
          case "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": {
            user.id = Number(detail[1]);
          }
        }
      });
      if (!user.roles) {  //if the user does not have a role
        user.roles = [];
      }
      return user;
    }
    return undefined;
  }

  hasRole(user: UserForLogin, role: string): boolean {
    if (user.roles.indexOf(role) !== -1) {
      return true;
    }
    return false;
  }


  // login(loginModel:LoginModel){
  //   return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl+"login",loginModel)
  // }

  //   isAuthenticated(){
  //     if(localStorage.getItem("token")){
  //       return true;
  //     }
  //     else{
  //       return false;
  //     }
  //   }



    // register(registerModel:RegisterModel):Observable<SingleResponseModel<TokenModel>>{
    //   return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl+"register",registerModel)
    // }
    


    // decodedToken(token:any){
    //   return this.jwtHelper.decodeToken(token)
    // }


    
    // loggedIn(){
    //   if(this.localStorageService.getToken()){
    //     return this.jwtHelper.isTokenExpired()// true/false 
    //   }
    //   else{
    //     return false;
    //   }
    // }



    // getUserInfo(){
    //   let decodedToken = this.decodedToken(this.localStorageService.getToken())
    //   if (decodedToken) {
    //     if (this.loggedIn()) {
    //       let tokenInfoName= Object.keys(decodedToken).filter(u=> u.endsWith('/name'))[0]
    //       var splitted=String(decodedToken[tokenInfoName]).split(" ")
    //       //console.log("cevap:")
    //       //console.log(splitted);
    //       let firstName=splitted[0];
    //       let lastName=splitted[1]
    //       //console.log(firstName,lastName)
    //       //let userName=String(decodedToken[tokenInfoName])

    //       let tokenInfoId= Object.keys(decodedToken).filter(x=> x.endsWith('/nameidentifier'))[0]
    //       let userId= Number(decodedToken[tokenInfoId]);

    //       let claimInfo = Object.keys(decodedToken).filter(x=> x.endsWith('/role'))[0]
    //       let roles= decodedToken[claimInfo];
    //       console.log("role:",roles)

    //       let emailInfo= decodedToken.email; 
          
    //       this.user={
    //         userId:userId,
    //         //userName : userName,
    //         firstName:firstName,
    //         lastName:lastName,
    //         email:emailInfo,
    //         roles:roles,

    //       }      
    //     }
    //   }
    //   return this.user;
    // }
}