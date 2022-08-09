import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { MediaReadService } from "src/app/_services/api/media/media-read.service";
import { Medium } from "src/app/_models/media/medium";

@Component({
  selector: 'fam-app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {

  loadedMedia = false;
  media: Medium[] = [];
  filteredMedia: Medium[] = [];
  modalRef: BsModalRef = new BsModalRef();

  searchRegex = /["']([a-z0-9:,\-.\s^\/+]+)["']|([a-z0-9:,\-.^\/+]+)/gm;
  searchPhrase = '';

  constructor(
    private mediaDownloadService: MediaReadService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.mediaDownloadService.readMedia().subscribe((b) => {
      this.loadedMedia = b;
      this.media = this.mediaDownloadService.getMedia();
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

}
