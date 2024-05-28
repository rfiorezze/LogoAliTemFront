import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscaMotoristaPorLocalidadeComponent } from './busca-motorista-por-localidade.component';

describe('BuscaMotoristaPorLocalidadeComponent', () => {
  let component: BuscaMotoristaPorLocalidadeComponent;
  let fixture: ComponentFixture<BuscaMotoristaPorLocalidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaMotoristaPorLocalidadeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuscaMotoristaPorLocalidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
