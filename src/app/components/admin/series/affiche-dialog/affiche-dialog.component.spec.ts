import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheDialogComponent } from './affiche-dialog.component';

describe('AfficheDialogComponent', () => {
  let component: AfficheDialogComponent;
  let fixture: ComponentFixture<AfficheDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfficheDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficheDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
