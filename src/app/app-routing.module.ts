import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LawyerComponent } from './component/lawyer/lawyer.component';
import { RegisterComponent } from './component/register/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { AppComponent } from './app.component';
import { LoginGuard } from './guards/login.guard';
import { LawyerAddComponent } from './component/lawyer-add/lawyer-add.component';
import { LawyerDeleteComponent } from './component/lawyer-delete/lawyer-delete.component';
import { HomeComponent } from './component/home/home.component';
import { NaviComponent } from './component/navi/navi.component';
import { ContactComponent } from './component/contact/contact.component';
import { AdminnaviComponent } from './component/adminnavi/adminnavi.component';
import { AdminComponent } from './component/admin/admin.component';

const routes: Routes = [
  {path:"",pathMatch:'full', component:HomeComponent},
  {path:"lawyers", component:LawyerComponent},
  {path: "login" , component:LoginComponent},
  {path:"adminpanel",component:AdminComponent, canActivate: [LoginGuard]},
  {path:"lawyeradd",component:LawyerAddComponent, canActivate: [LoginGuard]},
  {path:"lawyerdelete",component:NaviComponent, canActivate: [LoginGuard]},
  {path:"contact",component:ContactComponent, canActivate: [LoginGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
