import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Serialize } from 'src/interceptor/serialize.interceptor';
import { CardDto } from './dto/card.dto';
import { Paginate, type PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(CardDto)
  create(@CurrentUser() user:User ,@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(user,createCardDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Paginate() query:PaginateQuery) {
    const result = await this.cardService.findAll(query);
    return {
      ...result,
      data:plainToInstance(CardDto,result.data,{
        excludeExtraneousValues:true,
      })
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Serialize(CardDto)
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @Patch(':id')
  @Serialize(CardDto)
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Delete(':id')
  @Serialize(CardDto)
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }
}
