import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSocialNetworkDto } from './create-social-network.dto';

export class UpdateSocialNetworkDto extends PartialType(
  OmitType(CreateSocialNetworkDto, ['clienteId'] as const)
) {}
