import { Controller, Post, Body } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { CalculateDto } from './calculator.dto';

@Controller('api/calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('calculate')
  calculate(@Body() dto: CalculateDto) {
    try {
      const result = this.calculatorService.calculate(
        dto.operator,
        dto.numbers,
      );
      return {
        operator: dto.operator,
        numbers: dto.numbers,
        result: result,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
