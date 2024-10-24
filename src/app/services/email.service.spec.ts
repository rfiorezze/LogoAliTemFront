/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmailService } from './email.service';

describe('Service: Motorista', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailService]
    });
  });

  it('should ...', inject([EmailService], (service: EmailService) => {
    expect(service).toBeTruthy();
  }));
});
