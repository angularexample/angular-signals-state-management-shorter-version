import { catchError, of } from 'rxjs';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { XxxAlert } from "../xxx-alert/xxx-alert";
import {
  XxxContentApi,
  xxxContentInitialState,
  XxxContentState,
  XxxContentStatus,
  XxxContentType
} from './xxx-content-types';
import { XxxContentData } from './xxx-content-data';

/**
 * XxxContentStore is the feature state for all content.
 * State management for Angular using only Signals and RxJS.
 * This version collapses all the separate methods found in the NgRx style model into a single method where possible.
 */
@Injectable({
  providedIn: 'root'
})
export class XxxContentStore {
  private alertService: XxxAlert = inject(XxxAlert);
  private contentService: XxxContentData = inject(XxxContentData);


  // State
  // Where we store all the properties needed to support the view
  private contentState: WritableSignal<XxxContentState> = signal<XxxContentState>(xxxContentInitialState);

  // Actions
  // Used to trigger changes in the state or run effects
  // This includes the logic to update the state, and the effects to run after the state is updated.
  // What used to be reducers are here.
  // What used to be effects are here.

  private getContent(key: string): void {
    // Remove any existing content, also replaces the old array for immutability
    const contents: XxxContentType[] = this.contents().filter(item => item.key !== key);
    // Create a new content object
    const content: XxxContentType = {
      contentModel: undefined,
      status: XxxContentStatus.LOADING,
      key
    };
    // Add the new content object
    contents.push(content);
    // Update the state
    this.contentState.update(state => ({
        ...state,
        contents
      })
    );
    let isError = false;
    this.contentService.getContent(key)
      .pipe(
        catchError(() => {
          isError = true;
          // Remove any existing content, also replaces the old array for immutability
          const contents: XxxContentType[] = this.contents().filter(item => item.key !== key);
          // Create a new content object
          const content: XxxContentType = {
            contentModel: undefined,
            status: XxxContentStatus.ERROR,
            key
          };
          // Add the new content object
          contents.push(content);
          // Update the state
          this.contentState.update(state => ({
              ...state,
              contents
            })
          );
          this.alertService.showError('Error loading content for ' + key);
          // return an empty response object
          return of({
            contentModel: {},
            key
          });
        })
      )
      .subscribe((contentApi: XxxContentApi) => {
        if (!isError) {
          // Create a new content object
          const newContent: XxxContentType = {
            contentModel: contentApi.contentModel,
            status: contentApi.contentModel && Object.keys(contentApi.contentModel).length ? XxxContentStatus.LOADED : XxxContentStatus.EMPTY,
            key: contentApi.key
          };
          // Remove any existing content, also replaces the old array for immutability
          const contents: XxxContentType[] = this.contents().filter(item => item.key !== newContent.key);
          // Add the new content object
          contents.push(newContent);
          // Update the state
          this.contentState.update(state => ({
              ...state,
              contents
            })
          );
        }
      });
  }

  showContent(key: string): void {
    // Check to see if content already exists
    // If content is not loaded, then load it
    if (!this.isContentLoaded(key)()) {
      this.getContent(key);
    }
  }


  // Selectors
  // Used to read current values from the state.
  // This version does not use the prefix 'select'

  private readonly contents: Signal<XxxContentType[]> = computed(() =>
    this.contentState().contents
  );

  contentByKey(key: string): Signal<XxxContentType | undefined> {
    return computed(() => {
      const contents: XxxContentType[] = this.contents();
      return contents.find(item => item.key === key);
    });
  }

  isContentEmpty(key: string): Signal<boolean> {
    return computed(() => {
      const content: XxxContentType | undefined = this.contentByKey(key)();
      if (content) {
        return content?.status !== XxxContentStatus.ERROR && content?.status === XxxContentStatus.EMPTY;
      }
      return false;
    })
  }

  isContentError(key: string): Signal<boolean> {
    return computed(() => {
      const content: XxxContentType | undefined = this.contentByKey(key)();
      if (content) {
        return content?.status === XxxContentStatus.ERROR;
      }
      return false;
    })
  }

  private isContentLoaded(key: string): Signal<boolean> {
    return computed(() => {
      const content: XxxContentType | undefined = this.contentByKey(key)();
      if (content) {
        return content?.status === XxxContentStatus.LOADED;
      }
      return false;
    })
  }
}
