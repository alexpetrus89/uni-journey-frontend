import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { API } from '../../../../core/config/api-endpoints';
import { ApiError } from '../../../../core/models/error/api-error.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginPage implements OnInit {

  username = '';
  password = '';

  errorMessage: string | null = null;
  greeting = '';

  darkMode: boolean = false;
  isLoading: boolean = false;

  constructor(private readonly authService: AuthService) {}


  /* ================= LIFECYCLE =============== */
  ngOnInit(): void {
    this.initGreeting();
  }


  /* =================== LOGIN ================= */
  login(): void {
    this.errorMessage = null;
    this.isLoading = true;

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          this.isLoading = false;
          globalThis.location.href = API.auth.profile;
        },

        error: (err: ApiError) => {
          this.isLoading = false;
          switch (err?.status) {
            case 401:
              this.errorMessage = 'Invalid username or password.';
              break;
            case 403:
              this.errorMessage = err.message ?? 'Account disabled or locked.';
              break;
            case 429:
              this.errorMessage = 'Too many login attempts. Please wait and try again.';
              break;
            default:
              this.errorMessage = 'Unexpected error during login. Please try again.';
          }
        }

      });
  }

  loginWithGoogle(): void {
    globalThis.location.href = '/oauth2/authorization/google';
  }

  loginWithGithub(): void {
    globalThis.location.href = '/oauth2/authorization/github';
  }


  /* ================ PRIVATE ================= */
  private initGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning! Login to your account.';
    else if (hour < 18) this.greeting = 'Good afternoon! Login to your account.';
    else this.greeting = 'Good evening! Login to your account.';
  }


}
