import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  readonly id: number;
  readonly message: string;
  readonly type: ToastType;
}

const DEFAULT_DURATION_MS = 2800;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<readonly Toast[]>([]);

  show(message: string, type: ToastType = 'success', duration = DEFAULT_DURATION_MS): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((toast) => toast.id !== id));
  }
}
