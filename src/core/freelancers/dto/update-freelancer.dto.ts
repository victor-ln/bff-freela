import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFreelancerDto } from './create-freelancer.dto';

export class UpdateFreelancerDto extends PartialType(
  OmitType(CreateFreelancerDto, ['senha'] as const)
) {}
