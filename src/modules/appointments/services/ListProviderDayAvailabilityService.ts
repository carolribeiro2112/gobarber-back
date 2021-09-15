import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, getHours } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id:string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
 hour: number;
 available: boolean;
}>

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, day, year, month }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      day,
      year,
      month,
    });

    const hourStart = 8;

    const eachHourArray = Array.from({length:10}, (_,index)=> index + hourStart)

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      )

      return {
        hour,
        available: !hasAppointmentInHour,
      }
    })
    return availability;
  }
}

export default ListProviderDayAvailabilityService;