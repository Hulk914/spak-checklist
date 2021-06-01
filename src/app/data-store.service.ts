import { listItem } from './listItem';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataStoreService {
  // real scenario this would come for logged in user from api
  userLists: { [key: string]: listItem[] } = {
    defaultUser: [
      { isCompleted: true, content: 'JIRA-1234' },
      { isCompleted: true, content: 'JIRA-124' },
      { isCompleted: true, content: 'JIRA-1344' },
      { isCompleted: true, content: 'JIRA-546' },
      { isCompleted: true, content: 'JIRA-768' },
      { isCompleted: false, content: 'JIRA-9090' },
    ],
  };

  constructor() {}

  getListForCurrentUser() {
    return this.userLists.defaultUser;
  }
}
