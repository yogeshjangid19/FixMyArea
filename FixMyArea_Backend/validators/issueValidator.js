import { body } from 'express-validator';

export const createIssueValidator = [
  body('issueTitle')
    .notEmpty()
    .withMessage('Issue title is required'),

  body('issueDescription')
    .notEmpty()
    .withMessage('Issue description is required'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Potholes',
      'Broken Street Light',
      'Sewage Overflow',
      'Illegal Waste Dumping',
      'Damaged Traffic Signals',
      'Unclean Public Toilets',
    ])
    .withMessage('Invalid category'),

  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),

  body('address')
    .notEmpty()
    .withMessage('Address is required'),
];
