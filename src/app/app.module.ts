import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LawyerComponent } from './component/lawyer/lawyer.component';
import { NaviComponent } from './component/navi/navi.component';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from "@auth0/angular-jwt";
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './component/register/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { LawyerAddComponent } from './component/lawyer-add/lawyer-add.component';
import { HomeComponent } from './component/home/home.component';
import { LawyerDeleteComponent } from './component/lawyer-delete/lawyer-delete.component';
import { LawyerUpdateComponent } from './component/lawyer-update/lawyer-update.component';
import { AdminnaviComponent } from './component/adminnavi/adminnavi.component';
import { ContactComponent } from './component/contact/contact.component';
import { ContactDeleteComponent } from './component/contact-delete/contact-delete.component';
import { AdminComponent } from './component/admin/admin.component';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent,
    LawyerComponent,
    NaviComponent,
    RegisterComponent,
    LoginComponent,
    LawyerAddComponent,
    HomeComponent,
    LawyerDeleteComponent,
    LawyerUpdateComponent,
    AdminnaviComponent,
    ContactComponent,
    ContactDeleteComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right"
    }),

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["http://localhost:4200/"]
      },
    }),
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true},
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
