import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { API } from '../../../../core/config/api-endpoints';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CommonModule, RouterModule],
})
export class HomePage implements OnInit, AfterViewInit {

  /* ================== VIEW ================== */
  @ViewChildren('card') cards!: QueryList<ElementRef<HTMLElement>>;

  /* ================== STATE ================= */
  userName: string = 'User';
  darkMode: boolean = false;
  currentYear: number = new Date().getFullYear();

  constructor(private readonly authService: AuthService) {}


  /* ================= LIFECYCLE =============== */
  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngAfterViewInit(): void {
    this.initCardAnimations();
  }

  goToProfile(): void {
    globalThis.location.href = API.auth.profile;
  }


  /* ================== UI ==================== */
  showToast(message: string, duration = 2200): void {
    const container =
      document.getElementById('toast-container') ??
      this.createToastContainer();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }


  /* ================ PRIVATE ================= */
  private initCardAnimations(): void {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.3 }
    );

    this.cards.forEach(card => observer.observe(card.nativeElement));
  }

  private loadUserProfile(): void {
    this.authService
      .getUserProfile()
      .subscribe(profile => {
        if (profile) {
          this.userName = profile.name;
        } else {
          this.userName = '';
        }
      });
  }


  private createToastContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
  }


}
