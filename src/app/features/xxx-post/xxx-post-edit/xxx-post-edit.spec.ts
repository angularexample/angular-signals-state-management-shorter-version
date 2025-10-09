import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { mockContentHome } from '../../../core/xxx-content/xxx-content.mocks';
import { mockPost, mockPost3 } from '../xxx-post.mocks';
import { XxxContent } from '../../../core/xxx-content/xxx-content';
import { XxxContentStore } from '../../../core/xxx-content/xxx-content-store';
import { XxxPostEdit } from './xxx-post-edit';
import { XxxPostStore } from '../xxx-post-store';

// Use extended class to test protected method.
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    XxxContent,
  ],
  selector: 'extended-xxx-post-edit',
  templateUrl: './xxx-post-edit.html',
})
class ExtendedXxxPostEdit extends XxxPostEdit {
  exposedPostForm: FormGroup = this.postForm;

  override onSubmit() {
    super.onSubmit();
  }
}

describe('XxxPostEdit', () => {
  let component: ExtendedXxxPostEdit;
  let fixture: ComponentFixture<ExtendedXxxPostEdit>;

  const mockXxxContentStore = {
    contentByKey: jest.fn().mockReturnValue(signal(mockContentHome)),
    isContentEmpty: jest.fn().mockReturnValue(signal(false)),
    isContentError: jest.fn().mockReturnValue(signal(false)),
    showContent: jest.fn(),
  }

  const mockXxxPostStore = {
    isNoSelectedPost: jest.fn().mockReturnValue(signal(false)),
    isSaveButtonDisabled: jest.fn().mockReturnValue(signal(false)),
    selectedPost: jest.fn().mockReturnValue(signal(mockPost)),
    setPostForm: jest.fn(),
    updatePost: jest.fn(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtendedXxxPostEdit, ReactiveFormsModule, XxxContent],
      providers: [
        {provide: XxxContentStore, useValue: mockXxxContentStore},
        {provide: XxxPostStore, useValue: mockXxxPostStore}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ExtendedXxxPostEdit);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  })

  describe('construction', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });
  });

  describe('onSubmit', () => {
    it('should call postFacade.updatePost', () => {
      component.onSubmit();
      expect(mockXxxPostStore.updatePost).toHaveBeenCalled();
    });
  });

  describe('subscribeToFormChanges', () => {
    it('should call postFacade.setPostForm when a form value changed', () => {
      // In a zoneless app, fakeAsync is not available, use the jest timers instead
      jest.useFakeTimers();
      component.exposedPostForm.setValue(mockPost3);
      // Timer advance time must be equal or greater than debounce time in the valueChanges()
      jest.advanceTimersByTime(300)
      expect(mockXxxPostStore.setPostForm).toHaveBeenCalledWith(mockPost3);
    });
  });
});
