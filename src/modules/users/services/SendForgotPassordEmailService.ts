import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

// import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface Request {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private UserTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({email}: Request): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('user does not exists.')
    }

    await this.UserTokensRepository.generate(user.id)

    this.mailProvider.sendMail(email,'pedido de recuperação de senha recebido.')
  }
}

export default SendForgotPasswordEmailService;
