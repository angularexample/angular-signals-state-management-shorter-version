import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { XxxContent } from '../../core/xxx-content/xxx-content';
import { XxxContentStore } from '../../core/xxx-content/xxx-content-store';
import { XxxContentType } from '../../core/xxx-content/xxx-content-types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, XxxContent],
  selector: 'xxx-header',
  styleUrl: './xxx-header.scss',
  templateUrl: './xxx-header.html',
})
export class XxxHeader {
  protected readonly contentKey: string = 'header';
  private contentStore: XxxContentStore = inject(XxxContentStore);
  protected readonly content: Signal<XxxContentType | undefined> = this.contentStore.contentByKey(this.contentKey);
}
