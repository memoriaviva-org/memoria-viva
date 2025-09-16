import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplContatosPage } from './expl-contatos.page';

describe('ExplContatosPage', () => {
  let component: ExplContatosPage;
  let fixture: ComponentFixture<ExplContatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplContatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
