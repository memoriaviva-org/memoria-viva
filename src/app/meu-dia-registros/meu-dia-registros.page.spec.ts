import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeuDiaRegistrosPage } from './meu-dia-registros.page';

describe('MeuDiaRegistrosPage', () => {
  let component: MeuDiaRegistrosPage;
  let fixture: ComponentFixture<MeuDiaRegistrosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeuDiaRegistrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
