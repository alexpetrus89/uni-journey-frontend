import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BackLinkComponent } from '../../../../shared/components/back-link/back-link.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { ExaminationOutcome } from '../../models/examination-outcome.model';
import { ExaminationOutcomeService } from '../../services/examination-outcome.service';

@Component({
  selector: 'app-outcomes-list',
  standalone: true,
  imports: [RouterLink, BackLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './outcomes-list.component.html',
  styleUrl: './outcomes-list.component.scss',
})
export class OutcomesListComponent {
  private readonly outcomeService = inject(ExaminationOutcomeService);
  private readonly toastService = inject(ToastService);

  protected readonly outcomes = signal<readonly ExaminationOutcome[]>([]);
  protected readonly loading = signal(true);
  protected readonly filterText = signal('');

  protected readonly filteredOutcomes = computed(() => {
    const query = this.filterText().trim().toLowerCase();
    if (!query) {
      return this.outcomes();
    }
    return this.outcomes().filter((outcome) =>
      `${outcome.appeal.degreeCourse} ${outcome.appeal.course} ${outcome.appeal.date}`
        .toLowerCase()
        .includes(query),
    );
  });

  constructor() {
    this.outcomeService.getStudentOutcomes().subscribe({
      next: (data) => {
        this.outcomes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Could not load your evaluations.');
      },
    });
  }
}
