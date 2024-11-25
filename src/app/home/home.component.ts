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
  name: string = ''
  amount: string = ''
  comment: string = ''
  location: string = ''
  transactions: TX[] = [];
  visibleReceive: boolean = false;
  visibleSpend: boolean = false;
  selectedCategory: string = ''
  answer: any

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
        console.log(this.transactions);
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

  receive(): void {
    console.log('Receive clicked');
  }

  receiveTxCreate(): void {
    if(this.jwtService.isTokenValid()) {
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
        console.log(this.answer)
      })
    }
  }

  spendTxCreate(): void {
    if(this.jwtService.isTokenValid()) {
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
        this.answer = data
        console.log(this.answer)
      })
    }
  }

  deleteTx(id: number): void {
    fetch(`http://localhost:8080/v1/txs/delete?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'Application/json',
        'Authorization': `Bearer ${this.jwtService.getToken()}`
      }
    })
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