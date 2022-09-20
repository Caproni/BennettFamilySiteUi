import {Component, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { animate, style } from '@angular/animations';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Photo } from 'src/app/_models/photos/photo';
import { PhotosCreateService } from 'src/app/_services/api/photos/photos-create.service';
import { PhotosReadService } from 'src/app/_services/api/photos/photos-read.service';
import { LoginService } from 'src/app/_services/login/login.service';
import { PhotoDetailsComponent } from './photo-details/photo-details.component';

@Component({
  selector: 'fam-app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {

  windowWidth!: number;
  windowHeight!: number;

  public masonryOptions: NgxMasonryOptions = {
    gutter: 0,
    fitWidth: false,
    animations: {
      show: [
        style({opacity: 0}),
        animate('400ms ease-in', style({opacity: 1})),
      ],
      hide: [
        style({opacity: '*'}),
        animate('400ms ease-in', style({opacity: 0})),
      ]
    }
  };

  @ViewChild(NgxMasonryComponent) masonry!: NgxMasonryComponent;
  @ViewChild(PhotoDetailsComponent) photo!: Photo;

  isActive = true;
  loadedPhotos = false;
  photos!: Photo[];
  filteredPhotos!: Photo[];

  modalRef: BsModalRef = new BsModalRef();

  allowedMimeTypes = ['image/png', 'image/jpeg'];
  photoFile = new File([], '');
  photoHeight = 0;
  photoWidth = 0;

  newPhotoForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    taken_by: new FormControl(''),
    taken_date: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    camera_details: new FormControl(''),
  });

  startDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(
    new Date(2021, 0, 1)
  );
  endDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(
    new Date(2022, 11, 31)
  );
  filterStartDate: Date = new Date();
  filterEndDate: Date = new Date();

  searchRegex = /["']([a-z0-9:,\-.\s^\/+]+)["']|([a-z0-9:,\-.^\/+]+)/gm;
  searchPhrase = '';

  constructor(
    private loginService: LoginService,
    private modalService: BsModalService,
    private toasterService: ToastrService,
    private photosCreateService: PhotosCreateService,
    private photosReadService: PhotosReadService,
  ) { }

  ngOnInit(): void {

    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    const distantFuture = new Date(2901, 0, 1);

    this.photosReadService.readPhotos().subscribe((b) => {
      this.loadedPhotos = b;
      const photos = this.photosReadService.getPhotos();
      if (photos.length > 0) {
        this.photos = photos.sort(
          (x, y) => {
            if ((x.taken_date ? x.taken_date: distantFuture) > (y.taken_date ? y.taken_date : distantFuture)) return -1;
            if ((x.taken_date ? x.taken_date: distantFuture) <= (y.taken_date ? y.taken_date : distantFuture)) return 1;
            return 0;
          }
        );
        this.filteredPhotos = this.photos;
        this.startDate = new BehaviorSubject<Date>(this.photos[0].taken_date?? new Date(2021, 0, 1));
        this.endDate = new BehaviorSubject<Date>(this.photos[this.photos.length - 1].taken_date?? new Date(2022, 11, 31));
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  isAuthorised(): boolean {
    return this.loginService.getAuthorised();
  }

  getPhotoWidth(): string {
    return 100 * (this.windowWidth / 3.5) / this.windowWidth + '%'
  }

  openModal(template: TemplateRef<any>, modalOptions: any): void {
    this.modalRef = this.modalService.show(template, modalOptions);
  }

  populatePhoto(photo: Photo) {
    this.photo = photo;
  }

  onPhotoSelected(event: any) {

    const target = event.target as HTMLInputElement;

    if (!target.files) return;

    const file: File = target.files && target.files[0];

    if (!file) return;

    if (this.allowedMimeTypes.includes(file.type)) {
      this.photoFile = file;
      const image = new Image();

      image.src = URL.createObjectURL(this.photoFile);
      image.onload = (e: any) => {
        this.photoHeight = e.path[0].height;
        this.photoWidth = e.path[0].width;
      }
      this.newPhotoForm.controls['image'].setValue(file.name);
    } else {
      console.log('Invalid file: ', file);
    }

  }

  photosLoaded() {
    this.toasterService.success('Photo album loaded.', 'Success');
  }

  updateStartDate(value: number): void {
    this.filterStartDate = new Date(value);
    this.filterPhotos();
  }

  updateEndDate(highValue: number): void {
    this.filterEndDate = new Date(highValue);
    this.filterPhotos();
  }

  public filterPhotos(): void {
    const searchFilteredPhotos = this.searchBarFilterPhotos(this.searchPhrase);
    this.filteredPhotos = this.temporalFilterPhotos(
      searchFilteredPhotos,
      this.filterStartDate,
      this.filterEndDate
    );
  }

  private temporalFilterPhotos(
    inputPhotos: Photo[],
    startDate: Date,
    endDate: Date,
    nullsIncluded: boolean = false
  ): Photo[] {
    return inputPhotos.filter((item) => {
      const nullValue = nullsIncluded ? startDate : new Date(2022, 1, 1);
      const timestamp = new Date(item.taken_date ?? nullValue);
      return startDate <= timestamp && timestamp <= endDate;
    });
  }

  private searchBarFilterPhotos(
    searchValue: string
  ): Photo[] {
    const searchTerms: string[] = [];
    const groups = searchValue.matchAll(this.searchRegex);
    let group = groups.next();
    while (!group.done) {
      for (let i = 1; i < group.value.length; i++) {
        if (group.value[i] !== undefined) {
          searchTerms.push(group.value[i].toLowerCase());
        }
      }
      group = groups.next();
    }
    const filteredPhotos = this.photos.filter((item) => {
      const included: boolean[] = [];

      const name = item.name.toLowerCase();
      const description = (item.description ?? '').toLowerCase();

      for (const searchTerm of searchTerms) {
        const includedForThisTerm: boolean[] = [];
        includedForThisTerm.push(name.includes(searchTerm));
        includedForThisTerm.push(description.includes(searchTerm));
        included.push(
          includedForThisTerm.reduceRight((accumulator, currentValue) => {
            return accumulator || currentValue;
          }, false)
        );
      }
      return included.reduceRight((accumulator, currentValue) => {
        return accumulator && currentValue;
      }, true);
    });

    return filteredPhotos;
  }

  onNewPhotoFormSubmit() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    const payload = JSON.parse(JSON.stringify(this.newPhotoForm.value));

    this.photosCreateService.createPhoto(
      {
        name: payload.name,
        description: payload.description ?? null,
        taken_by: payload.taken_by?? null,
        taken_date: payload.taken_date? new Date(payload.taken_date): new Date(this.photoFile.lastModified),
        image: null,
        blob_url: null,
        height: this.photoHeight,
        width: this.photoWidth,
        camera_details: payload.camera_details ?? null,
        id: null,
      },
      this.photoFile,
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.toasterService.info('Adding ' + payload.name, 'Info');
          this.ngOnInit();
        },
        (err) => {
          console.log(err);
          this.toasterService.error('Could not add ' + payload.name, 'Error');
        },
        () => {
          this.toasterService.success('Added ' + payload.name, 'Success');
        },
      );

    this.modalRef.hide();
  }

}
