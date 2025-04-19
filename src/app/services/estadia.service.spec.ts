/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EstadiaService } from './estadia.service';

describe('Service: Estadia', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstadiaService]
    });
  });

  it('should ...', inject([EstadiaService], (service: EstadiaService) => {
    expect(service).toBeTruthy();
  }));
});
