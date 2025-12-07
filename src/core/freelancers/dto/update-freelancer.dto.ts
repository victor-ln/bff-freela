// src/core/freelancers/dto/update-freelancer.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateFreelancerDto } from './create-freelancer.dto';

export class UpdateFreelancerDto extends PartialType(CreateFreelancerDto) {}