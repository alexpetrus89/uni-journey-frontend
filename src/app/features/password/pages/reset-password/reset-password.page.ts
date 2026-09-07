import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PasswordService } from '../../../../core/services/password/password.service';
import { ApiError } from '../../../../core/models/error/api-error.model';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ResetPasswordPage implements OnInit {

  readonly specialCharsHint = 'One special character (!@#$%^&*())';

  token: string | null = null;
  password = '';
  confirm = '';

  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Stato live delle regole password
  rules = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly passwordService: PasswordService
  ) {}

  ngOnInit(): void {
    // Il link arriva come /reset-password?token=abc123
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  validatePassword(): void {
    const v = this.password;
    this.rules.length    = v.length >= 8;
    this.rules.uppercase = /[A-Z]/.test(v);
    this.rules.lowercase = /[a-z]/.test(v);
    this.rules.number    = /\d/.test(v);
    this.rules.special   = /[!@#$%^&*()]/.test(v);
  }

  isFormValid(): boolean {
    return (
      Object.values(this.rules).every(Boolean) &&
      this.password === this.confirm &&
      !!this.token
    );
  }

  resetPassword(): void {
    if (!this.isFormValid() || !this.token) return;

    this.errorMessage = null;
    this.isLoading = true;

    const token = this.token;

    this.passwordService.resetPassword(token, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Password reset successfully! You can now log in.';
        this.password = '';
        this.confirm = '';
      },
      error: (err: ApiError) => {
        this.isLoading = false;
        switch (err?.status) {
          case 400:
            this.errorMessage = 'Invalid or expired reset link. Please request a new one.';
            break;
          case 409:
            this.errorMessage = 'This password was already used. Choose a different one.';
            break;
          default:
            this.errorMessage = err?.message ?? 'Something went wrong. Please try again later.';
        }
      }
    });
  }

}
