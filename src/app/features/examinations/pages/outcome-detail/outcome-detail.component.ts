import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { BackLinkComponent } from '../../../../shared/components/back-link/back-link.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { CreateExaminationRequest } from '../../models/create-examination-request.model';
import { ExaminationOutcome, resolveOutcomeResult } from '../../models/examination-outcome.model';
import { ExaminationService } from '../../services/examination.service';
import { ExaminationOutcomeService } from '../../services/examination-outcome.service';

@Component({
  selector: 'app-outcome-detail',
  standalone: true,
  imports: [BackLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './outcome-detail.component.html',
  styleUrl: './outcome-detail.component.scss',
})
export class OutcomeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly outcomeService = inject(ExaminationOutcomeService);
  private readonly examinationService = inject(ExaminationService);
  private readonly toastService = inject(ToastService);

  protected readonly outcome = signal<ExaminationOutcome | null>(null);
  protected readonly loading = signal(true);
  protected readonly submitting = signal(false);
  protected readonly confirmingRefusal = signal(false);

  protected readonly result = computed(() => {
    const outcome = this.outcome();
    return outcome ? resolveOutcomeResult(outcome) : null;
  });

  constructor() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading.set(true);
          return this.outcomeService.getOutcomeById(Number(params.get('id')));
        }),
      )
      .subscribe({
        next: (outcome) => {
          this.outcome.set(outcome);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.toastService.error('Could not load this outcome.');
        },
      });
  }

  protected acceptGrade(): void {
    const outcome = this.outcome();
    if (!outcome || this.submitting()) {
      return;
    }

    const request: CreateExaminationRequest = {
      register: outcome.register,
      courseName: outcome.appeal.course,
      degreeCourseName: outcome.appeal.degreeCourse,
      courseCfu: outcome.appeal.courseCfu,
      grade: outcome.grade,
      withHonors: outcome.withHonors,
      date: outcome.appeal.date,
    };

    this.submitting.set(true);
    this.examinationService.acceptGrade(request).subscribe({
      next: () => {
        this.toastService.success(`Grade for "${outcome.appeal.course}" registered.`);
        this.router.navigate(['/user_student/examinations/booklet']);
      },
      error: () => {
        this.submitting.set(false);
        this.toastService.error('Could not register the grade.');
      },
    });
  }

  protected requestRefusal(): void {
    this.confirmingRefusal.set(true);
  }

  protected cancelRefusal(): void {
    this.confirmingRefusal.set(false);
  }

  protected confirmRefusal(): void {
    this.deleteOutcome('Grade refused.');
  }

  protected confirmResult(): void {
    this.deleteOutcome('Outcome confirmed.');
  }

  private deleteOutcome(successMessage: string): void {
    const outcome = this.outcome();
    if (!outcome || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.outcomeService.deleteOutcome(outcome.id).subscribe({
      next: () => {
        this.toastService.success(successMessage);
        this.router.navigate(['/user_student/examinations/outcomes']);
      },
      error: () => {
        this.submitting.set(false);
        this.toastService.error('Something went wrong, please try again.');
      },
    });
  }
}
