import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaVeiculoPorPlacaComponent } from './busca-veiculo-por-placa.component';

describe('MotoristaListaComponent', () => {
  let component: BuscaVeiculoPorPlacaComponent;
  let fixture: ComponentFixture<BuscaVeiculoPorPlacaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaVeiculoPorPlacaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuscaVeiculoPorPlacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
