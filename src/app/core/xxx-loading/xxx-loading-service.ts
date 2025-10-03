import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XxxLoadingService {
  isLoading: WritableSignal<boolean> = signal(false);

  loadingOn(): void {
    this.isLoading.set(true);
  }

  loadingOff(): void {
    this.isLoading.set(false);
  }
}
