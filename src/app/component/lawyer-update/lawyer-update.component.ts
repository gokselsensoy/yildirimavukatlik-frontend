import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Lawyer } from 'src/app/models/lawyer';
import { LawyerImage } from 'src/app/models/lawyerImage';
import { UploadFile } from 'src/app/models/uploadFile';
import { LawyerImageService } from 'src/app/services/lawyer-image.service';
import { LawyerService } from 'src/app/services/lawyer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lawyer-update',
  templateUrl: './lawyer-update.component.html',
  styleUrls: ['./lawyer-update.component.css']
})
export class LawyerUpdateComponent implements OnInit {
  lawyers: Lawyer[] = [];
  currentLawyer: Lawyer;
  lawyerImages: LawyerImage[] = [];
  lawyerUpdateForm: FormGroup;
  dataLoaded: boolean = false;

  uploadFiles: UploadFile[] = [];
  uploadImagesPaths: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private lawyerUpdateModal: MatDialogRef<LawyerUpdateComponent>,
    private formBuilder: FormBuilder,
    private lawyerImageService: LawyerImageService,
    private lawyerService: LawyerService

  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      this.getLawyers()
      this.getAllLawyerImages()
  })
    // this.getLawyerImages();
    this.createLawyerUpdateForm();
      
  }

  getLawyers(){

    this.lawyerService.getLawyers().subscribe(response=>{
      this.lawyers = response.data
      this.dataLoaded = true;
      console.log('response', response.data)
    })
  
  }

  getLawyerImagesByLawyerId(lawyerId:number) {
    this.lawyerImageService.getLawyerImagesByLawyerId(lawyerId).subscribe(response => {
      this.lawyerImages = response.data;
      this.dataLoaded = true;
    })
  }

  getAllLawyerImages(){
    this.lawyerImageService.getAllLawyerImages().subscribe(response => {
      this.lawyerImages = response.data;
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

  update() {
    if (!this.lawyerUpdateForm.valid) {
      console.log("Formunuz hatalı", "Geçersiz form")
    } else {
      let lawyerUpdateModel = Object.assign({}, this.lawyerUpdateForm.value);
      lawyerUpdateModel.Id = this.currentLawyer.id;
      let deletedImages = this.currentLawyer.lawyerImages.filter(image => image.id != -1 && this.lawyerImages.indexOf(image) == -1)
      let lawyerInfoChanged: boolean = this.checkIfLawyerObjectChanged(lawyerUpdateModel, this.currentLawyer);
      let lawyerImagesChanged: boolean = this.checkIfLawyerImagesChanged(this.uploadFiles, deletedImages)
      if (!lawyerInfoChanged && !lawyerImagesChanged) {
        console.log("Herhangi bir değişiklik yapmadınız", "Güncellenmedi")
      } else {
        if ((this.lawyerImages.length + this.uploadFiles.length) > 5) { //Max 5 Image
          console.log("En fazla 5 resim yükleyebilirsiniz", "Avukat eklenmedi");
        } else {
          this.updateLawyerImages(deletedImages, this.uploadFiles).then((updateLawyerImageResult) => {
            this.lawyerService.update(lawyerUpdateModel).subscribe({ next: (updateSuccess) => {
              if (updateLawyerImageResult.length > 0) {
                console.log(updateSuccess, "Avukat başarıyla güncellendi fakat bazı resimler güncellenemedi. " + updateLawyerImageResult, "Avukat kısmen güncellendi")
                this.closeLawyerUpdateModal();
              } else {
                console.log("Avukat başarıyla güncellendi", "Avukat güncellendi")
                this.closeLawyerUpdateModal();
              }
            }, error : (errorResponse) => {
              console.log(errorResponse, "Avukat güncellenemedi");
            }
            })
          });
        }
      }
    }
  }

  private checkIfLawyerImagesChanged(uploadList: UploadFile[], deleteList: LawyerImage[]) {
    return !(uploadList.length === 0 && deleteList.length === 0)
  }

  private checkIfLawyerObjectChanged(newCarObject: any, oldCarObject: Lawyer,) {
    return !(newCarObject.name == oldCarObject.name &&
      newCarObject.position == oldCarObject.position &&
      newCarObject.description == oldCarObject.description)
  }

  private updateLawyerImages(deletedImages: LawyerImage[], uploadFiles: UploadFile[]): Promise<string> {
    return new Promise<string>((methodResolve) => {
      if (this.lawyerImages.length < this.currentLawyer.lawyerImages.length) { //If the car image was deleted
        deletedImages = this.currentLawyer.lawyerImages.filter(image => image.id != -1 && this.lawyerImages.indexOf(image) == -1);
      }
      let unDeletedImagesList: string = "";
      let unUploadedFileList: string = "";
      let deletePromise = new Promise<void>((deletePromiseResolve) => {
        this.deleteAllSelectedImagesFromServer(deletedImages).then((deleteResolve) => {
          if (deleteResolve.length > 0) {
            for (let i = 0; i < deleteResolve.length; i++) {
              unDeletedImagesList += deleteResolve[i].id + ', ';
              if (i === deleteResolve.length - 1) {
                deletePromiseResolve();
              }
            }
          } else {
            deletePromiseResolve();
          }
        })
      })
      deletePromise.then(() => {
        let uploadPromise = new Promise<void>((uploadPromiseResolve) => {
          this.uploadAllImagesToServer(uploadFiles).then((uploadResolve) => {
            if (uploadResolve.length > 0) {
              for (let i = 0; i < uploadResolve.length; i++) {
                unUploadedFileList += uploadResolve[i].file.name + ', ';
                if (i === uploadResolve.length - 1) {
                  uploadPromiseResolve();
                }
              }
            } else {
              uploadPromiseResolve();
            }
          })
        })
        uploadPromise.then(() => {
          let resultString = "";
          if (unDeletedImagesList.length > 0) {
            resultString += "Silinemeyen resim ID'leri: " + unDeletedImagesList
          }
          if (unUploadedFileList.length > 0) {
            resultString += "Yüklenemeyen resimler: " + unUploadedFileList
          }
          methodResolve(resultString);
        })
      })
    })
  }

  private deleteAllSelectedImagesFromServer(deletedImages: LawyerImage[]): Promise<LawyerImage[]> {
    return new Promise<LawyerImage[]>((methodResolve) => {
      if (deletedImages.length > 0) {
        let unDeletedImages: LawyerImage[] = [];
        const allDelets = new Promise<void>(async (resolveAllDelets) => {
          let counter = 0;
          for (const image of deletedImages) {
            await this.deleteImageFromServer(image).then((deleteSuccessFile) => {
            }, (deleteFailFile) => {
              unDeletedImages.push(deleteFailFile);
            }).then(() => {
              counter += 1;
              if (counter === deletedImages.length) {
                resolveAllDelets();
              }
            })
          }
        });
        allDelets.then(() => {
          methodResolve(unDeletedImages);
        })
      } else {
        let emptyArray: LawyerImage[] = [];
        methodResolve(emptyArray);
      }
    })
  }

  private deleteImageFromServer(deletedImage: LawyerImage): Promise<LawyerImage> {
    return new Promise<LawyerImage>((resolve, reject) => {
      this.lawyerImageService.deleteImage(deletedImage).subscribe({ next: (deleteSuccess) => {
        resolve(deletedImage);
        console.log(deleteSuccess, 'deleteSuccess')
      }, error: (deleteFail) => {
        reject(deletedImage);
        console.log(deleteFail, 'deleteFail')
      }
      })
    })
  }

  private uploadAllImagesToServer(uploadFiles: UploadFile[]): Promise<UploadFile[]> {
    return new Promise<UploadFile[]>((methodResolve) => {
      if (uploadFiles.length > 0) {
        let unUploadedFiles: UploadFile[] = []
        const allUploads = new Promise<void>(async (resolveAllUploads) => {
          let counter = 0;
          for (const file of uploadFiles) {
            await this.uploadImageToServer(file).then((fileStatus) => {
              if (fileStatus.uploadStatus === false) {
                unUploadedFiles.push(fileStatus)
              }
            }).then(() => {
              counter += 1;
              if (counter === uploadFiles.length) {
                resolveAllUploads();
              }
            });
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

  private uploadImageToServer(uploadFile: UploadFile): Promise<UploadFile> {
    return new Promise<UploadFile>((result) => {
      this.lawyerImageService.uploadImage(uploadFile.file, this.currentLawyer.id).subscribe({next :(uploadSuccess) => {
        uploadFile.uploadStatus = true;
        result(uploadFile);
        console.log(uploadSuccess,'uploadSuccess')
      }, error: (uploadFail) => {
        uploadFile.uploadStatus = false;
        result(uploadFile);
        console.log(uploadFail, 'uploadFail')
      }
      })
    })
  }

  addLawyerImagesToUploadAndPathList(imageList: any) {
    if (imageList.length !== 0) {
      if ((this.lawyerImages.length + this.uploadFiles.length) < 5) {
        for (let i = 0; i < imageList.length; i++) {
          let uploadFile = new UploadFile();
          let image = imageList[i];
          uploadFile.file = image;
          uploadFile.uploadStatus = false;
          let preselectedFile = this.uploadFiles.find(uploadFile => uploadFile.file.name === image.name);
          if (preselectedFile === undefined) {
            this.addLawyerImageToUploadImagesPath(image).then((success) => {
              if (success) {
                this.uploadFiles.push(uploadFile);
              }
            });
          } else {
            console.log("Bu resmi daha önce listeye eklediniz", "Zaten listede");
          }
        }
      } else {
        console.log("En fazla 5 resim ekleyebilirsiniz", "Resim eklenemiyor");
      }
    }
  }

  private addLawyerImageToUploadImagesPath(image: any): Promise<boolean> { //Source: https://www.talkingdotnet.com/show-image-preview-before-uploading-using-angular-7/
    return new Promise<boolean>((result) => {
      this.checkFileMimeType(image).then((successStatus) => {
        if (successStatus) {
          var reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = (_event) => {
            this.uploadImagesPaths.push(reader.result);
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

  private createLawyerUpdateForm() {
    this.lawyerUpdateForm = this.formBuilder.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.autoFillFieldsInCarUpdateForm();

  }

  private autoFillFieldsInCarUpdateForm() {
    let keys = Object.keys(this.lawyerUpdateForm.controls);
    keys.forEach(key => {
      let keyErrors = this.lawyerUpdateForm.get(key)?.errors;
      if (keyErrors != null) {
        let errorList = Object.keys(keyErrors);
        if (errorList.indexOf("required") != -1) {
          let car = Object.entries(this.currentLawyer);
          car.forEach(entries => {
            if (entries[0] == key) {
              this.lawyerUpdateForm.get(key)?.setValue(entries[1])
            }
          });
        }
      }
    })
  }

  deleteImageFromLawyerImages(image: LawyerImage) {
    this.lawyerImages.splice(this.lawyerImages.indexOf(image), 1);
  }

  deleteImageFromUploadFiles(uploadFile: UploadFile) {
    this.uploadImagesPaths.splice(this.uploadImagesPaths.indexOf(uploadFile), 1);
    this.uploadFiles.splice(this.uploadFiles.indexOf(uploadFile), 1);
  }

  getImagePath(imagePath: string) {
    return this.lawyerImageService.getImagePath(imagePath);
  }

  private getLawyerImages() {
    this.currentLawyer.lawyerImages.forEach(image => {
      if (image.id != -1) { //Do not add the default vehicle image to the list.
        this.lawyerImages.push(image);
      }
    });
    //this.carImages = this.currentCar.carImages;  -> This code will not work as arrays are reference type. Changes made to one list affect the other list.
  }

  closeLawyerUpdateModal() {
    this.lawyerUpdateModal.close();
  }
}
