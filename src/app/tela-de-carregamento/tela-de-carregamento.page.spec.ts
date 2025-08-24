import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelaDeCarregamentoPage } from './tela-de-carregamento.page';

describe('TelaDeCarregamentoPage', () => {
  let component: TelaDeCarregamentoPage;
  let fixture: ComponentFixture<TelaDeCarregamentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TelaDeCarregamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});