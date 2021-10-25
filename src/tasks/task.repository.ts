import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask({ title, description }: CreateTaskDto, user: User) {
    const task = {
      title,
      description,
      status: TaskStatus.Open,
      user,
    };

    const createdTask = this.create(task);

    await this.save(createdTask);

    return createdTask;
  }

  async removeTaskById(taskId: string, user): Promise<void> {
    const { affected } = await this.delete({ id: taskId, user });

    if (!affected) {
      throw new NotFoundException();
    }
  }

  async getTasks(
    { search, status }: GetTaskFilterDto,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const tasks = await query.getMany();

    console.log(tasks);

    return tasks;
  }
}
