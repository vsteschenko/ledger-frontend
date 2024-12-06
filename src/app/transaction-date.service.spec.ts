import { TestBed } from '@angular/core/testing';

import { TransactionDateService } from './transaction-date.service';

describe('TransactionDateService', () => {
  let service: TransactionDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
