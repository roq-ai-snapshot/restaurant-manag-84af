import * as yup from 'yup';

export const menuValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  restaurant_id: yup.string().nullable(),
});
