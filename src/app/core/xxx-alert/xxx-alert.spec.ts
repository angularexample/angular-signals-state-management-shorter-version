import { MatSnackBar } from '@angular/material/snack-bar';
import { TestBed } from '@angular/core/testing';
import { XxxAlert } from './xxx-alert';

describe('XxxAlert', () => {
  const expectedMessage: string = 'Expected message';
  const mockMatSnackBar = {
    open: jest.fn(),
  };
  let service: XxxAlert;

  TestBed.configureTestingModule({
    providers: [
      XxxAlert,
      { provide: MatSnackBar, useValue: mockMatSnackBar },
    ],
  });

  service = TestBed.inject(XxxAlert);

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should run showError', () => {
    service.showError(expectedMessage);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      expectedMessage, 'X', {panelClass: ['xxx-alert-error'], verticalPosition: 'top'});
  });

  it('should run showInfo', () => {
    service.showInfo(expectedMessage);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      expectedMessage, 'X', {duration: 5000, panelClass: ['xxx-alert-info'], verticalPosition: 'top'});
  });

  it('should run showWarning', () => {
    service.showWarning('Expected message');
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      'Expected message', 'X', {duration: 10000, panelClass: ['xxx-alert-warning'], verticalPosition: 'top'});
  });
});
