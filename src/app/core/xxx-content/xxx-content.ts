import { ChangeDetectionStrategy, Component, inject, input, InputSignal, OnInit, signal, Signal } from '@angular/core';
import { XxxContentFacade } from './xxx-content-facade';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'xxx-content',
  templateUrl: './xxx-content.html'
})
export class XxxContent implements OnInit {
  contentKey:InputSignal<string> = input<string>('');
  private contentFacade: XxxContentFacade = inject(XxxContentFacade);
  protected isContentEmpty: Signal<boolean> = signal(false);
  protected isContentError: Signal<boolean> = signal(false);

  ngOnInit(): void {
    this.contentFacade.showContent(this.contentKey());
    this.isContentEmpty = this.contentFacade.isContentEmpty(this.contentKey());
    this.isContentError = this.contentFacade.isContentError(this.contentKey());
  }
}
