import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  private getCurrentMonthRange() {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    to.setUTCHours(23, 59, 59, 999);
    return { from, to };
  }

  async getWaterCurrentMonth(userId: number) {
    const { from, to } = this.getCurrentMonthRange();

    const journals = await this.prisma.journal.findMany({
      where: {
        userId,
        date: { gte: from, lte: to },
        waterIntake: { not: null },
      },
      select: { date: true, waterIntake: true },
      orderBy: { date: 'asc' },
    });

    const totalWater = journals.reduce(
      (sum, j) => sum + (j.waterIntake ?? 0),
      0,
    );
    const daysLogged = journals.length;
    const avgWater =
      daysLogged > 0 ? Math.round((totalWater / daysLogged) * 10) / 10 : 0;

    return {
      period: {
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0],
      },
      totalWater,
      daysLogged,
      avgWaterPerDay: avgWater,
      dailyBreakdown: journals.map((j) => ({
        date: j.date.toISOString().split('T')[0],
        waterIntake: j.waterIntake,
      })),
    };
  }

  async getSleepCurrentMonth(userId: number) {
    const { from, to } = this.getCurrentMonthRange();

    const journals = await this.prisma.journal.findMany({
      where: {
        userId,
        date: { gte: from, lte: to },
        sleepHours: { not: null },
      },
      select: { date: true, sleepHours: true },
      orderBy: { date: 'asc' },
    });

    const totalSleep = journals.reduce(
      (sum, j) => sum + (j.sleepHours ?? 0),
      0,
    );
    const daysLogged = journals.length;
    const avgSleep =
      daysLogged > 0 ? Math.round((totalSleep / daysLogged) * 10) / 10 : 0;

    return {
      period: {
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0],
      },
      totalSleep,
      daysLogged,
      avgSleepPerDay: avgSleep,
      dailyBreakdown: journals.map((j) => ({
        date: j.date.toISOString().split('T')[0],
        sleepHours: j.sleepHours,
      })),
    };
  }

  async getTodosCurrentMonth(userId: number) {
    const { from, to } = this.getCurrentMonthRange();

    const journals = await this.prisma.journal.findMany({
      where: {
        userId,
        date: { gte: from, lte: to },
      },
      select: {
        date: true,
        todos: {
          select: {
            done: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    const totalTodos = journals.reduce((sum, j) => sum + j.todos.length, 0);
    const completedTodos = journals.reduce(
      (sum, j) => sum + j.todos.filter((t) => t.done).length,
      0,
    );
    const openTodos = totalTodos - completedTodos;
    const completionRate =
      totalTodos > 0
        ? Math.round((completedTodos / totalTodos) * 1000) / 10
        : 0;

    return {
      period: {
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0],
      },
      totalTodos,
      completedTodos,
      openTodos,
      completionRate,
      dailyBreakdown: journals
        .filter((j) => j.todos.length > 0)
        .map((j) => ({
          date: j.date.toISOString().split('T')[0],
          total: j.todos.length,
          completed: j.todos.filter((t) => t.done).length,
          open: j.todos.filter((t) => !t.done).length,
        })),
    };
  }

  async getMoodCurrentMonth(userId: number) {
    const { from, to } = this.getCurrentMonthRange();

    const journals = await this.prisma.journal.findMany({
      where: {
        userId,
        date: { gte: from, lte: to },
        mood: { not: null },
      },
      select: { date: true, mood: true },
      orderBy: { date: 'asc' },
    });

    const moodLabels = { 0: 'bad', 1: 'okay', 2: 'good' };

    const moodDistribution = { bad: 0, okay: 0, good: 0 };
    journals.forEach((j) => {
      if (j.mood === 0) moodDistribution.bad++;
      if (j.mood === 1) moodDistribution.okay++;
      if (j.mood === 2) moodDistribution.good++;
    });

    const daysLogged = journals.length;
    const avgMood =
      daysLogged > 0
        ? Math.round(
            (journals.reduce((sum, j) => sum + (j.mood ?? 0), 0) / daysLogged) *
              10,
          ) / 10
        : 0;

    return {
      period: {
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0],
      },
      daysLogged,
      avgMood,
      moodDistribution,
      dailyBreakdown: journals.map((j) => ({
        date: j.date.toISOString().split('T')[0],
        mood: j.mood,
        moodLabel: moodLabels[j.mood as 0 | 1 | 2],
      })),
    };
  }

  async getWorkoutCurrentMonth(userId: number) {
    const { from, to } = this.getCurrentMonthRange();

    const journals = await this.prisma.journal.findMany({
      where: {
        userId,
        date: { gte: from, lte: to },
        workout: { not: null },
      },
      select: { date: true, workout: true },
      orderBy: { date: 'asc' },
    });

    const workoutLabels = { 0: 'none', 1: 'light', 2: 'intense' };

    const workoutDistribution = { none: 0, light: 0, intense: 0 };
    journals.forEach((j) => {
      if (j.workout === 0) workoutDistribution.none++;
      if (j.workout === 1) workoutDistribution.light++;
      if (j.workout === 2) workoutDistribution.intense++;
    });

    const daysLogged = journals.length;
    const daysWithWorkout = journals.filter(
      (j) => j.workout && j.workout > 0,
    ).length;
    const avgWorkout =
      daysLogged > 0
        ? Math.round(
            (journals.reduce((sum, j) => sum + (j.workout ?? 0), 0) /
              daysLogged) *
              10,
          ) / 10
        : 0;

    return {
      period: {
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0],
      },
      daysLogged,
      daysWithWorkout,
      avgWorkout,
      workoutDistribution,
      dailyBreakdown: journals.map((j) => ({
        date: j.date.toISOString().split('T')[0],
        workout: j.workout,
        workoutLabel: workoutLabels[j.workout as 0 | 1 | 2],
      })),
    };
  }
}
