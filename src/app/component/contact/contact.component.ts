import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from 'src/app/models/contact';
import { ContactService } from 'src/app/services/contact.service';
import { ContactDeleteComponent } from '../contact-delete/contact-delete.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contacts: Contact[];
  currentContact: Contact[];
  dataLoaded: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService,
    private dialog: MatDialog
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
  
  showContactDeleteModal(contact: Contact) {
    const contactDeleteModal = this.dialog.open(ContactDeleteComponent, {
      disableClose: true,
      width: "25%"
    });
    contactDeleteModal.componentInstance.deletedContact = contact;
  
    contactDeleteModal.afterClosed().subscribe({ next: 
      result => {
      this.ngOnInit();
      console.log(result)
      }
    })
  }

}