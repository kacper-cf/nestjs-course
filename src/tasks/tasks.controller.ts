import { TasksService } from './tasks.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Array<Task> {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get(':id')
  getTaskById(@Param('id') taskId: string): Task | undefined {
    return this.tasksService.getTaskById(taskId);
  }

  @Delete(':id')
  removeTaskById(@Param('id') taskId: string): {
    message: string;
  } {
    const isOperationSuccessful = this.tasksService.removeTaskById(taskId);

    if (!isOperationSuccessful) {
      return {
        message: 'Task with specified ID was not found',
      };
    }

    return {
      message: 'Removed the task successfully',
    };
  }
  @Patch(':id/status')
  updateTasksStatus(
    @Param('id') taskId: string,
    @Body('status') taskStatus: TaskStatus | string,
  ): { message: string } {
    return this.tasksService.updateTasksStatus(taskId, taskStatus);
  }
}
