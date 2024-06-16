import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDialogueComponent } from './booking-dialogue.component';

describe('BookingDialogueComponent', () => {
  let component: BookingDialogueComponent;
  let fixture: ComponentFixture<BookingDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDialogueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
