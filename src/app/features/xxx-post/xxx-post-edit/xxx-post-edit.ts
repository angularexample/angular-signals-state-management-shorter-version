import { ChangeDetectionStrategy, Component, DestroyRef, inject, Signal } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { XxxContentType } from '../../../core/xxx-content/xxx-content-types';
import { XxxContent } from '../../../core/xxx-content/xxx-content';
import { XxxContentFacade } from '../../../core/xxx-content/xxx-content-facade';
import { XxxPostType } from '../xxx-post-types';
import { XxxPostFacade } from '../xxx-post-facade';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    XxxContent,
  ],
  selector: 'xxx-post-edit',
  templateUrl: './xxx-post-edit.html',
})
export class XxxPostEdit {
  protected readonly contentKey: string = 'post-edit';
  protected postForm: FormGroup = new FormGroup({
    body: new FormControl('', Validators.required),
    id: new FormControl(0),
    title: new FormControl('', Validators.required),
    userId: new FormControl(0),
  });
  private contentFacade: XxxContentFacade = inject(XxxContentFacade);
  protected readonly content: Signal<XxxContentType | undefined> = this.contentFacade.contentByKey(this.contentKey);
  private destroyRef = inject(DestroyRef);
  private postFacade: XxxPostFacade = inject(XxxPostFacade);
  protected readonly isNoSelectedPost: Signal<boolean> = this.postFacade.isNoSelectedPost;
  protected readonly isSaveButtonDisabled: Signal<boolean> = this.postFacade.isSaveButtonDisabled;
  protected readonly selectedPost: Signal<XxxPostType | undefined> = this.postFacade.selectedPost;

  constructor() {
    this.loadFormData();
    this.subscribeToFormChanges();
  }

  protected onSubmit(): void {
    this.postFacade.updatePost();
  }

  private loadFormData(): void {
    const post: XxxPostType | undefined = this.selectedPost();
    if (post !== undefined) {
      // Unit test will fail if you use this.postForm.setValue(post);
      this.postForm.setValue({
        body: post.body || '',
        id: post.id || 0,
        title: post.title || '',
        userId: post.userId || 0,
      });
    }
  }

  private subscribeToFormChanges(): void {
    this.postForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(value => {
      const post: XxxPostType = <XxxPostType>value;
      this.postFacade.setPostForm(post);
    });
  }
}
