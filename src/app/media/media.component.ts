import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';

import { MediaReadService } from 'src/app/_services/api/media/media-read.service';
import { MediaCreateService } from '../_services/api/media/media-create.service';
import { Medium } from 'src/app/_models/media/medium';

@Component({
  selector: 'fam-app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {

  isActive = true;

  loadedMedia = false;
  media: Medium[] = [];
  filteredMedia: Medium[] = [];
  modalRef: BsModalRef = new BsModalRef();

  newMediaForm: FormGroup = new FormGroup({
    director: new FormControl(''),
    title: new FormControl(''),
    publisher: new FormControl(''),
    actors: new FormControl(''),
    format: new FormControl(''),
    release_year: new FormControl(''),
    series_or_film: new FormControl(''),
    fiction: new FormControl(''),
    episodes: new FormControl(''),
    duration_in_minutes: new FormControl(''),
    language: new FormControl(''),
    location: new FormControl(''),
  });

  searchRegex = /["']([a-z0-9:,\-.\s^\/+]+)["']|([a-z0-9:,\-.^\/+]+)/gm;
  searchPhrase = '';

  constructor(
    private mediaReadService: MediaReadService,
    private mediaCreateService: MediaCreateService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.mediaReadService.readMedia().subscribe((b) => {
      this.loadedMedia = b;
      this.media = this.mediaReadService.getMedia();
      this.filteredMedia = this.media;
    });
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  filterMedia() {
    const searchTerms: string[] = [];
    // @ts-ignore
    const groups = this.searchPhrase.matchAll(this.searchRegex);
    let group = groups.next();
    while (!group.done) {
      for (let i = 1; i < group.value.length; i++) {
        if (group.value[i] !== undefined) {
          searchTerms.push(group.value[i].toLowerCase());
        }
      }
      group = groups.next();
    }

    this.filteredMedia = this.media.filter(item => {

      const included: boolean[] = [];

      const title = item.title?.toLowerCase();
      const director = item.director?.toLowerCase();
      const year = item.release_year?.toString();

      for (const searchTerm of searchTerms) {
        const includedForThisTerm: boolean[] = [];

        if (title) {
          includedForThisTerm.push(title.includes(searchTerm));
        }

        if (director) {
          includedForThisTerm.push(director.includes(searchTerm));
        }

        if (year) {
          includedForThisTerm.push(year.includes(searchTerm));
        }

        included.push(includedForThisTerm.reduceRight(
          (accumulator, currentValue) => {
            return accumulator || currentValue;
          },
          false
        ));
      }
      return included.reduceRight(
        (accumulator, currentValue) => {
          return accumulator && currentValue;
        },
        true
      );
    });
  }

  onMediaFormSubmit(): void {

    const payload = JSON.parse(JSON.stringify(this.newMediaForm.value));

    this.mediaCreateService.createMedia(
      {
        director: payload.director ?? null,
        title: payload.title,
        publisher: payload.publisher ?? null,
        actors: payload.actors ?? null,
        format: payload.format ?? null,
        release_year: payload.release_year ? parseInt(payload.release_year) : null,
        series_or_film: payload.series_or_film ?? null,
        fiction: payload.fiction ?? null,
        episodes: payload.episodes ?? null,
        duration_in_minutes: payload.duration_in_minutes ? parseInt(payload.duration_in_minutes) : null,
        language: payload.language ?? null,
        location: payload.location ?? null,
        id: payload.id ?? null
      }
    )
      .pipe(takeWhile(_ => this.isActive))
      .subscribe(
        (_) => {
          this.mediaReadService.readMedia();
        },
        (err) => console.log(err),
      );

    this.modalRef.hide();

  }

}
