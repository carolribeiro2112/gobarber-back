import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from "./CreateAppointmentService";

let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', ()=>{
  beforeEach(()=>{
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
  })

  it('should be able to create a new appointment', async ()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2021, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2021, 4, 10, 13),
      user_id:'123456',
      provider_id: '123123',
    })

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123')
  });

  it('should not be able to create two appointments at same time', async ()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2021, 4, 10, 12).getTime();
    });


    await createAppointment.execute({
      date: new Date(2021, 4, 10, 12),
      user_id:'123456',
      provider_id: '123123',
    })

    await expect(createAppointment.execute({
      date: new Date(2021, 4, 10, 12),
      user_id:'123456',
      provider_id: '123123',
    })).rejects.toBeInstanceOf(AppError)
  });

  it('should not be able to create an appointment on a past date', async()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2021, 4, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2021, 4, 10, 11),
      user_id:'123456',
      provider_id: '123123',
    })).rejects.toBeInstanceOf(AppError)
  });

  it('should not be able to create an appointment with same user as provider', async()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2021, 4, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2021, 4, 10, 13),
      user_id:'user-id',
      provider_id: 'user-id',
    })).rejects.toBeInstanceOf(AppError)
  });

  it('should not be able to create an appointment before 8 a.m and after 5 p.m', async()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2021, 4, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2021, 4, 11, 7),
      user_id:'user-id',
      provider_id: 'provider-id',
    })).rejects.toBeInstanceOf(AppError)

    await expect(createAppointment.execute({
      date: new Date(2021, 4, 11, 18),
      user_id:'user-id',
      provider_id: 'provider-id',
    })).rejects.toBeInstanceOf(AppError)

  });
});
