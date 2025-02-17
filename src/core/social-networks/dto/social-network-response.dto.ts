import { ApiProperty } from '@nestjs/swagger';
import { SocialNetworksTypeResponseDto } from '../../social-networks-types/dto/social-networks-type-response.dto';
import { ClientResponseDto } from '../../clients/dto/client-response.dto';

export class SocialNetworkResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  url: string;

  @ApiProperty({
    description: 'Tipo da rede social',
    type: SocialNetworksTypeResponseDto,
  })
  tipo: SocialNetworksTypeResponseDto;

  @ApiProperty({
    description: 'Cliente proprietário da rede social',
    type: () => ClientResponseDto,
  })
  cliente: ClientResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
