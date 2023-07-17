import { RestaurantInterface } from 'interfaces/restaurant';
import { GetQueryInterface } from 'interfaces';

export interface OperationalHoursInterface {
  id?: string;
  day: string;
  open_time: any;
  close_time: any;
  restaurant_id?: string;
  created_at?: any;
  updated_at?: any;

  restaurant?: RestaurantInterface;
  _count?: {};
}

export interface OperationalHoursGetQueryInterface extends GetQueryInterface {
  id?: string;
  day?: string;
  restaurant_id?: string;
}
