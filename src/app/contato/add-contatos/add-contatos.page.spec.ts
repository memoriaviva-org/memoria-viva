import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddContatosPage } from './add-contatos.page';

describe('AddContatosPage', () => {
  let component: AddContatosPage;
  let fixture: ComponentFixture<AddContatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
