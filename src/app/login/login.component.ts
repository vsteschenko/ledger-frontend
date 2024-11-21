import { Component, OnInit, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { JwtAuthService } from '../jwt-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = ''
  password: string = ''
  data: any;
  check: string = ''

  constructor(private jwtService: JwtAuthService, private router: Router) {}

  ngOnInit(): void {
    if(this.jwtService.isTokenValid()) {
      this.router.navigate(['/'])
    }
  }

  onKeydown(event: KeyboardEvent): void {
    console.log('Key pressed:', event.key);
    if (event.key === 'Enter') {
      this.onSubmit();
    }
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
          this.jwtService.setToken(this.data.message)
          console.log("Login successful")
          this.router.navigate(['/'])
        } else {
          console.log('Login failed')
        }
      })
      .catch(error => {
        console.error(error)
      })
  }
}