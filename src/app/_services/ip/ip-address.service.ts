import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {

  ipAddress = ''

  constructor(
    private http: HttpClient,
  ) { }

  getIpAddress(): string {
    return this.ipAddress;
  }

  readIpAddress(): Observable<boolean> {
    let _subject = new BehaviorSubject<boolean>(false);
    this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
      _subject.next(true);
    });

    return _subject.asObservable();

  }
}
