import { inject, Injectable, Signal } from '@angular/core';
import { XxxContentType } from './xxx-content-types';
import { XxxContentStore } from './xxx-content-store';

@Injectable({
  providedIn: 'root'
})
export class XxxContentFacade {
  // Store needs to be declared before it is used
  private contentStore: XxxContentStore = inject(XxxContentStore);
  readonly contentByKey = (key: string): Signal<XxxContentType | undefined> => this.contentStore.contentByKey(key);
  readonly isContentEmpty = (key: string): Signal<boolean> => this.contentStore.isContentEmpty(key);
  readonly isContentError = (key: string): Signal<boolean> => this.contentStore.isContentError(key);

  /**
   * Call this when you render a page that needs content.
   * @param key the key to the content for a given page
   */
  showContent(key: string): void {
    this.contentStore.showContent(key);
  }
}
