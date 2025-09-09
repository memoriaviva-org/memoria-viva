import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriarFlashcardPage } from './criar-flashcard.page';

describe('CriarFlashcardPage', () => {
  let component: CriarFlashcardPage;
  let fixture: ComponentFixture<CriarFlashcardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarFlashcardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
