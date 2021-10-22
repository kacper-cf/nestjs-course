import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Array<Task> = [];

  getAllTasks = (): Array<Task> => {
    return this.tasks;
  };

  createTask = ({ title, description }: CreateTaskDto): Task => {
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.Open,
    };

    this.tasks.push(task);

    return task;
  };

  getTaskById(id: string): Task | undefined {
    const foundTask = this.tasks.find((task) => task.id === id);

    if (!foundTask) {
      throw new NotFoundException();
    }

    return foundTask;
  }

  removeTaskById(taskId: string): boolean {
    const tasksLengthBeforeDeletion = this.tasks.length;

    this.tasks = this.tasks.filter((task) => task.id !== taskId);

    return this.tasks.length !== tasksLengthBeforeDeletion;
  }

  updateTasksStatus(
    taskId: string,
    newStatus: TaskStatus | string,
  ): { message: string } {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      return { message: 'Task with specified ID was not found' };
    }

    if (!this.isValidStatus(newStatus)) {
      return { message: 'Task status was invalid' };
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      status: newStatus,
    };

    return { message: 'Task status updated successfully.' };
  }

  private isValidStatus(taskStatus: string): taskStatus is TaskStatus {
    return Object.keys(TaskStatus).some((key) => key === taskStatus);
  }

  getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = [...this.getAllTasks()];

    if (!status && !search) {
      return tasks;
    }

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }
}
