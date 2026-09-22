import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { BackLinkComponent } from '../../../../shared/components/back-link/back-link.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { computeBookletSummary, Examination } from '../../models/examination.model';
import { ExaminationService } from '../../services/examination.service';

@Component({
  selector: 'app-booklet',
  standalone: true,
  imports: [BackLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booklet.component.html',
  styleUrl: './booklet.component.scss',
})
export class BookletComponent {
  private readonly examinationService = inject(ExaminationService);
  private readonly toastService = inject(ToastService);

  protected readonly examinations = signal<readonly Examination[]>([]);
  protected readonly loading = signal(true);

  protected readonly summary = computed(() => computeBookletSummary(this.examinations()));

  constructor() {
    this.examinationService.getBooklet().subscribe({
      next: (data) => {
        this.examinations.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Could not load your booklet.');
      },
    });
  }
}
