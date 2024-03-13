/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MotoristaService } from './motorista.service';

describe('Service: Motorista', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MotoristaService]
    });
  });

  it('should ...', inject([MotoristaService], (service: MotoristaService) => {
    expect(service).toBeTruthy();
  }));
});
