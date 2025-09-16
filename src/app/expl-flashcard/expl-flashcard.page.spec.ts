import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplFlashcardPage } from './expl-flashcard.page';

describe('ExplFlashcardPage', () => {
  let component: ExplFlashcardPage;
  let fixture: ComponentFixture<ExplFlashcardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplFlashcardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
