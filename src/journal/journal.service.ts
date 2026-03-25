import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertJournalDto } from './dto/upsert-journal.dto';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  async upsertToday(userId: number, dto: UpsertJournalDto) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const journal = await this.prisma.journal.upsert({
      where: {
        userId_date: { userId, date: today },
      },
      create: {
        userId,
        date: today,
        waterIntake: dto.waterIntake,
        mood: dto.mood,
        sleepHours: dto.sleepHours,
        workout: dto.workout,
      },
      update: {
        ...(dto.waterIntake !== undefined && { waterIntake: dto.waterIntake }),
        ...(dto.mood !== undefined && { mood: dto.mood }),
        ...(dto.sleepHours !== undefined && { sleepHours: dto.sleepHours }),
        ...(dto.workout !== undefined && { workout: dto.workout }),
      },
    });

    if (dto.todos?.length) {
      await this.prisma.todo.createMany({
        data: dto.todos.map((todo) => ({
          journalId: journal.id,
          content: todo.content,
          done: todo.done ?? false,
        })),
      });
    }

    return this.prisma.journal.findUnique({
      where: { id: journal.id },
      include: { todos: true },
    });
  }

  async getToday(userId: number) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return this.prisma.journal.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
      include: { todos: true },
    });
  }

  async updateTodoStatus(userId: number, todoId: number, done: boolean) {
    const todo = await this.prisma.todo.findFirst({
      where: {
        id: todoId,
        journal: { userId },
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return this.prisma.todo.update({
      where: { id: todoId },
      data: { done },
    });
  }
}
