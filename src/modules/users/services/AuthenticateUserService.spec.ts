import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', ()=>{
  it('should be able to authenticate a user', async ()=>{
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const AuthenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
     })

    const response = await AuthenticateUser.execute({
     email: 'johndoe@example.com',
     password: '123456'
    })

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user)
  });

  it('should not be able to authenticate a user that does not exists', async ()=>{
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const AuthenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

    expect(AuthenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456'
     })).rejects.toBeInstanceOf(AppError)
  });

  it('should not be able to authenticate a user with the wrong password', async ()=>{
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const AuthenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
     })

    expect(AuthenticateUser.execute({
      email: 'johndoe@example.com',
      password: 'wrong-password'
     })).rejects.toBeInstanceOf(AppError);

  });
});
