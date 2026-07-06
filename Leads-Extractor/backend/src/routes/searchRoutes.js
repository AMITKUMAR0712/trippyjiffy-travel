import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  search,
  getSearchStatus,
  listCompanies,
  getCompany,
  deleteCompany,
  deleteCompanies,
  exportCsv,
  exportExcel,
  exportPdf,
  history,
  analytics,
  config,
} from '../controllers/searchController.js';
import {
  searchValidation,
  companyQueryValidation,
  idParamValidation,
  searchIdParamValidation,
  deleteCompaniesValidation,
  validate,
} from '../middlewares/validation.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = Router();

const searchLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Search rate limit exceeded. Try again in an hour.',
  },
});

router.post('/search', searchLimiter, optionalAuth, searchValidation, validate, search);
router.get('/search/:searchId/status', searchIdParamValidation, validate, getSearchStatus);
router.get('/companies', companyQueryValidation, validate, listCompanies);
router.get('/company/:id', idParamValidation, validate, getCompany);
router.delete('/company/:id', idParamValidation, validate, deleteCompany);
router.delete('/companies', deleteCompaniesValidation, validate, deleteCompanies);
router.get('/export/csv', exportCsv);
router.get('/export/excel', exportExcel);
router.get('/export/pdf', exportPdf);
router.get('/config', config);
router.get('/history', optionalAuth, history);
router.get('/analytics', optionalAuth, analytics);

export default router;
