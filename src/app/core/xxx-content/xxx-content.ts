import { ChangeDetectionStrategy, Component, inject, input, InputSignal, OnInit, signal, Signal } from '@angular/core';
import { XxxContentStore } from './xxx-content-store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'xxx-content',
  templateUrl: './xxx-content.html'
})
export class XxxContent implements OnInit {
  contentKey:InputSignal<string> = input<string>('');
  private contentStore: XxxContentStore = inject(XxxContentStore);
  protected isContentEmpty: Signal<boolean> = signal(false);
  protected isContentError: Signal<boolean> = signal(false);

  ngOnInit(): void {
    this.contentStore.showContent(this.contentKey());
    this.isContentEmpty = this.contentStore.isContentEmpty(this.contentKey());
    this.isContentError = this.contentStore.isContentError(this.contentKey());
  }
}
