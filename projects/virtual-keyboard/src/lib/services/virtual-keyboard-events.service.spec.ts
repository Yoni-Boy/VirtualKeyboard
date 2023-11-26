import { TestBed } from '@angular/core/testing';

import { VirtualKeyboardEventsService } from './virtual-keyboard-events.service';

describe('VirtualKeyboardEventsService', () => {
  let service: VirtualKeyboardEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualKeyboardEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
