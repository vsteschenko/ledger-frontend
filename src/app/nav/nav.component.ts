import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { JwtAuthService } from '../jwt-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, ButtonModule, SidebarModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  sidebarVisible = false;
  constructor(private jwtService: JwtAuthService, private router: Router) {}

  signOut(): void {
    this.jwtService.deleteToken()
    this.router.navigate(['/signin'])
  }
}