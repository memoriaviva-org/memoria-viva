import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeuDiaPage } from './meu-dia.page';

describe('MeuDiaPage', () => {
  let component: MeuDiaPage;
  let fixture: ComponentFixture<MeuDiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeuDiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
