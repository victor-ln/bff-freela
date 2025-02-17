import { PartialType } from '@nestjs/mapped-types';
import { CreateSocialNetworksTypeDto } from './create-social-networks-type.dto';

export class UpdateSocialNetworksTypeDto extends PartialType(CreateSocialNetworksTypeDto) {}
