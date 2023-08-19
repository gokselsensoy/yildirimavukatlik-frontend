import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  rememberMe: boolean = false;
  rememberedEmail: any;
  userEmail:string;
  @Input() user1:User;
  
  constructor(private formBuilder:FormBuilder,
    private authService:AuthService,
    private userService:UserService,
    private router:Router,
    private localStorage:LocalstorageService) { }

  ngOnInit(): void {
    this.createLoginForm()
    this.checkRememberedUser();
    this.autoFillEmail();
    
    
  }
  createLoginForm(){
    this.loginForm = this.formBuilder.group({
      email:["",Validators.required],
      password:["",Validators.required],
    })
  }

  login() {
    if (this.loginForm.valid) {
      let user = Object.assign({}, this.loginForm.value);
      this.authService.login(user).subscribe({ next: (successResponse) => {
        this.localStorage.add("token", successResponse.data.token);
        console.log(successResponse,'successResponse')
        if (this.rememberMe) {
          this.saveEmail(user.email);
        }
        this.authService.isLoggedIn = true;
        this.router.navigate(["/adminpanel"]);
        console.log("İşlem başarılı", "Giriş yapıldı");
      }, error: (errorResponse) => {
        this.authService.isLoggedIn = false;
        console.log(errorResponse.error.message, "Giriş yapılamadı");
      }
    })
    }
  }

  autoFillEmail() {
    if (this.rememberedEmail) {
      let email = this.localStorage.getItem("remember");
      if (email != null) {
        this.loginForm.get("email")?.setValue(email);
      }
    }
  }

  deleteRememberedEmail() {
    this.localStorage.removeToken("remember");
  }

  checkRememberedUser() {
    let result = this.localStorage.getItem("remember");
    if (result != null) {
      this.rememberedEmail = result;
    } else {
      this.rememberedEmail = undefined;
    }
  }

  saveEmail(email: string) {
    this.localStorage.add("remember", email);
  }

  // login(){
  //   if (this.loginForm.valid) {
  //     //console.log(this.loginForm.value);
  //     let loginModel=Object.assign({},this.loginForm.value)
  //     this.authService.login(loginModel).subscribe({
  //       next: (response) => {
  //         console.log(response)
  //         this.localStorage.saveToken(response.data.token)
  //         this.authService.decodedTokenKey=this.authService.decodedToken(response.data.token);
  //         console.log(this.authService.getUserInfo()); 
  //         this.router.navigate(["/"]);
  //         console.log("giriş yapıldı")
        
  //     }, error: (responseError) => {
  //       console.log(responseError.error.ErrorMessage);
  //     }
  //   })
  // }

  
}
