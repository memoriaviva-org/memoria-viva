import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtualizarPerfilPage } from './atualizar-perfil.page';

describe('AtualizarPerfilPage', () => {
  let component: AtualizarPerfilPage;
  let fixture: ComponentFixture<AtualizarPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AtualizarPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
