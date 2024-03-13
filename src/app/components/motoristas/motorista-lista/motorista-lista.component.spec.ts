import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaListaComponent } from './motorista-lista.component';

describe('MotoristaListaComponent', () => {
  let component: MotoristaListaComponent;
  let fixture: ComponentFixture<MotoristaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoristaListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MotoristaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
