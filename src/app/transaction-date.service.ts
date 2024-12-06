import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionDateService {

  private selectedMonthSubject = new BehaviorSubject<string>('January')
  private selectedYearSubject = new BehaviorSubject<number>(2024)
  
  selectedMonth$ = this.selectedMonthSubject.asObservable()
  selectedYear$ = this.selectedYearSubject.asObservable()

  setSelectedMonth(month:string):void {
    this.selectedMonthSubject.next(month)
    // console.log(month)
  }

  setSelectedYear(year:number):void {
    this.selectedYearSubject.next(year)
    // console.log(year)
  }
}
