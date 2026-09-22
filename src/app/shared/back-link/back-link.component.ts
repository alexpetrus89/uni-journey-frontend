import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-back-link',
  standalone: true,
  templateUrl: './back-link.component.html',
  styleUrls: ['./back-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackLinkComponent {
  readonly routerLink = input.required<string | readonly string[]>();
  readonly label = input('Back to menu');
}
