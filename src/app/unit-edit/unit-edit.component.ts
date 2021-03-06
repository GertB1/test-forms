import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Unit, Alarm } from '../data.model';
import { UnitService } from '../unit.service';

@Component({
  selector: 'app-unit-edit',
  templateUrl: './unit-edit.component.html',
  styleUrls: ['./unit-edit.component.css']
})
export class UnitEditComponent implements OnInit {
  @Input() unit: Unit;
  form: FormGroup;

  constructor(private fb: FormBuilder, private unitService: UnitService) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.fb.group({
      name: '',
      alarms: this.fb.array([]),
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.rebuildForm();
  }

  rebuildForm() {
    if (this.unit) {
      this.form.reset({
        name: this.unit.name
      });
      this.setAlarms(this.unit.alarms);
    }
  }

  setAlarms(alarms: Alarm[]) {
    const alarmGroup = alarms.map(alarm => this.fb.group(alarm));
    const alarmsFormArray = this.fb.array(alarmGroup);
    this.form.setControl('alarms', alarmsFormArray);
  }

  get alarms(): FormArray {
    return this.form.get('alarms') as FormArray;
  };

  public updateData(unit: Unit) {
    let saveunit = this.prepareSaveUnit(unit);
    this.unitService.update(saveunit);
  }

  prepareSaveUnit(currentUnit: Unit): Unit {
    const formModel = this.form.value;

    const alarmsDeepCopy: Alarm[] = formModel.alarms.map(
      (unit: Unit) => Object.assign({}, unit)
    );

    const saveUnit: Unit = {
      id: currentUnit.id,
      name: formModel.name as string,
      alarms: alarmsDeepCopy
    };
    return saveUnit;
  }
}
