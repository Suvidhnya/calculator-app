import { IsNumber, IsNotEmpty, IsString, IsArray } from 'class-validator';

/**
 * DTO for Calculator Operations
 * Accepts operator and multiple numbers for flexible calculations
 */
export class CalculateDto {
  @IsNotEmpty({ message: 'Operator is required' })
  @IsString({ message: 'Operator must be a string' })
  operator!: string;

  @IsNotEmpty({ message: 'Numbers array is required' })
  @IsArray({ message: 'Numbers must be an array' })
  @IsNumber({}, { each: true, message: 'All numbers must be valid numbers' })
  numbers!: number[];
}

/**
 * How DTOs work:
 * 
 * 1. Frontend sends: { "a": 10, "b": "five" }
 * 2. NestJS ValidationPipe checks using DTO decorators
 * 3. @IsNumber catches that "five" is not a number
 * 4. Returns error to frontend: "b must be a valid number"
 * 5. Handler method never called with invalid data
 * 
 * Benefits:
 * - Automatic validation
 * - Consistent error messages
 * - Type safety
 * - Self-documenting API
 */
