import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { UploadFile } from 'src/app/models/uploadFile';
import { LawyerImageService } from 'src/app/services/lawyer-image.service';
import { LawyerService } from 'src/app/services/lawyer.service';

@Component({
  selector: 'app-lawyer-add',
  templateUrl: './lawyer-add.component.html',
  styleUrls: ['./lawyer-add.component.css'],
})
export class LawyerAddComponent implements OnInit {
  lawyerAddForm : FormGroup;

  lawyerImagesFiles: UploadFile[] = [];
  lawyerImagesPaths: any[] = []

  constructor(
    private formBuilder: FormBuilder,
    private lawyerService: LawyerService,
    private lawyerImageService: LawyerImageService
  ) {}

  ngOnInit(): void {
    this.createLawyerAddForm();
  }

  createLawyerAddForm() {
    this.lawyerAddForm = this.formBuilder.group({
      sortId: ['', Validators.required],
      name: ['', Validators.required],
      position: ['', Validators.required],
      description: ['']
    });
  }

  // add() {
  //   if (this.lawyerAddForm.valid) {
  //     let lawyerModel = Object.assign({}, this.lawyerAddForm.value);
  //     this.lawyerService.lawyerAdd(lawyerModel).subscribe(
  //       (response) => {
  //         console.log("başarılı")
  //       },
  //       (responseError) => {
  //         if (responseError.error.Errors.length > 0) {
  //           for (let i = 0; i < responseError.error.Errors.length; i++) {
  //             console.log("doğrulama hatası")
  //           }
  //         }
  //       }
  //     );
  //   } else {
  //     console.log("formunuz eksik")
  //   }
  // }


  add() {
    if (!this.lawyerAddForm.valid) {
      console.log('formunuz hatalı veya eksik')
    } else {
      let lawyerModel = Object.assign({}, this.lawyerAddForm.value);
      //Add Car to Server
      this.lawyerService.lawyerAdd(lawyerModel).subscribe({
        next: (lawyerAddSuccessResponse) => {
        if (this.lawyerImagesFiles.length === 0) {  //No pictures, just car added
          console.log('Avukat başarıyla eklendi');
        }
        else {  //If car pictures will be uploaded
          if (this.lawyerImagesFiles.length > 1) { //Max 5 Image
            console.log("En fazla 1 resim yükleyebilirsiniz", "Araç eklenmedi");
          } else {
            console.log('lawyeraddsuccess',lawyerAddSuccessResponse);
            this.uploadAllImagesToServer(this.lawyerImagesFiles, lawyerAddSuccessResponse.data).then((unUploadFileList) => {
              let unUploadedFiles: UploadFile[] = unUploadFileList;
              if (unUploadedFiles.length === 0) {
                console.log("Yeni araç ve resimleri başarıyla eklendi", "İşlem başarılı");
              } else {
                let failFileNameMessage: string = ""
                unUploadedFiles.forEach(file => {
                  failFileNameMessage += file.file.name + ", "
                });
                console.log("Yeni araç başarıyla eklendi fakat bazı resimler yüklenemedi. Yüklenemeyen dosyalar: " + failFileNameMessage, "İşlem kısmen başarılı");
                console.log("unuploadedfiles", unUploadFileList)
              }
            })

          }
        }
      }, error: (errorResponse) => {
        console.log(errorResponse, "Avukat eklenemedi");
      }})
    }
  }

  deleteImageFromLawyerImagesList(selectedImage: UploadFile) {
    this.lawyerImagesFiles.splice(this.lawyerImagesFiles.indexOf(selectedImage), 1);
    this.lawyerImagesPaths.splice(this.lawyerImagesPaths.indexOf(selectedImage), 1);
  }

  addLawyerImagesToLawyerImagesAndPathList(imageList: any) {
    if (imageList.length !== 0) {
      if (this.lawyerImagesFiles.length < 1) {
        for (let i = 0; i < imageList.length; i++) {
          let uploadFile = new UploadFile();
          let image = imageList[i];
          uploadFile.file = image;
          uploadFile.uploadStatus = false;
          let preselectedFile = this.lawyerImagesFiles.find(uploadFile => uploadFile.file.name === image.name);
          if (preselectedFile === undefined) {
            this.addLawyerImageToLawyerImagesPaths(image).then((success) => {
              if (success) {
                this.lawyerImagesFiles.push(uploadFile);
              }
            });
          } else {
            console.log("Bu resmi daha önce listeye eklediniz", "Zaten listede");
          }
        }
      } else {
        console.log("En fazla 1 resim ekleyebilirsiniz", "Resim eklenemiyor");
      }

    }
  }

  private addLawyerImageToLawyerImagesPaths(image: any): Promise<boolean> { //Source: https://www.talkingdotnet.com/show-image-preview-before-uploading-using-angular-7/
    return new Promise<boolean>((result) => {
      this.checkFileMimeType(image).then((successStatus) => {
        if (successStatus) {
          var reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = (_event) => {
            this.lawyerImagesPaths.push(reader.result);
            result(true);
          }
        } else {
          console.log("Yalnızca resim dosyası yükleyebilirsiniz", "Dosya eklenmedi");
          result(false);
        }
      })
    })
  }

  private checkFileMimeType(file: any): Promise<boolean> {
    return new Promise<boolean>((methodResolve) => {
      var mimeType = file.type;
      methodResolve(mimeType.match(/image\/*/) != null);
    })
  }



  private uploadAllImagesToServer(uploadFiles: UploadFile[], lawyerId: number): Promise<UploadFile[]> {
    return new Promise<UploadFile[]>((methodResolve) => {
      if (uploadFiles.length > 0) {
        let unUploadedFiles: UploadFile[] = []
        const allUploads = new Promise<void>(async (resolveAllUploads) => {
          let counter: number = 0;
          for (const file of uploadFiles) {
            await this.uploadImageToServer(file, lawyerId).then(fileStatus => {
              console.log("file",file)
              if (fileStatus.uploadStatus === false) {
                unUploadedFiles.push(fileStatus);
              }
            }).then(() => {
              counter += 1;
              if (counter === uploadFiles.length) {
                resolveAllUploads();
              }
            })
          }
        })
        allUploads.then(() => {
          methodResolve(unUploadedFiles);
        })
      } else {
        let emptyArray: UploadFile[] = [];
        methodResolve(emptyArray);
      }
    })
  }

  private uploadImageToServer(uploadFile: UploadFile, lawyerId: number): Promise<UploadFile> {
    return new Promise<UploadFile>((result) => {
      this.lawyerImageService.uploadImage(uploadFile.file, lawyerId).subscribe(
        { next: (uploadSuccess) => {
          console.log("uploadsuccess", uploadSuccess)
        uploadFile.uploadStatus = true;
        result(uploadFile);
      }, error: (uploadFail) => {
        console.log("uploadFail", uploadFail)
        uploadFile.uploadStatus = false;
        result(uploadFile);
      }})
      
    })
  }


  
}