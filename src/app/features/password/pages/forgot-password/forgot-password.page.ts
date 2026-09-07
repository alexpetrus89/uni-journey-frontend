import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PasswordService } from '../../../../core/services/password/password.service';
import { ApiError } from '../../../../core/models/error/api-error.model';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ForgotPasswordPage {

  email = '';
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private readonly passwordService: PasswordService) {}

  requestReset(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    this.passwordService.requestReset(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        // Generic message: non rivela se l'email esiste o meno (security best practice)
        this.successMessage = 'If an account exists for this email, a reset link has been sent.';
        this.email = '';
      },
      error: (err: ApiError) => {
        this.isLoading = false;
        // L'interceptor gestisce già 401/403/503
        // Qui solo messaggi contestuali per questo endpoint
        this.errorMessage = err?.message ?? 'Something went wrong. Please try again.';
      }
    });
  }

}
