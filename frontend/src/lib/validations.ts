import { z } from 'zod';

// Registration validation schema
export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  firstname: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastname: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Question validation schema
export const questionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must be less than 5000 characters'),
  tag: z
    .string()
    .trim()
    .min(2, 'Tag must be at least 2 characters')
    .max(30, 'Tag must be less than 30 characters')
    .regex(/^[a-zA-Z0-9-]+$/, 'Tag can only contain letters, numbers, and hyphens'),
});

// Answer validation schema
export const answerSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(10, 'Answer must be at least 10 characters')
    .max(5000, 'Answer must be less than 5000 characters'),
});

// Search query validation
export const searchSchema = z.object({
  q: z.string().trim().max(200, 'Search query too long').optional(),
  tag: z.string().trim().max(30, 'Tag too long').optional(),
});
