import { Component, OnInit } from '@angular/core';

import { CalendarEvent } from 'src/app/_models/calendar/calendar-event';
import { BankHolidayReadService } from '../_services/bank-holidays/bank-holiday-read.service';

@Component({
  selector: 'fam-app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  bankHolidays: CalendarEvent[] = [];
  loadedBankHolidays = false;

  currentMonth!: string;
  currentDate!: Date;

  constructor(
    private bankHolidayReadService: BankHolidayReadService,
  ) { }

  ngOnInit(): void {

    this.currentDate = new Date();
    this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });

    this.bankHolidayReadService.readBankHolidays().subscribe((b) => {
      this.loadedBankHolidays = b;
      this.bankHolidays = this.bankHolidayReadService.getBankHolidays();
    });
  }

  generateCalendar(): Date[][] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const weeks: Date[][] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstWeekdayOfMonth = firstDayOfMonth.getDay();
    const lastWeekdayOfMonth = lastDayOfMonth.getDay();

    // Create an empty week for the days before the first day of the month
    let week: Date[] = [];
    for (let i = 0; i < firstWeekdayOfMonth; i++) {
      week.push(new Date());
    }

    // Add each day in the month to the calendar
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      week.push(date);

      // If the end of the week has been reached, start a new one
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // Fill out the last week with empty days
    for (let i = lastWeekdayOfMonth; i < 6; i++) {
      week.push(new Date());
    }
    weeks.push(week);

    return weeks;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate();
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

}
