import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { CalendarEvent } from 'src/app/_models/calendar/calendar-event';

@Injectable({
  providedIn: 'root'
})
export class BankHolidayReadService {

  content: CalendarEvent[] = [];
  private baseUrl = 'https://www.gov.uk/bank-holidays.json';

  constructor(
    private http: HttpClient,
  ) { }

  getBankHolidays(): CalendarEvent[] {
    return this.content;
  }

  readBankHolidays(): Observable<boolean> {
    let _subject = new BehaviorSubject<boolean>(false);
    this.http.get<CalendarEvent>(this.baseUrl).subscribe(
      (response: any) => {
          const events = response['england-and-wales'].events;
          for (const event of events) {
            const start = new Date(event.date);
            const end = new Date(event.date);
            end.setHours(end.getHours() + 1);
            // @ts-ignore
            this.events.push(new CalendarEvent(event.title, start, end));
          }
          _subject.next(true);
      },
      (error) => {
        console.log('Error retrieving bank holidays: ', error);
      }
    )
    return _subject.asObservable();
  }
}
