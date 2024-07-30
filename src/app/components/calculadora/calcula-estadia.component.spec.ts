import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculaEstadiaComponent } from './calcula-estadia.component';

describe('BuscaMotoristaPorCpfComponent', () => {
  let component: CalculaEstadiaComponent;
  let fixture: ComponentFixture<CalculaEstadiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculaEstadiaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalculaEstadiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
