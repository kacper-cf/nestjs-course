import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTaskFilterDto,
    user: User,
  ): Promise<Array<Task>> {
    return this.tasksService.getTasks(filterDto, user);
  }

  @Post()
  createTask(
    @GetUser() user: User,
    @Body()
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get(':id')
  async getTaskById(@Param('id') taskId: string): Promise<Task> {
    const task = await this.tasksService.getTaskById(taskId);

    return task;
  }

  @Delete(':id')
  async removeTaskById(
    @Param('id') taskId: string,
  ): Promise<{ message: string }> {
    await this.tasksService.removeTaskById(taskId);

    return { message: 'Deleted successfully' };
  }

  @Patch(':id/status')
  updateTasksStatus(
    @Param('id') taskId: string,
    @Body() { status }: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateTasksStatus(taskId, status);
  }
}
