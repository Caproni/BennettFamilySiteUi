import {Component, HostListener, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { animate, style } from '@angular/animations';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Content } from 'src/app/_models/contents/content';
import { PhotosCreateService } from 'src/app/_services/api/photos/photos-create.service';
import { PhotosReadService } from 'src/app/_services/api/photos/photos-read.service';
import { LoginService } from 'src/app/_services/login/login.service';
import { ContentDetailsComponent } from 'src/app/contents/content-details/content-details.component';

@Component({
  selector: 'fam-app-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.css']
})
export class ContentsComponent implements OnInit {

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
  @ViewChild(ContentDetailsComponent) content!: Content;

  isActive = true;
  loadedContent = false;
  contents!: Content[];
  filteredContents!: Content[];

  modalRef: BsModalRef = new BsModalRef();

  allowedPhotoMimeTypes = ['image/png', 'image/jpeg'];
  allowedVideoMimeTypes = ['video/mp4'];
  file = new File([], '');
  contentHeight: number | null = 0;
  contentWidth: number | null = 0;
  fileFormat = '';

  newContentForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    taken_by: new FormControl(''),
    taken_date: new FormControl(''),
    file: new FormControl('', [Validators.required]),
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

    this.photosReadService.readContent().subscribe((b) => {
      this.loadedContent = b;
      const photos = this.photosReadService.getContent();
      if (photos && photos.length > 0) {
        this.contents = photos.sort(
          (x, y) => {
            if ((x.taken_date ? x.taken_date: distantFuture) > (y.taken_date ? y.taken_date : distantFuture)) return -1;
            if ((x.taken_date ? x.taken_date: distantFuture) <= (y.taken_date ? y.taken_date : distantFuture)) return 1;
            return 0;
          }
        );
        this.filteredContents = this.contents;
        this.startDate = new BehaviorSubject<Date>(this.contents[0].taken_date?? new Date(2021, 0, 1));
        this.endDate = new BehaviorSubject<Date>(this.contents[this.contents.length - 1].taken_date?? new Date(2022, 11, 31));
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
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

  populateContent(content: Content) {
    this.content = content;
  }

  onContentSelected(event: any) {

    const target = event.target as HTMLInputElement;
    if (!target.files) return;
    const file: File = target.files && target.files[0];
    if (!file) return;
    this.selectContent(file);

  }

  selectContent(file: File) {

    if (this.allowedPhotoMimeTypes.includes(file.type)) {
      this.file = file;
      this.fileFormat = file.type;
      const image = new Image();

      image.src = URL.createObjectURL(this.file);
      image.onload = (e: any) => {
        this.contentHeight = e.path[0].height;
        this.contentWidth = e.path[0].width;
      }
      this.newContentForm.controls['file'].setValue(file.name);
    }
    else if (this.allowedVideoMimeTypes.includes(file.type)) {
      this.file = file;
      this.fileFormat = file.type;

      this.contentHeight = null;
      this.contentWidth = null;

      this.newContentForm.controls['file'].setValue(file.name);
    } else {
      console.log('Invalid file: ', file);
    }

  }

  photosLoaded() {
    this.toasterService.success('Content album loaded.', 'Success');
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
    const searchFilteredPhotos = this.searchBarFilterContent(this.searchPhrase);
    this.filteredContents = this.temporalFilterContent(
      searchFilteredPhotos,
      this.filterStartDate,
      this.filterEndDate
    );
  }

  private temporalFilterContent(
    inputPhotos: Content[],
    startDate: Date,
    endDate: Date,
    nullsIncluded: boolean = false
  ): Content[] {
    return inputPhotos.filter((item) => {
      const nullValue = nullsIncluded ? startDate : new Date(2022, 1, 1);
      const timestamp = new Date(item.taken_date ?? nullValue);
      return startDate <= timestamp && timestamp <= endDate;
    });
  }

  private searchBarFilterContent(
    searchValue: string
  ): Content[] {
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

    return this.contents.filter((item) => {
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
  }

  onNewContentFormSubmit() {

    if (!this.loginService.checkModalAuthorised(this.modalRef)) return;

    this.selectContent(this.file);

    const payload = JSON.parse(JSON.stringify(this.newContentForm.value));

    this.photosCreateService.createPhoto(
      {
        name: payload.name,
        description: payload.description ?? null,
        taken_by: payload.taken_by?? null,
        taken_date: payload.taken_date? new Date(payload.taken_date): new Date(this.file.lastModified),
        file: null,
        file_format: this.fileFormat,
        blob_url: null,
        height: this.contentHeight,
        width: this.contentWidth,
        camera_details: payload.camera_details ?? null,
        id: null,
      },
      this.file,
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
