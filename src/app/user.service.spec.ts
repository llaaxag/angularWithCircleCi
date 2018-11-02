import { TestBed, inject, tick, async, fakeAsync, flush } from '@angular/core/testing';
import { Observable, forkJoin, from, of } from 'rxjs';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { mergeMap, catchError } from 'rxjs/operators';
import { resolve } from 'url';

describe('UserService', () => {
  let svc: UserService;
  let mockHttp: HttpTestingController;
  let person;
  let posts;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
      imports: [HttpClientTestingModule]
    });
    svc = TestBed.get(UserService);
    mockHttp = TestBed.get(HttpTestingController);
    const personStr = `{
      "id": 1,
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
        "geo": {
          "lat": "-37.3159",
          "lng": "81.1496"
        }
      },
      "phone": "1-770-736-8031 x56442",
      "website": "hildegard.org",
      "company": {
        "name": "Romaguera-Crona",
        "catchPhrase": "Multi-layered client-server neural-net",
        "bs": "harness real-time e-markets"
      }
    }`;
    const postsStr = `[
      {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit nostrum rerum est autem sunt rem eveniet architecto"
      },
      {
        "userId": 1,
        "id": 2,
        "title": "qui est esse",
        "body": "est rerum tempore vitae"
      }]`;
    person = JSON.parse(personStr);
    posts = JSON.parse(postsStr);
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
  it('should make http call to person', () => {
    svc.getUser(1).subscribe(user => {
      expect(user.id).toBe(1);
      expect(person.name).toBe('Leanne Graham');
    });
    const req = mockHttp.expectOne('https://jsonplaceholder.typicode.com/users/1');
    req.flush(person);
  });
  it('should make http call to posts', () => {
    svc.getPostsByUser(1).subscribe(psts => {
      expect(psts.length).toBe(2);
      expect(psts[0].userId).toBe(1);
    });
    const reqPosts = mockHttp.expectOne('https://jsonplaceholder.typicode.com/posts?userId=1');
    reqPosts.flush(posts);
  });
  it('should make two http call using formJoin', () => {
    forkJoin(svc.getUser(1), svc.getPostsByUser(1)).subscribe(resultat => {
      console.log('resultat forkJoin', resultat);
      expect(resultat[0].id).toBe(1);
      expect(resultat[0].name).toBe('Leanne Graham');
    });
    const reqUser = mockHttp.expectOne('https://jsonplaceholder.typicode.com/users/1');
    const reqPosts = mockHttp.expectOne('https://jsonplaceholder.typicode.com/posts?userId=1');
    reqUser.flush(person);
    reqPosts.flush(posts);
  });
  it('should make two http call using forkJoin and match', async(() => {
    forkJoin(svc.getUser(1), svc.getPostsByUser(1)).subscribe(resultat => {
      console.log('resultat forkJoin', resultat);
      expect(resultat[0].id).toBe(1);
      expect(resultat[0].name).toBe('Leanne Graham');
    });
    const req = mockHttp.match(r => {
      // 'https://jsonplaceholder.typicode.com/users/1'
      console.log('USER SERVICE DOUBLE HTTP - ForkJoin', r.url);
      return true;
    });
    console.log('ANTAL REQS With forJoin', req.length);
    req[0].flush(posts);
  }));
  it('should make two http call using mergeMap and match', () => {
    // Jag får inte mergemap-testerna att funka riktigt.
    svc.getUser(1).pipe(mergeMap(usuario => {
      console.log('getUser in MergeMap', usuario);
      return svc.getPostsByUser(1);
    }))
      .subscribe(resultat => {
        console.log('resultat mergeMap', resultat);
        expect(resultat[0].id).toBe(1);
        expect(resultat[0].name).toBe('Leanne Graham');
      });
    const req = mockHttp.match(r => {
      // 'https://jsonplaceholder.typicode.com/users/1'
      console.log('Inside match - MergeMap', r.url);
      return true;
    });
    console.log('ANTAL REQS with MergeMap', req.length);
    req[0].flush(person);
  });
  it('should return person with posts', () => {
    svc.getUserWithPosts(1).subscribe(resultat => {
      console.log('resultat mergeMap', resultat);
      // expect(resultat[0].id).toBe(1);
      // expect(resultat[0].name).toBe("Leanne Graham");
    },
    () => console.log('ERROR calling GETUSERWITHPOSTS')
  );
    const reqUser = mockHttp.match(r => {
      // 'https://jsonplaceholder.typicode.com/users/1'
      console.log('USER SERVICE DOUBLE HTTP', r.url);
      return true;
    });
    // const reqPosts = mockHttp.expectOne('https://jsonplaceholder.typicode.com/posts?userId=1');
    console.log('ANTAL REQS', reqUser.length);
    // reqUser.flush(person);
    // reqPosts.flush(posts);
    mockHttp.verify();
  });
  it('catchError spec', async(() => {
    const lofte = new Promise((res, rej) => rej('palla'));
    const obsis = from(lofte);
    // obsis.subscribe(res => console.log('funkar'), err => console.log('nåt gick snett'));
    obsis.pipe(catchError(error => {
      console.log('catchError säger', error);
      return of('catchError upptäckte ett fel');
    }));
    // obsis.pipe(catchError(error => of('catchError upptäckte ett fel')));
    // obsis.subscribe(res => console.log('Subscribar på obsis'), fel => console.log('FEL', fel));
    obsis.subscribe(
      res => console.log('Subscribar på obsis'),
      fel => console.log('ytterligare en felhantering. Men jag kan inte se catchError-meddelandena'));
  }));

  it('fakeAsync with tick', fakeAsync(() => {
    setTimeout(() => {
      console.log('Nu har det gått 2 sekunder');
    }, 2000);
    tick(2000);
  }));
  it('fakeAsync with flush', fakeAsync(() => {
    setTimeout(() => {
      console.log('Nu har det gått 2 sekunder');
    }, 2000);
    flush();
  }));

});
