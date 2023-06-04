import { Test, TestingModule } from '@nestjs/testing';
import { InteractController } from './interact.controller';
import { InteractService } from './interact.service';

describe('InteractController', () => {
  let interactController: InteractController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InteractController],
      providers: [InteractService],
    }).compile();

    interactController = app.get<InteractController>(InteractController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(interactController.getHello()).toBe('Hello World!');
    });
  });
});
