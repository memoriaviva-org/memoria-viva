import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AniversarioPage } from './aniversario.page';

describe('AniversarioPage', () => {
  let component: AniversarioPage;
  let fixture: ComponentFixture<AniversarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AniversarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
