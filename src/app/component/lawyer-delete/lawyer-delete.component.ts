import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { Lawyer } from 'src/app/models/lawyer';
import { LawyerImage } from 'src/app/models/lawyerImage';
import { LawyerImageService } from 'src/app/services/lawyer-image.service';
import { LawyerService } from 'src/app/services/lawyer.service';

@Component({
  selector: 'app-lawyer-delete',
  templateUrl: './lawyer-delete.component.html',
  styleUrls: ['./lawyer-delete.component.css']
})
export class LawyerDeleteComponent implements OnInit {
deletedLawyer: Lawyer;
lawyerImages: LawyerImage[] = [];
dataLoaded: boolean = false;
lawyers : Lawyer[] = [];
constructor(
  private lawyerDeleteModal: MatDialogRef<LawyerDeleteComponent>,
  private lawyerImageService: LawyerImageService,
  private lawyerService: LawyerService,
  private activatedRoute:ActivatedRoute
) { }

ngOnInit(): void {
  this.activatedRoute.params.subscribe(params=>{
    this.getLawyers()
    this.getAllLawyerImages()
})
}

getAllLawyerImages(){
  this.lawyerImageService.getAllLawyerImages().subscribe(response => {
    this.lawyerImages = response.data;
  })
}

getImagesClass(lawyerImage:LawyerImage){
  if (this.lawyerImages[0] == lawyerImage) {
    return "carousel-item active"
  } else {
    return "carousel-item"
  }
}

getLawyerImagesByLawyerId(lawyerId:number) {
  this.lawyerImageService.getLawyerImagesByLawyerId(lawyerId).subscribe(response => {
    this.lawyerImages = response.data;
    this.dataLoaded = true;
  })
}

delete(lawyer: Lawyer) {
  this.lawyerService.delete(lawyer).subscribe({
    next: (response) => {
console.log(response, "Silme işlemi başarılı")
this.closeLawyerDeleteModal();
  }, error : (errorResponse) => {
    console.log(errorResponse, "Silme işlemi başarılı")
  }
  })
}

getLawyerImagePath(lawyerId:number):string {
  let url: string;
  const lawyerImage = this.lawyerImages.find(image => image.lawyerId === lawyerId);
  if (lawyerImage) {
    url = "https://localhost:44345/" + lawyerImage.imagePath;
  } else {
    url = "https://localhost:44345/images/defaultimage.png";
  }
  return url;

}

getImagePath(imagePath: string) {
  return this.lawyerImageService.getImagePath(imagePath);
}

closeLawyerDeleteModal() {
  this.lawyerDeleteModal.close();
}

getLawyers(){

  this.lawyerService.getLawyers().subscribe(response=>{
    this.lawyers = response.data
    this.dataLoaded = true;
    console.log('response', response.data)
  })

}

}