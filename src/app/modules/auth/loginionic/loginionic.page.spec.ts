import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginionicPage } from './loginionic.page';

describe('LoginionicPage', () => {
  let component: LoginionicPage;
  let fixture: ComponentFixture<LoginionicPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginionicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
