import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  contactAddForm : FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createContactAddForm();
  }


  createContactAddForm() {
    this.contactAddForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

    add() {
    if (this.contactAddForm.valid) {
      let contactModel = Object.assign({}, this.contactAddForm.value);
      this.contactService.contactAdd(contactModel).subscribe({ next:
        (response) => {
          location.reload();
          this.toastrService.success("Mesajınız gönderildi."),
          console.log(response, "başarılı")
        },
         error: (responseError) => {
          if (responseError.error.Errors.length > 0) {
            for (let i = 0; i < responseError.error.Errors.length; i++) {
              console.log("doğrulama hatası")
            }
          }
        }
    });
    } else {
      console.log("formunuz eksik")
    }
  }

  refreshPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
  }
  
}
