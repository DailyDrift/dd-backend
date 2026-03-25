import { Injectable } from '@nestjs/common';
import * as Console from 'node:console';

@Injectable()
export class QoutesService {
  private readonly apiUrl = 'https://zenquotes.io/api/today/';
  private quoteOfTheDayPromise: Promise<void>;
  private quoteOfTheDayText: string;
  private quoteOfTheDayAuthor: string;

  constructor() {
    this.quoteOfTheDayPromise = this.loadQuoteOfTheDay();
  }

  private async loadQuoteOfTheDay(): Promise<void> {
    Console.log('Loading Quotes from the quotes service');

    const response = await fetch(this.apiUrl);
    const data = await response.json();
    const first = data[0];

    this.quoteOfTheDayText = first?.q ?? 'No quote available';
    this.quoteOfTheDayAuthor = first?.a ?? 'Unknown';
  }

  async getQuoteOfTheDay(): Promise<{ quote: string; author: string }> {
    await this.quoteOfTheDayPromise;
    return {
      quote: this.quoteOfTheDayText,
      author: this.quoteOfTheDayAuthor,
    };
  }
}
