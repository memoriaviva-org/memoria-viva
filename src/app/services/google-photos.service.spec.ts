import { TestBed } from '@angular/core/testing';

import { GooglePhotosService } from './google-photos.service';

describe('GooglePhotosService', () => {
  let service: GooglePhotosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GooglePhotosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
