import { TestBed } from '@angular/core/testing';

import { AudioPreferenceService } from './audio-preference.service';

describe('AudioPreferenceService', () => {
  let service: AudioPreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioPreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
