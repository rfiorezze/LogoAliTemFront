import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaVeiculoPorMotoristaComponent } from './busca-veiculo-por-motorista.component';

describe('MotoristaListaComponent', () => {
  let component: BuscaVeiculoPorMotoristaComponent;
  let fixture: ComponentFixture<BuscaVeiculoPorMotoristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaVeiculoPorMotoristaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuscaVeiculoPorMotoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
