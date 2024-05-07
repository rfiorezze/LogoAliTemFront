import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarVeiculoMotoristaComponent } from './cadastrar-veiculo-por-motorista.component';

describe('MotoristaListaComponent', () => {
  let component: CadastrarVeiculoMotoristaComponent;
  let fixture: ComponentFixture<CadastrarVeiculoMotoristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarVeiculoMotoristaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastrarVeiculoMotoristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
