import { Pipe, PipeTransform } from '@angular/core';
import { ProjectTask } from '../models/responses/project.responses';

@Pipe({
  name: 'filterTasks',
  standalone: true
})
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: ProjectTask[] | undefined, state: 'to be done' | 'in progress' | 'under review' | 'done'): ProjectTask[] {
    if (!tasks) {
      return [];
    }
    return tasks.filter(task => task.state === state);
  }
}