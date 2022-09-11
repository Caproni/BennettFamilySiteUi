import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateNotifyService {

  constructor(
    private swUpdate: SwUpdate,
  ) {
    swUpdate.available.subscribe(event => {});
  }

}
