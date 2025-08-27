import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoIntrodutorioPage } from './video-introdutorio.page';

describe('VideoIntrodutorioPage', () => {
  let component: VideoIntrodutorioPage;
  let fixture: ComponentFixture<VideoIntrodutorioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoIntrodutorioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
