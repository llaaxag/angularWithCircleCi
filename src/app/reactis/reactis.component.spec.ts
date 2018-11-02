import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactisComponent } from './reactis.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { of } from 'rxjs';

describe('ReactisComponent', () => {
  let component: ReactisComponent;
  let fixture: ComponentFixture<ReactisComponent>;
  let userService;

  beforeEach(async(() => {
    userService = jasmine.createSpyObj(['getUser']);
    userService.getUser.and.returnValue(of({id: 1, name: 'a', email: 'a@acom'}));
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ ReactisComponent ],
      providers: [
        {provide: UserService, useValue: userService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create!!!', () => {
    expect(component).toBeTruthy();
  });
});
