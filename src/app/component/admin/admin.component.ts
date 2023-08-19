import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserForLogin } from 'src/app/models/userForLogin';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})

export class AdminComponent implements OnInit{
  currentUser: UserForLogin;
  isAdmin: boolean;
  isLoggedIn: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router) {}

    ngOnInit(): void {
        
    }

    logOut() {
      this.authService.logOut();
      this.router.navigate([""])
      console.log("Hesabınızdan çıkış yapıldı", "Çıkış yapıldı");
    }
  
    checkifAdmin() {
      if (this.authService.isLoggedIn) {
        this.isAdmin = this.authService.hasRole(this.currentUser, "admin");
      } else {
        this.isAdmin = undefined!;
      }
    }
  
    getCurrentUser() {
      this.currentUser = this.authService.getUser()!;
    }
}
