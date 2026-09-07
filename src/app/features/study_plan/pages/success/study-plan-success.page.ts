import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme/theme.service';

@Component({
  selector: 'app-study-plan-success',
  standalone: true,
  templateUrl: './study-plan-success.page.html',
  styleUrls: ['./study-plan-success.page.scss'],
  imports: [CommonModule, RouterModule]
})
export class StudyPlanSuccessPage implements OnInit, OnDestroy {

  countdown = signal(3);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly router: Router,
    private readonly themeService: ThemeService
  ) {}

  get darkMode(): boolean { return this.themeService.isDarkMode(); }
  toggleTheme(): void { this.themeService.toggleTheme(); }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.countdown.update(n => n - 1);
      if (this.countdown() <= 0) this.goToStudyPlan();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  goToStudyPlan(): void {
    if (this.timer) clearInterval(this.timer);
    this.router.navigateByUrl('/study_plan/read');
  }

  goHome(): void {
    if (this.timer) clearInterval(this.timer);
    this.router.navigateByUrl('/user_student/student-home');
  }

}
