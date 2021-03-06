import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserAvatar', ()=>{
  beforeEach(()=>{
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  })

  it('should be able to update the profile', async ()=>{
    const user = await fakeUsersRepository.create({
     name: 'John Doe',
     email: 'johndoe@example.com',
     password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Smith',
      email: 'johnsm@example.com',
    })

    expect(updatedUser.name).toBe('John Smith');
    expect(updatedUser.email).toBe('johnsm@example.com');
  });

  it('should not be able to update the email to another user email', async ()=>{
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
     });

    const user = await fakeUsersRepository.create({
      name: 'Carlos Oliver',
      email: 'carlosoliver@example.com',
      password: '123456'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@example.com',
    })).rejects.toBeInstanceOf(AppError)
  });

  it('should be able to update the password', async ()=>{
    const user = await fakeUsersRepository.create({
     name: 'John Doe',
     email: 'johndoe@example.com',
     password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Smith',
      email: 'johnsm@example.com',
      old_password: '123456',
      password: '123123'
    })

    expect(updatedUser.password).toBe('123123');
  });

  it('should be not able to update the password without old password', async ()=>{
    const user = await fakeUsersRepository.create({
     name: 'John Doe',
     email: 'johndoe@example.com',
     password: '123456'
    });

     await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Smith',
      email: 'johnsm@example.com',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to update the password with wrong old password', async ()=>{
    const user = await fakeUsersRepository.create({
     name: 'John Doe',
     email: 'johndoe@example.com',
     password: '123456'
    });

     await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Smith',
      email: 'johnsm@example.com',
      old_password: 'wrong-old-password',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile of a non-existing user', async ()=>{
    expect(updateProfile.execute({
      user_id: 'non-existing id',
      name: 'test',
      email: 'test@example.com'
    })).rejects.toBeInstanceOf(AppError);
  });
});
