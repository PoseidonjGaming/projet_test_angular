import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToAddTableComponent } from './to-add-table.component';


describe('ToAddTableComponent', () => {
  let component: ToAddTableComponent;
  let fixture: ComponentFixture<ToAddTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToAddTableComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ToAddTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
