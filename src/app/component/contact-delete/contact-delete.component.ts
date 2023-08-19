import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Contact } from 'src/app/models/contact';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact-delete',
  templateUrl: './contact-delete.component.html',
  styleUrls: ['./contact-delete.component.css']
})
export class ContactDeleteComponent implements OnInit {
  deletedContact: Contact;
  dataLoaded: boolean = false;
  contacts : Contact[] = [];
  constructor(
    private contactDeleteModal: MatDialogRef<ContactDeleteComponent>,
    private contactService: ContactService,
    private activatedRoute:ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      this.getContacts()
  })
  }

  getContacts() {
    this.contactService.getContacts().subscribe(response => {
      this.contacts = response.data;
    }
    )
  }

  delete(contact: Contact) {
    this.contactService.delete(contact).subscribe({
      next: (response) => {
    console.log(response, "Silme işlemi başarılı")
  this.closeContactDeleteModal();
    }, error : (errorResponse) => {
      console.log(errorResponse, "Silme işlemi başarılı")
    }
    })
  }

  closeContactDeleteModal() {
    this.contactDeleteModal.close();
  }

}
