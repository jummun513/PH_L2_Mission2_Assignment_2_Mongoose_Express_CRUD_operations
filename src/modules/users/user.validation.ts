import { z } from 'zod';

// Zod schemas for validation
const orderValidationSchema = z.object({
  productName: z.string().min(1, 'required field'),
  price: z.number().min(1, 'required field'),
  quantity: z.number().min(1, 'required field'),
});

const userValidationSchema = z.object({
  userId: z.number().min(1, 'required field'),
  username: z.string().min(6, 'User name minimum length 6 characters.'),
  password: z
    .string()
    .min(8, 'Password minimum length 8 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/, 'Invalid password'),
  fullName: z.object({
    firstName: z.string().min(3, 'First Name length at least 3 characters'),
    lastName: z.string().min(3, 'First Name length at least 3 characters'),
  }),
  age: z.number().min(1),
  email: z.string().email({ message: 'Not a valid email.' }),
  isActive: z.boolean(),
  hobbies: z.array(z.string()).nonempty({
    message: 'At least a hobby!',
  }),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
  }),
  orders: z.array(orderValidationSchema).optional(),
  isDeleted: z.boolean().optional(),
});

export default userValidationSchema;
