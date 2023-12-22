import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCRUDComponent } from './TableCRUDComponent';

describe('TableCRUDComponent', () => {
  let component: TableCRUDComponent;
  let fixture: ComponentFixture<TableCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCRUDComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
