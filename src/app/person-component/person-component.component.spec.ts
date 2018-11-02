import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService} from '../user.service';
import { PersonComponentComponent } from './person-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import {of} from 'rxjs';

describe('PersonComponentComponent', () => {
  let component: PersonComponentComponent;
  let fixture: ComponentFixture<PersonComponentComponent>;

  beforeEach(async(() => {
    const userService = jasmine.createSpyObj(['getUser']);
    userService.getUser.and.returnValue(of({id: 1, name: 'a', email: 'a@a.se', company: {name: 'abc', catchPhrase: 'nope'}}));
    TestBed.configureTestingModule({
      declarations: [ PersonComponentComponent ],
      imports: [ReactiveFormsModule],
      providers: [{provide: UserService, useValue: userService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
