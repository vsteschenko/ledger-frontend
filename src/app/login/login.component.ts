import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  title = 'frontend_ledger_app';
  email: string = ''
  password: string = ''
  data: any;
  check: string = ''

  constructor(private cookieService: CookieService, private router: Router) {}

  setToken(token: string) {
    this.cookieService.set('token', this.data.message, { 
      // secure: true, 
      // sameSite: 'Strict' 
    });
  }

  getToken() {
    return this.cookieService.get('token');
  }

  deleteToken() {
    this.cookieService.delete('token');
  }

  checkIfLoggedIn(): void {
    const token = this.getToken()

    fetch('http://localhost:8080/protected', {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if(data.message == 'JWT is valid') {
        this.router.navigate(['/home']);
      } else {
        console.log('Access to protected endpoint successful');
      }
    })
  }
  ngOnInit(): void {
    this.checkIfLoggedIn()
  }

  onSubmit(): void {

    const payload = {
      email: this.email,
      password: this.password
    };
  
    fetch('http://localhost:8080/v1/users/login', {
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
          this.setToken(this.data.message)
          console.log("Login successful")
          this.router.navigate(['/home'])
        } else {
          console.log('Login failed')
        }
      })
      .catch(error => {
        console.error(error)
      })
  }
}