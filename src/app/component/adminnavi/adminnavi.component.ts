import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Lawyer } from 'src/app/models/lawyer';
import { AuthService } from 'src/app/services/auth.service';
import { LawyerService } from 'src/app/services/lawyer.service';

@Component({
  selector: 'app-adminnavi',
  templateUrl: './adminnavi.component.html',
  styleUrls: ['./adminnavi.component.css']
})
export class AdminnaviComponent implements OnInit {
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private lawyerService: LawyerService,
    private authService: AuthService
    ) {}
    lawyers:Lawyer[] = [];
    dataLoaded:boolean = false;
  ngOnInit(): void {
    // const toggler = document.querySelector('.btn');

    // if (toggler) {
    //   this.renderer.listen(toggler, 'click', () => {
    //     const sidebar = document.querySelector('#sidebar');
    //     if (sidebar) {
    //       sidebar.classList.toggle('collapsed');
    //     }
    //   });
    // }


  }

  getLawyers(){

    this.lawyerService.getLawyers().subscribe(response=>{
      this.lawyers = response.data
      this.dataLoaded = true;
      console.log('response', response.data)
    })
  
  }

  logout(){
    this.authService.logOut();
    this.router.navigate([""])
  }


}