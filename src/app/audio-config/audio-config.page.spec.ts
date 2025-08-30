import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioConfigPage } from './audio-config.page';

describe('AudioConfigPage', () => {
  let component: AudioConfigPage;
  let fixture: ComponentFixture<AudioConfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
