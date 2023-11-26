import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardV3Component } from './keyboard-v3.component';

describe('KeyboardV3Component', () => {
  let component: KeyboardV3Component;
  let fixture: ComponentFixture<KeyboardV3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeyboardV3Component]
    });
    fixture = TestBed.createComponent(KeyboardV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
