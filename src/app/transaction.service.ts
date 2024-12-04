import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TX {
  id: number;
  amount: number;
  category: string;
  location: string;
  comment: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<TX[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  setTransactions(transactions: TX[]): void {
    this.transactionsSubject.next(transactions);
  }

  addTransaction(tx: TX): void {
    const currentTransactions = this.transactionsSubject.value;
    this.transactionsSubject.next([...currentTransactions, tx]);
  }

  deleteTransaction(id: number): void {
    const currentTransactions = this.transactionsSubject.value;
    this.transactionsSubject.next(currentTransactions.filter(tx => tx.id !== id));
  }
}
