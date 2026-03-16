import { PickType, PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(PickType(CreateAccountDto, ['accountType'] as const)) { }
