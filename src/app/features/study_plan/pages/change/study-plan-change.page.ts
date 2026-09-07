import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StudyPlanService } from '../../services/study-plan.service';
import { ThemeService } from '../../../../core/services/theme/theme.service';
import { CourseDto, StudyPlanDto } from '../../models/study-plan.model';
import { DegreeCourse } from '../../../degree_course/models/degree-course.model';
import { ApiError } from '../../../../core/models/error/api-error.model';
import { CatalogService } from '../../../catalog/services/catalog.service';

@Component({
  selector: 'app-study-plan-change',
  standalone: true,
  templateUrl: './study-plan-change.page.html',
  styleUrls: ['./study-plan-change.page.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class StudyPlanChangePage implements OnInit {

  // ── State ──────────────────────────────────────────
  studyPlan = signal<StudyPlanDto | null>(null);
  degreeCourses = signal<DegreeCourse[]>([]);
  availableCourses = signal<CourseDto[]>([]);

  isLoading = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // ── Form fields ────────────────────────────────────
  selectedDegreeCourse = '';
  selectedCourseToAdd = '';
  selectedCourseToRemove = '';

  constructor(
    private readonly studyPlanService: StudyPlanService,
    private readonly catalogService: CatalogService,
    private readonly themeService: ThemeService,
    private readonly router: Router
  ) {}


  /* ================= LIFECYCLE =============== */
  ngOnInit(): void {
    this.loadInitialData();
  }


  /* ================= THEME =============== */
  get darkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }


  /* ================= EVENTS =============== */
  onDegreeCourseChange(): void {
    if (!this.selectedDegreeCourse) {
      this.availableCourses.set([]);
      this.selectedCourseToAdd = '';
      return;
    }

    this.studyPlanService.getAvailableCourses(this.selectedDegreeCourse).subscribe({
      next: courses => {
        this.availableCourses.set(courses);
        this.selectedCourseToAdd = '';
      },
      error: () => this.availableCourses.set([])
    });
  }

  onSubmit(): void {
    if (!this.selectedCourseToAdd || !this.selectedCourseToRemove || !this.selectedDegreeCourse) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isSubmitting.set(true);

    this.studyPlanService.swapCourse({
      courseToAdd: this.selectedCourseToAdd,
      degreeCourseOfNewCourse: this.selectedDegreeCourse,
      courseToRemove: this.selectedCourseToRemove,
      degreeCourseOfOldCourse: this.degreeCourseOfSelectedCourse
    }).subscribe({
      next: updatedPlan => {
        this.studyPlan.set(updatedPlan);
        this.isSubmitting.set(false);
        this.successMessage.set('Study plan updated successfully!');
        // Dopo 2 secondi torna alla lettura
        setTimeout(() => this.router.navigateByUrl('/study_plan/success'), 2000);
      },
      error: (err: ApiError) => {
        this.isSubmitting.set(false);
        switch (err?.status) {
          case 400:
            this.errorMessage.set(err.message ?? 'Invalid swap request.');
            break;
          case 409:
            this.errorMessage.set('Course already present in your study plan.');
            break;
          default:
            this.errorMessage.set('Something went wrong. Please try again.');
        }
      }
    });
  }

  onReset(): void {
    this.selectedDegreeCourse = '';
    this.selectedCourseToAdd = '';
    this.selectedCourseToRemove = '';
    this.availableCourses.set([]);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }


  /* ================= PRIVATE =============== */
  private loadInitialData(): void {
    this.isLoading.set(true);

    // Carica piano e corsi di laurea in parallelo
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

    this.catalogService.getCatalog().subscribe({
      next: courses => this.degreeCourses.set(courses),
      error: () => this.degreeCourses.set([])
    });
  }


  get degreeCourseOfSelectedCourse(): string {
    if (!this.selectedCourseToRemove || !this.studyPlan()) return '';
    const course = this.studyPlan()!.courses.find(c => c.name === this.selectedCourseToRemove);
    return course?.degreeCourse ?? '';
  }

}
