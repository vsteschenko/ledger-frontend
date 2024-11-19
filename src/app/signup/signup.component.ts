import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { JwtAuthService } from '../jwt-auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  title = 'frontend_ledger_app';
  email: string = ''
  password: string = ''
  name: string = ''
  data: any;
  check: string = ''

  constructor(private jwtService: JwtAuthService, private router: Router) {}

  ngOnInit(): void {
    if(this.jwtService.isTokenValid()) {
      this.router.navigate(['/'])
    }
  }

  onSubmit(): void {

    const payload = {
      email: this.email,
      name: this.name,
      password: this.password
    };
  
    fetch('http://localhost:8080/v1/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        this.data = data

        if(this.data.success) {
          this.jwtService.setToken(this.data.message)
          console.log("Signup successful")
          this.router.navigate(['/'])
        } else {
          console.log('Signup failed')
        }
      })
      .catch(error => {
        console.error(error)
      })
  }
}