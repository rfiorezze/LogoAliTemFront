import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReboqueComponent } from './reboque.component';

describe('BuscaMotoristaPorCpfComponent', () => {
  let component: ReboqueComponent;
  let fixture: ComponentFixture<ReboqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReboqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReboqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
