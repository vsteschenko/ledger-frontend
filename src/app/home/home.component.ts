import { Component, OnInit } from '@angular/core';
import { JwtAuthService } from '../jwt-auth.service';
import { NgFor, NgIf } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, NavComponent, DialogModule, FormsModule, ButtonModule, DropdownModule, InputTextModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name: string = ''
  transactions: TX[] = [];
  visible: boolean = false;
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
  selectedCategory: string = ''
  
  user = { username: '', email: '' };

  constructor(private jwtService: JwtAuthService) {}

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

  showDialog(): void {
    this.visible = true;
  }

  saveUser(): void {
    console.log('User saved:', this.user);
    this.visible = false;
  }

  receive(): void {
    console.log('Receive clicked');
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
