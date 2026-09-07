import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ThemeService } from '../../../../core/services/theme/theme.service';
import { UserNotification } from '../../../user/models/notification.model';
import { NotificationService } from '../../../user/services/notification.service';


@Component({
  selector: 'app-student-home',
  standalone: true,
  templateUrl: './student-home.page.html',
  styleUrls: ['./student-home.page.scss'],
  imports: [CommonModule, RouterModule]
})
export class StudentHomePage implements OnInit, OnDestroy {

  // ── State ──────────────────────────────────────────
  username = signal<string>('Student');
  notifications = signal<UserNotification[]>([]);
  toastMessage = signal<string | null>(null);
  greeting = '';
  readonly currentYear = new Date().getFullYear();

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly themeService: ThemeService
  ) {}


  /* ================= LIFECYCLE =============== */
  ngOnInit(): void {
    this.initGreeting();
    this.loadUsername();
    this.loadNotifications();
    this.connectWebSocket();
  }

  ngOnDestroy(): void {
    this.notificationService.disconnectWebSocket();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }


  /* ================= THEME =============== */
  get darkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.showToast(this.darkMode ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
  }


  /* ================= NOTIFICATIONS =============== */
  markAsRead(notification: UserNotification): void {
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        this.notifications.update(list =>
          list.filter(n => n.id !== notification.id)
        );
      }
    });
  }


  /* ================= LOGOUT =============== */
  logout(): void {
    this.authService.logout().subscribe({
      next: () => globalThis.location.href = '/home',
      error: () => globalThis.location.href = '/home'
    });
  }


  /* ================= TOAST =============== */
  showToast(message: string): void {
    this.toastMessage.set(message);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage.set(null), 3300);
  }


  /* ================= PRIVATE =============== */
  private initGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 18) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }

  private loadUsername(): void {
    this.authService.getUserProfile().subscribe(profile => {
      if (profile?.username) this.username.set(profile.username);
    });
  }

  private loadNotifications(): void {
    this.notificationService.getAll().subscribe({
      next: list => this.notifications.set(list),
      error: () => this.notifications.set([])
    });
  }

  private connectWebSocket(): void {
    this.notificationService.connectWebSocket(notification => {
      this.notifications.update(list => [notification, ...list]);
      this.showToast('🔔 New notification received!');
    });
  }

}
