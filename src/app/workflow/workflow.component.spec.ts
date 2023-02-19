import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkflowComponent } from './workflow.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppModule } from '../app.module';

describe('TimelineComponent', () => {
  let component: WorkflowComponent;
  let fixture: ComponentFixture<WorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowComponent],
      imports: [FontAwesomeModule, AppModule],
    })
      .compileComponents();

    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
