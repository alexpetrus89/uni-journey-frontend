import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudyPlanService } from '../../services/study-plan.service';
import { ThemeService } from '../../../../core/services/theme/theme.service';
import { StudyPlanDto } from '../../models/study-plan.model';
import { ApiError } from '../../../../core/models/error/api-error.model';

@Component({
  selector: 'app-study-plan-read',
  standalone: true,
  templateUrl: './study-plan-read.page.html',
  styleUrls: ['./study-plan-read.page.scss'],
  imports: [CommonModule, RouterModule]
})
export class StudyPlanReadPage implements OnInit {

  studyPlan = signal<StudyPlanDto | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  // CFU totali e completati (per ora solo totali — i completati arrivano dalle examination)
  totalCfu = computed(() =>
    this.studyPlan()?.courses.reduce((sum, c) => sum + c.cfu, 0) ?? 0
  );

  constructor(
    private readonly studyPlanService: StudyPlanService,
    private readonly themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get darkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  private load(): void {
    this.isLoading.set(true);
    this.studyPlanService.getStudyPlan().subscribe({
      next: plan => {
        this.studyPlan.set(plan);
        this.isLoading.set(false);
      },
      error: (err: ApiError) => {
        this.errorMessage.set(err?.message ?? 'Failed to load study plan.');
        this.isLoading.set(false);
      }
    });
  }

}
