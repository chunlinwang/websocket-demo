import { Test, TestingModule } from '@nestjs/testing';
import {
  HealthCheckResult,
  HealthCheckService,
  TerminusModule,
} from '@nestjs/terminus';
import { HealthController } from '@health/health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  it('check heath api, the HealthCheckService should be launched.', async () => {
    const result = {
      status: 'ok',
      info: {
        memory_heap: {
          status: 'up',
        },
        memory_rss: {
          status: 'up',
        },
        storage: {
          status: 'up',
        },
      },
      error: {},
      details: {
        memory_heap: {
          status: 'up',
        },
        memory_rss: {
          status: 'up',
        },
        storage: {
          status: 'up',
        },
      },
    } as HealthCheckResult;
    const healthCheckServiceMock = jest
      .spyOn(healthCheckService, 'check')
      .mockResolvedValueOnce(result);

    expect(await controller.check()).toBe(result);

    expect(healthCheckServiceMock).toHaveBeenCalledTimes(1);
  });
});
