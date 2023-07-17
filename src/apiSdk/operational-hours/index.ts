import axios from 'axios';
import queryString from 'query-string';
import { OperationalHoursInterface, OperationalHoursGetQueryInterface } from 'interfaces/operational-hours';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getOperationalHours = async (
  query?: OperationalHoursGetQueryInterface,
): Promise<PaginatedInterface<OperationalHoursInterface>> => {
  const response = await axios.get('/api/operational-hours', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createOperationalHours = async (operationalHours: OperationalHoursInterface) => {
  const response = await axios.post('/api/operational-hours', operationalHours);
  return response.data;
};

export const updateOperationalHoursById = async (id: string, operationalHours: OperationalHoursInterface) => {
  const response = await axios.put(`/api/operational-hours/${id}`, operationalHours);
  return response.data;
};

export const getOperationalHoursById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/operational-hours/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOperationalHoursById = async (id: string) => {
  const response = await axios.delete(`/api/operational-hours/${id}`);
  return response.data;
};
