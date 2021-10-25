import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepostiory: TasksRepository,
  ) {}

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepostiory.createTask(createTaskDto, user);
  }

  async getTaskById(id: string): Promise<Task> {
    const foundTask = await this.tasksRepostiory.findOne(id);

    if (!foundTask) {
      throw new NotFoundException();
    }

    return foundTask;
  }

  removeTaskById(taskId: string): Promise<void> {
    return this.tasksRepostiory.removeTaskById(taskId);
  }

  async updateTasksStatus(
    taskId: string,
    newStatus: TaskStatus,
  ): Promise<Task> {
    const task = await this.getTaskById(taskId);

    task.status = newStatus;

    this.tasksRepostiory.save(task);

    return task;
  }

  getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepostiory.getTasks(filterDto, user);
  }
}
