import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelmovtoComponent } from './relmovto.component';

describe('RelmovtoComponent', () => {
  let component: RelmovtoComponent;
  let fixture: ComponentFixture<RelmovtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelmovtoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelmovtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
