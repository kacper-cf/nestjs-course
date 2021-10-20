import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter-dto';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto): Array<Task> {
    console.log(filterDto);

    if (!Object.keys(filterDto)) {
      return this.tasksService.getAllTasks();
    }

    return this.tasksService.getTasksWithFilters(filterDto);
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
