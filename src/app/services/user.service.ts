import { Injectable } from '@angular/core';
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from 'unique-names-generator';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  getCurrentUserId() {
    let userId = window.localStorage.getItem('userId');
    if (!userId) {
      userId = this.generateUserId();
      window.localStorage.setItem('userId', userId);
    }
    return userId;
  }

  generateUserId() {
    const userId = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
      length: 2,
    });
    return userId;
  }
}
