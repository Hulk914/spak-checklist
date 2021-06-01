import { listItem } from './listItem';
import { DataStoreService } from './data-store.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  checkList: listItem[];
  checkListGroup: FormGroup;
  selectedTask: number;
  constructor(private _dStore: DataStoreService, private fb: FormBuilder) {}

  ngOnInit() {
    this.checkList = this._dStore.getListForCurrentUser();
    this.checkList.sort((a, b) => (a && !b ? 1 : -1));
    this.checkListGroup = this.fb.group({
      inputCtrl: this.fb.control(''),
      lists: this.fb.array(this.checkList.map((list) => this.createList(list))),
    });
  }

  get listFormArray() {
    return this.checkListGroup.get('lists') as FormArray;
  }

  createList(list) {
    return this.fb.group({
      isCompleted: list.isCompleted,
      content: list.content,
    });
  }

  modifyTask() {
    const inputValue = this.checkListGroup.get('inputCtrl').value;
    if (this.selectedTask !== null && this.selectedTask !== undefined) {
      const taskCtrl: FormGroup = this.listFormArray.get(
        this.selectedTask.toString()
      ) as FormGroup;

      taskCtrl.get('content').setValue(inputValue);

      this.selectedTask = null;
    } else {
      this.listFormArray.insert(
        0,
        this.fb.group({
          isCompleted: false,
          content: inputValue,
        })
      );
    }
    this.checkListGroup.get('inputCtrl').setValue('');
  }

  cancelUpdate() {
    this.selectedTask = null;
    this.checkListGroup.get('inputCtrl').setValue('');
  }

  selectTask(index) {
    const content = this.listFormArray.get(index.toString()).value.content;
    this.checkListGroup.get('inputCtrl').setValue(content);
    this.selectedTask = index;
  }

  deleteTask(index) {
    this.listFormArray.removeAt(index);
  }

  completeTask(index) {
    const listVal = this.listFormArray.get(index.toString()).value;
    this.listFormArray.removeAt(index);
    if (!listVal.isCompleted) {
      this.listFormArray.push(
        this.fb.group({
          isCompleted: true,
          content: listVal.content,
        })
      );
    } else {
      this.listFormArray.insert(
        0,
        this.fb.group({
          isCompleted: false,
          content: listVal.content,
        })
      );
    }
  }
}
