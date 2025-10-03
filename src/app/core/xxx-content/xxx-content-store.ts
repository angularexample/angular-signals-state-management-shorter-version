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
 * If you already know NgRx, then we have organized it using the same categories.
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
  // To trigger state changes which then change the view.
  // Action methods run the reducer and effect
  // Action methods always run first the reducer and then the effect.

  private getContentAction(key: string): void {
    this.getContentReducer(key);
    this.getContentEffect(key);
  }

  private getContentErrorAction(key: string): void {
    this.getContentErrorReducer(key);
    this.getContentErrorEffect(key);
  }

  private getContentSuccessAction(response: XxxContentApi): void {
    this.getContentSuccessReducer(response);
  }

  showContentAction(key: string): void {
    this.showContentEffect(key);
  }


  // Selectors
  // Used to read current values from the state.
  // All selector names have the prefix 'select'

  private readonly selectContents: Signal<XxxContentType[]> = computed(() =>
    this.contentState().contents
  );

  selectContentByKey(key: string): Signal<XxxContentType | undefined> {
    return computed(() => {
      const contents: XxxContentType[] = this.selectContents();
      return contents.find(item => item.key === key);
    });
  }

  selectIsContentEmpty(key: string): Signal<boolean> {
    return computed(() => {
      const content: XxxContentType | undefined = this.selectContentByKey(key)();
      if (content) {
        return content?.status !== XxxContentStatus.ERROR && content?.status === XxxContentStatus.EMPTY;
      }
      return false;
    })
  }

  selectIsContentError(key: string): Signal<boolean> {
    return computed(() => {
      const content: XxxContentType | undefined = this.selectContentByKey(key)();
      if (content) {
        return content?.status === XxxContentStatus.ERROR;
      }
      return false;
    })
  }
  private selectIsContentLoaded(key: string): Signal<boolean> {
    return computed(() => {
      const content: XxxContentType | undefined = this.selectContentByKey(key)();
      if (content) {
        return content?.status === XxxContentStatus.LOADED;
      }
      return false;
    })
  }


  // Reducers
  // The only place where we change or update the state values
  // When an action fires, we run the reducer before the effect

  private getContentReducer(key: string): void {
    // Remove any existing content, also replaces the old array for immutability
    const contents: XxxContentType[] = this.selectContents().filter(item => item.key !== key);
    // Create a new content object
    const content: XxxContentType = {
      contentModel: undefined,
      status: XxxContentStatus.LOADING,
      key
    };
    // Add the new content object
    contents.push(content);
    // Finally, update the state
    this.contentState.update(state => ({
        ...state,
        contents
      })
    );
  }

  private getContentErrorReducer(key: string): void {
    // Remove any existing content, also replaces the old array for immutability
    const contents: XxxContentType[] = this.selectContents().filter(item => item.key !== key);
    // Create a new content object
    const content: XxxContentType = {
      contentModel: undefined,
      status: XxxContentStatus.ERROR,
      key
    };
    // Add the new content object
    contents.push(content);
    // Finally, update the state
    this.contentState.update(state => ({
        ...state,
        contents
      })
    );
  }

  private getContentSuccessReducer(contentApi: XxxContentApi): void {
    // Create a new content object
    const content: XxxContentType = {
      contentModel: contentApi.contentModel,
      status: contentApi.contentModel && Object.keys(contentApi.contentModel).length ? XxxContentStatus.LOADED : XxxContentStatus.EMPTY,
      key: contentApi.key
    };
    // Remove any existing content, also replaces the old array for immutability
    const contents: XxxContentType[] = this.selectContents().filter(item => item.key !== content.key);
    // Add the new content object
    contents.push(content);
    // Finally, update the state
    this.contentState.update(state => ({
        ...state,
        contents
      })
    );
  }


  // Effects
  // For data access, navigation, or to open a dialog
  // They are often used to run a service

  private getContentEffect(key: string): void {
    let isError = false;
    this.contentService.getContent(key)
      .pipe(
        catchError(() => {
          isError = true;
          this.getContentErrorAction(key);
          // return an empty response object
          return of({
            contentModel: {},
            key
          });
        })
      )
      .subscribe(response => {
        if (!isError) {
          this.getContentSuccessAction(response);
        }
      });
  }

  private showContentEffect(key: string): void {
    // Check to see if content already exists
    // If content is not loaded, then load it
    if (!this.selectIsContentLoaded(key)()) {
      this.getContentAction(key);
    }
  }

  private getContentErrorEffect(key: string) {
    this.alertService.showError('Error loading content for ' + key);
  }
}
