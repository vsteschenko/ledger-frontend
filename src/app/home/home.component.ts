import { Component, OnInit, NgModule } from '@angular/core';
import { JwtAuthService } from '../jwt-auth.service';
import { NgFor } from '@angular/common';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private jwtService: JwtAuthService) {}
  transactions: TX[] = [];

  ngOnInit(): void {
    fetch('http://localhost:8080/v1/txs', {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        'Authorization': `Bearer ${this.jwtService.getToken()}`
      }
    })
    .then(response => response.json())
    .then(data => {
      this.transactions = data
      console.log(this.transactions)
    })
    .catch(error => {
      console.error(error)
    })
  }
}

interface TX {
  id: number,
  amount: number,
  category: string,
  location: string,
  comment: string, 
  date: string
}