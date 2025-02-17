import { ApiProperty } from '@nestjs/swagger';

export class SocialNetworksTypeResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tipo: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
