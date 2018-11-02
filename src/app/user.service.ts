import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { User } from './user';
import { mergeMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl = 'https://jsonplaceholder.typicode.com/users';
  postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(`${this.userUrl}`);
  }

  getUser(userId) {
    // console.log('getUser');
    return this.http.get<User>(`${this.userUrl}/${userId}`);
  }

  getUserWithPosts(userId) {
    return this.getUser(userId)
    .pipe(
      tap(d => {
        console.log('tappis', d);
      }),
      mergeMap(
      anvis => {
        console.log('INNE I MERGEMAP', anvis);
        return this.getPostsByUser(anvis.id);
      }
    ));
  }

  // getUserWithPosts(userId) {
  //   console.log('UserWithPost');
  //   return this.http.get<User>(`${this.userUrl}/${userId}`)
  //   .pipe(
  //     tap(d => console.log("tappis", d)),
  //     mergeMap(
  //     user => this.getPostsByUser(user.id)
  //   ));
  // }
  getPostsByUser(userId) {
    console.log('About to call getPostByUser', userId, `${this.postsUrl}?userId=${userId}`);
    return this.http.get<any[]>(`${this.postsUrl}?userId=${userId}`);
  }
}
