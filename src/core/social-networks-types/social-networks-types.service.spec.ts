import { Test, TestingModule } from '@nestjs/testing';
import { SocialNetworksTypesService } from './social-networks-types.service';

describe('SocialNetworksTypesService', () => {
  let service: SocialNetworksTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialNetworksTypesService],
    }).compile();

    service = module.get<SocialNetworksTypesService>(SocialNetworksTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
