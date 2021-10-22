import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask({ title, description }: CreateTaskDto) {
    const task = {
      title,
      description,
      status: TaskStatus.Open,
    };

    const createdTask = this.create(task);

    await this.save(createdTask);

    return createdTask;
  }

  async removeTaskById(taskId: string): Promise<void> {
    const { affected } = await this.delete(taskId);

    if (!affected) {
      throw new NotFoundException();
    }
  }

  async getTasks({ search, status }: GetTaskFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }
}
