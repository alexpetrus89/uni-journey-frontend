import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { BackLinkComponent } from '../../../../shared/components/back-link/back-link.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { ExaminationAppeal } from '../../models/examination-appeal.model';
import { ExaminationAppealService } from '../../services/examination-appeal.service';

@Component({
  selector: 'app-appeals-booked',
  standalone: true,
  imports: [BackLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './appeals-booked.component.html',
  styleUrl: './appeals-booked.component.scss',
})
export class AppealsBookedComponent {
  private readonly appealService = inject(ExaminationAppealService);
  private readonly toastService = inject(ToastService);

  protected readonly appeals = signal<readonly ExaminationAppeal[]>([]);
  protected readonly loading = signal(true);
  protected readonly deletingId = signal<number | null>(null);

  constructor() {
    this.loadAppeals();
  }

  protected cancelBooking(appeal: ExaminationAppeal): void {
    if (this.deletingId() !== null) {
      return;
    }

    this.deletingId.set(appeal.id);
    this.appealService.cancelBooking(appeal.id).subscribe({
      next: () => {
        this.appeals.update((list) => list.filter((a) => a.id !== appeal.id));
        this.deletingId.set(null);
        this.toastService.success(`Reservation for "${appeal.course}" removed.`);
      },
      error: () => {
        this.deletingId.set(null);
        this.toastService.error('Could not remove the reservation.');
      },
    });
  }

  private loadAppeals(): void {
    this.appealService.getBookedAppeals().subscribe({
      next: (data) => {
        this.appeals.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Could not load your booked appeals.');
      },
    });
  }
}
