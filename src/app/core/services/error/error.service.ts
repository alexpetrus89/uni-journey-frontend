import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {

  readonly currentError = signal<string | null>(null);

  set(message: string): void {
    this.currentError.set(message);
  }

  clear(): void {
    this.currentError.set(null);
  }

}
