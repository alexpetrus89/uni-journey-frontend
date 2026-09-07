import { Component } from '@angular/core';
import { ThemeService } from '../../core/services/theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private readonly themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get darkMode(): boolean {
    return this.themeService.isDarkMode();
  }

}

