import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFileDialogComponent } from './display-file-dialog.component';

describe('DisplayFileDialogComponent', () => {
  let component: DisplayFileDialogComponent;
  let fixture: ComponentFixture<DisplayFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayFileDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
