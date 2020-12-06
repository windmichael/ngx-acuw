import { TestBed } from '@angular/core/testing';

import { NgxAcuwService } from './ngx-acuw.service';

describe('NgxAcuwService', () => {
  let service: NgxAcuwService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxAcuwService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
