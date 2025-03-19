/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ReboqueService } from './reboque.service';

describe('Service: Reboque', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReboqueService]
    });
  });

  it('should ...', inject([ReboqueService], (service: ReboqueService) => {
    expect(service).toBeTruthy();
  }));
});
