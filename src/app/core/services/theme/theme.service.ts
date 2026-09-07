import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly STORAGE_KEY = 'theme';
  private darkMode = false;

  constructor() {
    this.initTheme();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    this.applyTheme();
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  /* ================= PRIVATE ================= */

  private initTheme(): void {
    this.darkMode = localStorage.getItem(this.STORAGE_KEY) === 'dark';
    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.classList.toggle('dark', this.darkMode);
    localStorage.setItem(
      this.STORAGE_KEY,
      this.darkMode ? 'dark' : 'light'
    );
  }
}

