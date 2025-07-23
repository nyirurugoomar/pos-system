import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get('sales')
    async getSalesReport(
        @Query('from') from: string, 
        @Query('to') to: string
    ) {
        return this.reportsService.getSalesReport(new Date(from), new Date(to));
    }
}
