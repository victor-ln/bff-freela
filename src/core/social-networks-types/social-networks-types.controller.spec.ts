import { Test, TestingModule } from '@nestjs/testing';
import { SocialNetworksTypesController } from './social-networks-types.controller';
import { SocialNetworksTypesService } from './social-networks-types.service';

describe('SocialNetworksTypesController', () => {
  let controller: SocialNetworksTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialNetworksTypesController],
      providers: [SocialNetworksTypesService],
    }).compile();

    controller = module.get<SocialNetworksTypesController>(SocialNetworksTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
