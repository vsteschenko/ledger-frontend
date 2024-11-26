import { Component, OnInit } from '@angular/core';
import { JwtAuthService } from '../jwt-auth.service';
import { NgFor, NgIf } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, NavComponent, DialogModule, FormsModule, ButtonModule, DropdownModule, InputTextModule],
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

  selectedCategory: string = '';
  answer: any;
  currentTx: any;

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

  constructor(private jwtService: JwtAuthService, private router:Router) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    fetch('http://localhost:8080/v1/txs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.jwtService.getToken()}`
      }
    })
      .then(response => response.json())
      .then(data => {
        this.transactions = data;
        // console.log(this.transactions);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
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
          date: new Date().toLocaleString()
        }
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
        date: new Date().toLocaleString()
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
    // add logic to confirm tx and after that cleanInputs
    // this.cleanInputs()
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
      console.log(data)
      this.visibleChange = false;
      this.cleanInputs()
    })
    
  }

  deleteTx(id: number): void {
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
      this.transactions = this.transactions.filter(tx => tx.id !== id)
    })
  }

  cleanInputs(): void {
    this.amount = '';
    this.location = '';
    this.comment = '';
  }

}

interface TX {
  id: number;
  amount: number;
  category: string;
  location: string;
  comment: string;
  date: string;
}