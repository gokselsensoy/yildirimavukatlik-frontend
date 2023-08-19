import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lawyer } from 'src/app/models/lawyer';
import { LawyerDetailDto } from 'src/app/models/lawyerDetails';
import { LawyerImage } from 'src/app/models/lawyerImage';
import { LawyerImageService } from 'src/app/services/lawyer-image.service';
import { LawyerService } from 'src/app/services/lawyer.service';

@Component({
  selector: 'app-lawyer',
  templateUrl: './lawyer.component.html',
  styleUrls: ['./lawyer.component.css']
})
export class LawyerComponent implements OnInit {
  lawyers:Lawyer[] = [];
  lawyerImages:LawyerImage[] = [];
  // lawyer: LawyerDetailDto;
  currentLawyer: Lawyer;
  dataLoaded: boolean = false;
  filterText="";
  // baseUrl="https://localhost:44345/images/"
  imageOfPath : string = "";

  constructor(
    private lawyerService:LawyerService, 
    private lawyerImageService:LawyerImageService,
    route: Router,
    private activatedRoute:ActivatedRoute) { }


  ngOnInit(): void {    
    this.activatedRoute.params.subscribe(params=>{
      // if(params["sortId"]){
      //   this.getBySortId(params["sortId"])
      // }


        this.getLawyers()
        this.getAllLawyerImages()
      
    })
}

getLawyers(){

  this.lawyerService.getLawyers().subscribe(response=>{
    this.lawyers = response.data
    this.dataLoaded = true;
    console.log('response', response.data)
  })

  // .sort((a,b) => a.sortId - b.sortId)

}

// getBySortId(sortId:number){

//   this.lawyerService.getBySortId(sortId).subscribe(response=>{
//     this.lawyers = response.data
//     this.dataLoaded = true;
//   })

// }

getAllLawyerImages(){
  this.lawyerImageService.getAllLawyerImages().subscribe(response => {
    this.lawyerImages = response.data;
  })
}


// image(lawyerId:number){
//   this.lawyerImageService.getLawyerImagesByLawyerId(lawyerId).subscribe(response=>{
//     const imagePath=response.data[0].imagePath
//     this.imageOfPath= this.baseUrl+imagePath;
//     console.log(this.imageOfPath)
//   })
//   return this.imageOfPath
  
// }

// getImagePath(imagePath: string) {
//   return this.lawyerImageService.getImagePath(imagePath);
// }

// getCurrentLawyerDetails(lawyerId: number) {
//   return new Promise<void>((resolve, reject) => {
//     this.lawyerService.getLawyerDetails(lawyerId).subscribe((response) => {
//       this.currentLawyer = response.data;
//       this.dataLoaded = true;
//       resolve();
//     });
//   });
// }

// getActiveImageClass(lawyerImage:LawyerImage){
//   if (lawyerImage===this.lawyerImages[0]) {
//     return "active"
//   } else {
//     return ""
//   }
// }

// getLawyerImagesByLawyerId(lawyerId:number){
//     return new Promise<void>((resolve, reject) => {
//   this.lawyerImageService.getLawyerImagesByLawyerId(lawyerId).subscribe(response=>{
//     this.lawyerImages=response.data;
//           this.dataLoaded = true;
//       resolve();
//   });
    
//   });
// }

getLawyerImagesByLawyerId(lawyerId:number) {
  this.lawyerImageService.getLawyerImagesByLawyerId(lawyerId).subscribe(response => {
    this.lawyerImages = response.data;
    this.dataLoaded = true;
  })
}

// getImagePath(lawyerImage:LawyerImage):string {
//   let url: string ="https://localhost:44327/images/" + lawyerImage.imagePath
//   return url;
// }

getImagesClass(lawyerImage:LawyerImage){
  if (this.lawyerImages[0] == lawyerImage) {
    return "carousel-item active"
  } else {
    return "carousel-item"
  }
}

// getLawyerDetails(lawyerId: number) {
//   this.lawyerService.getLawyerDetails(lawyerId).subscribe((response)=>{
//     this.lawyer = response.data
//     this.dataLoaded = true;
//   })
// }

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
}
