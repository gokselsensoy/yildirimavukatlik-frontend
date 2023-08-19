import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Lawyer } from 'src/app/models/lawyer';
import { LawyerImageService } from 'src/app/services/lawyer-image.service';
import { LawyerService } from 'src/app/services/lawyer.service';
import { LawyerDeleteComponent } from '../lawyer-delete/lawyer-delete.component';
import { LawyerImage } from 'src/app/models/lawyerImage';
import { LawyerUpdateComponent } from '../lawyer-update/lawyer-update.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css']
})
export class NaviComponent implements OnInit {
  lawyers: Lawyer[];
  currentLawyer: Lawyer[];
  lawyerImages:LawyerImage[] = [];
  dataLoaded: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private lawyerService: LawyerService,
    private lawyerImageService: LawyerImageService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{


      this.getLawyers()
      this.getAllLawyerImages()
  })
  }

  getLawyerImagePath(lawyerId:number):string {
    let url: string;
    const lawyerImage = this.lawyerImages.find(image => image.lawyerId === lawyerId);
    if (lawyerImage) {
      url = "https://localhost:44345/" + lawyerImage.imagePath;
    } else {
      url = "https://localhost:44345/images/default.jpg";
    }
    return url;
  
  }

  getImagesClass(lawyerImage:LawyerImage){
    if (this.lawyerImages[0] == lawyerImage) {
      return "carousel-item active"
    } else {
      return "carousel-item"
    }
  }

  getAllLawyerImages(){
    this.lawyerImageService.getAllLawyerImages().subscribe(response => {
      this.lawyerImages = response.data;
    })
  }
  
  getLawyerImagesByLawyerId(lawyerId:number) {
    this.lawyerImageService.getLawyerImagesByLawyerId(lawyerId).subscribe(response => {
      this.lawyerImages = response.data;
      this.dataLoaded = true;
    })
  }

getImagePath(imagePath: string) {
    return this.lawyerImageService.getImagePath(imagePath);
  }

getLawyers() {
  this.lawyerService.getLawyers().subscribe(response => {
    this.lawyers = response.data.sort((a,b) => a.sortId - b.sortId)
  }
  )
}

showLawyerDeleteModal(lawyer: Lawyer) {
  const lawyerDeleteModal = this.dialog.open(LawyerDeleteComponent, {
    disableClose: true,
    width: "25%"
  });
  lawyerDeleteModal.componentInstance.deletedLawyer = lawyer;

  lawyerDeleteModal.afterClosed().subscribe({ next: 
    result => {
    this.ngOnInit();
    console.log(result)
    }
  })
}

showLawyerUpdateModal(lawyer: Lawyer) {
  const lawyerUpdateModal = this.dialog.open(LawyerUpdateComponent, {
    disableClose: true,
    width: "%40"
  });
  lawyerUpdateModal.componentInstance.currentLawyer = lawyer;

  lawyerUpdateModal.afterClosed().subscribe({next : result => {
    this.ngOnInit();
    console.log(result)
  }})
}



}