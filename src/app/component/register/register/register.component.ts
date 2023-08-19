import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm : FormGroup;
  rememberMe: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private localStorage: LocalstorageService
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  register() {
    if (this.registerForm.valid) {
      let newUser = Object.assign({}, this.registerForm.value);
      delete newUser["confirmPassword"]
      this.authService.register(newUser).subscribe({ next: successResponse => {
        this.localStorage.add("token", successResponse.data.token);
        if (this.rememberMe) {
          this.saveEmail(newUser.email);
        }
        this.authService.isLoggedIn = true;
        this.router.navigate(["/adminpanel"]);
        console.log("İşlem başarılı", "Giriş yapıldı");
      }, error : errorResponse => {
        console.log(errorResponse, "Kayıt başarısız");
      }}
      )
    } else {
      console.log("Bilgilerinizden bazıları doğrulanamadı", "Formunuz hatalı");
    }
  }

  saveEmail(email: string) {
    this.localStorage.add("remember", email);
  }

  // register() {
  //   if (this.registerForm.valid) {
  //     console.log(this.registerForm.value);
  //     let registerModel = Object.assign({}, this.registerForm.value);
  //     this.authService.register(registerModel).subscribe({
  //       next: (response) => {
  //         console.log(response)
  //         localStorage.setItem('token', response.data.token);
  //         this.router.navigate(['lawyer']);
  //         console.log("registered")
  //       },
  //       error: (responseError) => {
  //         console.log(responseError,"response error")
  //       }
  //     }
  //     );
  //   } else {
  //     console.log("form geçersiz")
  //   }
  // }
}
