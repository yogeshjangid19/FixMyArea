import { check } from 'express-validator';

export const createIssueValidator = [
  check('issueTitle', 'Issue title is required').notEmpty(),
  check('issueDescription', 'Issue description is required').notEmpty(),
  check('category', 'Category is required').notEmpty().isIn([
    'Potholes',
    'Broken Street Light',
    'Sewage Overflow',
    'Illegal Waste Dumping',
    'Damaged Traffic Signals',
    'Unclean Public Toilets',
  ]),
  check('priority', 'Priority must be low, medium, or high').isIn(['low', 'medium', 'high']),
  check('address', 'Address is required').notEmpty(),
];