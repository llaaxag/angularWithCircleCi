import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';
import { User, Company, SuperUser } from '../user';
import {pipe, of, from, interval} from 'rxjs';
import {ajax, AjaxResponse} from 'rxjs/ajax';
import {map, tap, mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-reactis',
  templateUrl: './reactis.component.html',
  styleUrls: ['./reactis.component.css']
})
export class ReactisComponent implements OnInit {

  reactisForm: FormGroup;
  faklasser: string;
  faklassArray: string[];
  batteri$;
  batteriSubscription;
  progress = 0;
  constructor(private fb: FormBuilder, private userService: UserService, private zone: NgZone) {
    this.faklassArray = [
      'fas fa-battery-empty',
      'fas fa-battery-quarter',
      'fas fa-battery-half',
      'fas fa-battery-three-quarters',
      'fas fa-battery-full'];
   }

  ngOnInit() {
    this.faklasser = 'fas fa-battery-empty';
    this.batteri$ = interval(1000).
      pipe(tap(x => this.faklasser = this.faklassArray[x % 5]));

    const myUser = new User();
    // console.log('created a user', myUser);
    const superUser = new SuperUser();
    // console.log('created a super user', superUser);

    this.reactisForm = this.fb.group(myUser);
    this.reactisForm.addControl('company', this.fb.group(new Company()));
    // console.log('created FormGroup', this.reactisForm);

    this.userService.getUser(1).subscribe( user => {
      // console.log('received a user', user);
      // this.reactisForm = this.fb.group(user);
      this.reactisForm.patchValue(user);
    },
    console.error,
    () => console.log('COMPLETED'));
  }

  getUsersAndLog() {
    this.userService.getUsers()
    .pipe(
      // mergeMap(anvs => of(anvs.length))
      mergeMap(anvs => from(anvs)),
      map(anv => anv.name)
      // map(anvs => anvs.length)
    )
    .subscribe(data => console.log('USERS:', data));
  }

  onSubmit() {
    console.log('Submitting form', this.reactisForm.value);
  }

  startaBatteri() {
    this.batteriSubscription = this.batteri$.subscribe();
  }
  stoppaBatteri() {
    this.batteriSubscription.unsubscribe();
    this.faklasser = 'fas fa-battery-empty';
  }

  ajaxmergemap() {
    ajax('https://jsonplaceholder.typicode.com/users')
    .pipe(
      mergeMap((ajaxResponse: AjaxResponse) => ajaxResponse.response)
    )
    .subscribe(value => console.log('VALUE using mergeMap', value));
  }
  ajaxmap() {
    ajax('https://jsonplaceholder.typicode.com/users')
    .pipe(
      map(ajaxResponse => ajaxResponse.response)
    )
    .subscribe(value => console.log('VALUE using map', value));
  }

  progressWithAngularZone() {
    this.progress = 0;
    this.increaseProgress(() => console.log('DONE INCREASE PROGRESS'));
  }
  progressOutsideAngularZone() {
    this.progress = 0;
    console.log('OUTSIDE ZONE CODE STARTED');
    this.zone.runOutsideAngular(() => {
      console.log('OUTSIDE ZONE', NgZone.isInAngularZone());
      this.zone.run(() => { console.log('INSIDE ZONE'); });
      // this.increaseProgress(() => {
      //   this.zone.run(() => {
      //     console.log('OUTSIDE ZONE CODE DONE');
      //   });
      // });
    });
  }
  increaseProgress(doneCallback) {
    this.progress++;
    console.log(`Current progress: ${this.progress}%`);
    if (this.progress < 100) {
      setTimeout(() => {
        this.increaseProgress(doneCallback);
      }, 15);
    } else {
      doneCallback();
    }
  }
}
