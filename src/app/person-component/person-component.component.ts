import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnPageVisible} from 'angular-page-visibility';
import { Observable, interval, forkJoin } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';
import { User } from '../user';

@Component({
  selector: 'app-person-component',
  templateUrl: './person-component.component.html',
  styleUrls: ['./person-component.component.css']
})
export class PersonComponentComponent implements OnInit {

  personForm: FormGroup;
  person: User;
  constructor( private userService: UserService, private fb: FormBuilder) {
    console.log('This is the constructor');
   }

  get companyName() {
    return this.personForm.controls.company.get('name');
  }
  get userId() {
    return this.personForm.get('id');
  }

  @OnPageVisible()
  logOnVisible() {
    console.log('Page got focus', Date.now);
  }

  ngOnInit() {
    this.initialize();
    // this.personForm.valueChanges.subscribe(data => console.log('ValueChanges', data))
    this.personForm.get('id').valueChanges.subscribe(data => {
      console.log('Id', data);
    });

  }

  getUserWithPosts() {
    const userId = this.personForm.get('id').value;
    const getUser$ = this.userService.getUser(userId);
    const getPostsByUser$ = this.userService.getPostsByUser(userId);
    const getUserWithPosts$ = this.userService.getUserWithPosts(userId);

    getUserWithPosts$.subscribe(user => {
      console.log('MergeMap: ', user);
    });

    getUser$
    .pipe(
      tap(d => console.log('Tappis User', d)),
      map( user => getPostsByUser$.pipe(tap(p => console.log('Tappis Posts', p))) ))
    .subscribe((data => {console.log('Map: ', data); data.subscribe(aa => console.log('Map result subscrivbe', aa)); }));

    forkJoin(getUser$, getPostsByUser$).subscribe(resultat => { console.log('ForkJoin: ', resultat); });
  }

  startInterval() {
    interval(1000).subscribe(console.log);
  }

  initialize() {
    this.personForm = this.fb.group({
      id: ['0', [Validators.required, Validators.pattern('[0-9]+')]],
      name: '',
      email: '',
      company: this.fb.group({
        name: '',
        catchphrase: ''
      })
    });
    this.getUserAndSetPersonForm(2);

  }

  getUserAndSetPersonForm(userId) {
    this.userService.getUser(userId).subscribe(data => {
      this.person = data;
      this.personForm.setValue({
        id: data.id,
        name: data.name,
        email: data.email,
        company: {
          name: data.company.name,
          catchphrase: data.company.catchPhrase
        }
      });
    }
  );

  }

  reInitialize() {
    this.personForm = this.fb.group({
      id: this.person.id,
      name: this.person.name
    });
  }

  displayInfo() {
    const model = Object.assign({}, this.person, this.personForm.value);
    console.log('person (model): ', this.person);
    console.log('Personform.value', this.personForm.value);
    console.log('Model after assign: ', model);
  }
  reset() {
    this.personForm.reset();
  }

}
