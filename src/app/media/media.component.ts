import { Component, OnInit } from '@angular/core';
import { MediaDownloadService } from "../_services/api/media-download.service";
import { Media } from "../_models/media";

@Component({
  selector: 'fam-app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {

  loadedMedia = false;
  media: Media[] = [];

  constructor(
    private mediaDownloadService: MediaDownloadService,
  ) { }

  ngOnInit(): void {
    this.mediaDownloadService.downloadMedia().subscribe((b) => {
      this.loadedMedia = b;
      this.media = this.mediaDownloadService.getMedia();
    });
  }

}
