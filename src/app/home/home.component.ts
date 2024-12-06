import { Component, OnInit } from '@angular/core';
import { JwtAuthService } from '../jwt-auth.service';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { TransactionService, TX } from '../transaction.service';
import { TransactionDateService } from '../transaction-date.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, NavComponent, DialogModule, FormsModule, ButtonModule, DropdownModule, InputTextModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  amount: string = '';
  comment: string = '';
  location: string = '';
  transactions: TX[] = [];
  visibleReceive: boolean = false;
  visibleSpend: boolean = false;
  visibleChange: boolean = false;
  currentOperationType: string = '';
  date: object = {};
  selectedYear: number = 0;
  selectedMonth: Observable<string>;
  selectedCategory: string = '';
  answer: any;
  currentTx: any;
  currentMonth: string = ''
  monthAreSame: boolean = false;


  incomeSources: string[] = [
    "Salary",
    "Freelance Work",
    "Transfer from a Friend",
    "Dividends",
    "Interest",
    "Rental Income",
    "Business Profits",
    "Pension",
    "Bonuses",
    "Grants",
    "Scholarships",
    "Gifts",
    "Refunds",
    "Royalties",
    "Investment Returns",
    "Selling Assets",
    "Government Assistance",
    "Tax Refund",
    "Inheritances",
    "Lottery Winnings",
    "Crowdfunding Income",
    "Side Hustle",
    "Cashback Rewards",
    "Stock Options"
  ];
  spendCategories: string[] = [
    "Eating Out",
    "Groceries",
    "Cinema",
    "Airplane Tickets",
    "Taxi",
    "Public Transport",
    "Utilities",
    "Rent/Mortgage",
    "Healthcare",
    "Insurance",
    "Education",
    "Shopping",
    "Subscriptions",
    "Savings",
    "Investments",
    "Entertainment",
    "Gifts",
    "Charity",
    "Travel",
    "Fitness",
    "Pet Care",
    "Home Maintenance",
    "Childcare",
    "Alcohol",
    "Coffee",
    "Parking",
    "Car Maintenance",
    "Miscellaneous"
  ];

  constructor(
    private jwtService: JwtAuthService,
    private router:Router, 
    private transactionService: TransactionService,
    private transactionDateService: TransactionDateService) {
      this.selectedMonth = this.transactionDateService.selectedMonth$
      this.selectedYear = this.transactionDateService.selectedYear$
    }
  
  ngOnInit(): void {
    const now = new Date()
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.selectedMonth.subscribe(month => {
      if(month == months[now.getMonth()]) {
        console.log(month)
        console.log(months[now.getMonth()])
        this.currentMonth = months[now.getMonth()]
        this.monthAreSame = true
        console.log(this.monthAreSame)
      } else {
        this.monthAreSame = false
        console.log(this.monthAreSame)
      }
    })
    

    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions.map(tx => ({
        ...tx,
        date: new Date(tx.date)
      }));
    })
    this.selectedMonth = this.transactionDateService.selectedMonth$
  }

  fetchTransactions(): void {
    fetch('http://localhost:8080/v1/txs', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        this.transactionService.setTransactions(data);
      });
  }

  showDialogReceive(): void {
    this.visibleReceive = true;
  }

  showDialogSpend(): void {
    this.visibleSpend = true;
  }

  receiveTxCreate(): void {

    if(this.jwtService.isTokenValid()) {
      const payloadNew: TX = {
          id: Date.now(),
          comment: this.comment,
          category: this.selectedCategory,
          amount: parseFloat(this.amount),
          location: this.location,
          date: new Date()
        }

      // if(Object.keys(this.date).length === 0) {
      if(this.monthAreSame){
        const payload = {
          comment: this.comment,
          category: this.selectedCategory,
          amount: this.amount,
          location: this.location
        }
        fetch('http://localhost:8080/v1/txs/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${this.jwtService.getToken()}`
          },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
          this.answer = data
          this.transactions.push(payloadNew)
          this.visibleReceive = false;
          this.cleanInputs()
        })
      } else {
        this.selectedMonth.subscribe(month => {
          console.log(`${month} and ${this.currentMonth}`)
          const payload = {
            comment: this.comment,
            category: this.selectedCategory,
            amount: this.amount,
            location: this.location,
            date: {
              monthOftheYear: month,
              year: this.selectedYear
            }
          }
          console.log(payload)
          fetch('http://localhost:8080/v1/txs/create_with_time', {
            method: 'POST',
            headers: {
              'Content-Type': 'Application/json',
              'Authorization': `Bearer ${this.jwtService.getToken()}`
            },
            body: JSON.stringify(payload)
          })
          .then(response => response.json())
          .then(data => {
            this.answer = data
            this.transactions.push(payloadNew)
            this.visibleReceive = false;
            this.cleanInputs()
          })
        })
      }
    }
  }

  spendTxCreate(): void {
 
    if(this.jwtService.isTokenValid()) {

      const payloadNew: TX = {
        id: Date.now(),
        comment: this.comment,
        category: this.selectedCategory,
        amount: -parseFloat(this.amount),
        location: this.location,
        date: new Date()
      }
      const payload = {
        comment: this.comment,
        category: this.selectedCategory,
        amount: -this.amount,
        location: this.location
      }
      
      fetch('http://localhost:8080/v1/txs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/json',
          'Authorization': `Bearer ${this.jwtService.getToken()}`
        },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        this.answer = data;
        this.transactions.push(payloadNew)
        this.visibleSpend = false;
        this.cleanInputs()
      })
    }
  }

  showDialogChange(tx: TX): void {
    this.currentTx = tx;
    this.currentOperationType = tx.amount < 0 ? 'spend' : 'receive';
    this.selectedCategory = tx.category;
    this.amount = tx.amount.toString();
    this.comment = tx.comment;
    this.location = tx.location;
    this.visibleChange = true;
  }

  confirmChange(): void{
    const payload = {
      id:this.currentTx.id,
      comment: this.comment,
      category: this.selectedCategory,
      amount: this.amount,
    }
    fetch('http://localhost:8080/v1/txs/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/json',
        'Authorization': `Bearer ${this.jwtService.getToken()}`
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
      this.answer = data;
      const tx = this.transactions.find(tx => tx.id == this.currentTx.id)
      if(tx) {
        tx.comment = this.comment
        tx.category = this.selectedCategory
        tx.amount = parseFloat(this.amount)
      }
      this.visibleChange = false;
      this.cleanInputs()
    })
    
  }

  deleteTx(id: number): void {
    this.transactions = this.transactions.filter(tx => tx.id !== id)
    fetch(`http://localhost:8080/v1/txs/delete?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/json',
        'Authorization': `Bearer ${this.jwtService.getToken()}`
      }
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to delete the transaction.');
      }
    })
  }

  compareMontth(): void {

  }

  cleanInputs(): void {
    this.amount = '';
    this.location = '';
    this.comment = '';
  }

}