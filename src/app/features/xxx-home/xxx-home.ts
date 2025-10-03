import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { XxxContent } from '../../core/xxx-content/xxx-content';
import { XxxContentStore } from '../../core/xxx-content/xxx-content-store';
import { XxxContentType } from '../../core/xxx-content/xxx-content-types';
import { XxxSanitizePipe } from '../../core/xxx-sanitize/xxx-sanitize-pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    XxxContent,
    XxxSanitizePipe,
  ],
  selector: 'xxx-home',
  templateUrl: './xxx-home.html',
})
export class XxxHome {
  protected readonly contentKey = 'home';
  private contentStore: XxxContentStore = inject(XxxContentStore);
  protected readonly content: Signal<XxxContentType | undefined> = this.contentStore.contentByKey(this.contentKey);
}
