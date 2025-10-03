import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { XxxContentFacade } from '../../core/xxx-content/xxx-content-facade';
import { XxxContentType } from '../../core/xxx-content/xxx-content-types';
import { XxxContent } from '../../core/xxx-content/xxx-content';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, XxxContent],
  selector: 'xxx-header',
  styleUrl: './xxx-header.scss',
  templateUrl: './xxx-header.html',
})
export class XxxHeader {
  protected readonly contentKey: string = 'header';
  private contentFacade: XxxContentFacade = inject(XxxContentFacade);
  protected readonly content: Signal<XxxContentType | undefined> = this.contentFacade.contentByKey(this.contentKey);
}
