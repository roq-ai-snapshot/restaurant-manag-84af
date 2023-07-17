import * as yup from 'yup';

export const operationalHoursValidationSchema = yup.object().shape({
  day: yup.string().required(),
  open_time: yup.date().required(),
  close_time: yup.date().required(),
  restaurant_id: yup.string().nullable(),
});
