import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';


import { ExaminationAppeal } from '../../models/examination-appeal.model';
import { ExaminationAppealService } from '../../services/examination-appeal.service';
import { BackLinkComponent } from '../../../../shared/back-link/back-link.component';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-appeals-available',
  standalone: true,
  imports: [BackLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './appeals-available.component.html',
  styleUrl: './appeals-available.component.scss',
})
export class AppealsAvailableComponent {
  private readonly appealService = inject(ExaminationAppealService);
  private readonly toastService = inject(ToastService);

  protected readonly appeals = signal<readonly ExaminationAppeal[]>([]);
  protected readonly loading = signal(true);
  protected readonly bookingId = signal<number | null>(null);

  constructor() {
    this.loadAppeals();
  }

  protected book(appeal: ExaminationAppeal): void {
    if (this.bookingId() !== null) {
      return;
    }

    this.bookingId.set(appeal.id);
    this.appealService.bookAppeal(appeal.id).subscribe({
      next: () => {
        this.appeals.update((list) => list.filter((a) => a.id !== appeal.id));
        this.bookingId.set(null);
        this.toastService.success(`Booked "${appeal.course}" appeal.`);
      },
      error: () => {
        this.bookingId.set(null);
        this.toastService.error('Could not book this appeal.');
      },
    });
  }

  private loadAppeals(): void {
    this.appealService.getAvailableAppeals().subscribe({
      next: (data) => {
        this.appeals.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Could not load available appeals.');
      },
    });
  }
}
