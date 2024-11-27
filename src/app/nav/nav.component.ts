import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { JwtAuthService } from '../jwt-auth.service';
import { Router } from '@angular/router';
import { TransactionService, TX } from '../transaction.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, ButtonModule, SidebarModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  sidebarVisible = false;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedMonth: string = this.months[0];
  selectedYear: number = 2024;
  transactions: string[] = [];
  constructor(private jwtService: JwtAuthService, private router: Router, private transactionService: TransactionService) {}

  signOut(): void {
    this.jwtService.deleteToken()
    this.router.navigate(['/signin'])
  }

  scrollToMonth(month: string): void {
    this.selectedMonth = month;
    const monthIndex = this.months.indexOf(month);

    const sliderElement = document.querySelector('.months') as HTMLElement;
    const monthElements = Array.from(sliderElement.children) as HTMLElement[];

    const leftOffset = monthElements[monthIndex].offsetLeft - sliderElement.offsetWidth / 2 + monthElements[monthIndex].offsetWidth / 2;

    sliderElement.scrollTo({
        left: leftOffset,
        behavior: 'smooth',
    });

    this.getFilteredTransactions(month)
  }

  getFilteredTransactions(month: string): void {
    fetch(`http://localhost:8080/v1/txs/filterByDate?month=${month}&year=${this.selectedYear}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        'Authorization': `Bearer ${this.jwtService.getToken()}`
      }
    })
    .then(response => response.json())
    .then((data:TX[]) => {
      this.transactionService.setTransactions(data)
    })
  }
}
