import {
  IsInt,
  IsOptional,
  Min,
  Max,
  IsArray,
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class TodoDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsOptional()
  done?: boolean;
}

export class UpsertJournalDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  waterIntake?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  mood?: number;

  @IsNumber()
  @Min(0)
  @Max(24)
  @IsOptional()
  sleepHours?: number;

  @IsInt()
  @Min(0)
  @Max(2)
  @IsOptional()
  workout?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TodoDto)
  @IsOptional()
  todos?: TodoDto[];
}
