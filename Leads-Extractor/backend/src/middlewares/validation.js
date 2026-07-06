import { body, query, param, validationResult } from 'express-validator';
import { ALL_CATEGORIES } from '../utils/helpers.js';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
}

export const searchValidation = [
  body('searchMode')
    .optional()
    .isIn(['city', 'country', 'worldwide'])
    .withMessage('Invalid search mode'),
  body('country')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must be at most 100 characters')
    .custom((value, { req }) => {
      const mode = req.body.searchMode || 'city';
      if (mode !== 'worldwide' && !value?.trim()) {
        throw new Error('Country is required for city and country search');
      }
      return true;
    }),
  body('city')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must be at most 100 characters')
    .custom((value, { req }) => {
      const mode = req.body.searchMode || 'city';
      if (mode === 'city' && !value?.trim()) {
        throw new Error('City is required for single city search');
      }
      return true;
    }),
  body('radius')
    .optional()
    .isInt({ min: 1000, max: 50000 })
    .withMessage('Radius must be between 1000 and 50000 meters'),
  body('maxResults')
    .optional()
    .isInt({ min: 10, max: 500 })
    .withMessage('Max results must be between 10 and 500'),
  body('categories')
    .optional()
    .isArray()
    .withMessage('Categories must be an array'),
  body('categories.*')
    .optional()
    .isIn(ALL_CATEGORIES)
    .withMessage('Invalid category'),
];

export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const companyQueryValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sortBy')
    .optional()
    .isIn([
      'name',
      'email',
      'city',
      'country',
      'googleRating',
      'category',
      'createdAt',
    ]),
  query('sortOrder').optional().isIn(['asc', 'desc']),
];

export const idParamValidation = [
  param('id').isUUID().withMessage('Invalid ID'),
];

export const searchIdParamValidation = [
  param('searchId').isUUID().withMessage('Invalid search ID'),
];

export const deleteCompaniesValidation = [
  body('ids').isArray({ min: 1 }).withMessage('IDs array is required'),
  body('ids.*').isUUID().withMessage('Each ID must be a valid UUID'),
];
