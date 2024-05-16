import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaMotoristaPorCpfComponent } from './busca-motorista-por-cpf.component';

describe('BuscaMotoristaPorCpfComponent', () => {
  let component: BuscaMotoristaPorCpfComponent;
  let fixture: ComponentFixture<BuscaMotoristaPorCpfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscaMotoristaPorCpfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuscaMotoristaPorCpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
