import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GerenciarFlashcardsPage } from './gerenciar-flashcards.page';

describe('GerenciarFlashcardsPage', () => {
  let component: GerenciarFlashcardsPage;
  let fixture: ComponentFixture<GerenciarFlashcardsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciarFlashcardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
