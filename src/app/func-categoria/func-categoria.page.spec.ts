import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuncCategoriaPage } from './func-categoria.page';

describe('FuncCategoriaPage', () => {
  let component: FuncCategoriaPage;
  let fixture: ComponentFixture<FuncCategoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
