import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackLinkComponent } from '../../../../shared/back-link/back-link.component';


interface MenuCard {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly routerLink: string;
}

@Component({
  selector: 'app-examination-menu',
  standalone: true,
  imports: [RouterLink, BackLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './examination-menu.component.html',
  styleUrl: './examination-menu.component.scss',
})
export class ExaminationMenuComponent {
  protected readonly cards: readonly MenuCard[] = [
    {
      icon: '📖',
      title: 'Booklet',
      description: 'View your exam booklet.',
      routerLink: 'booklet',
    },
    {
      icon: '🗓️',
      title: 'Available appeals',
      description: 'Browse and book available appeals.',
      routerLink: 'appeals/available',
    },
    {
      icon: '📋',
      title: 'Booked appeals',
      description: 'View your booked appeals.',
      routerLink: 'appeals/booked',
    },
    {
      icon: '📈',
      title: 'Evaluation',
      description: 'Check your results.',
      routerLink: 'outcomes',
    },
  ];
}
