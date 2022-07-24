import { Component, OnInit } from '@angular/core';
import { MediaDownloadService } from "../_services/api/media-download.service";
import { Medium } from "../_models/medium";

@Component({
  selector: 'fam-app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {

  loadedMedia = false;
  media: Medium[] = [];
  filteredMedia: Medium[] = [];

  searchRegex = /["']([a-z0-9:,\-\.\s^\/+]+)["']|([a-z0-9:,\-\.^\/+]+)/gm;
  searchPhrase = '';

  constructor(
    private mediaDownloadService: MediaDownloadService,
  ) { }

  ngOnInit(): void {
    this.mediaDownloadService.downloadMedia().subscribe((b) => {
      this.loadedMedia = b;
      this.media = this.mediaDownloadService.getMedia();
      this.filteredMedia = this.media;
    });
  }

  filterMedia() {

  }

}
