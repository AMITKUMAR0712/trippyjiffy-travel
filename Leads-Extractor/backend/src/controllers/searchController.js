import {
  startSearch,
  getCompanies,
  getSearchHistory,
  getSearchAnalytics,
  getSearchProgress,
  getAppConfig,
} from '../services/searchService.js';
import prisma from '../utils/prisma.js';
import { companiesToCsv, companiesToExcel, companiesToPdf } from '../utils/exportUtils.js';
import { AppError } from '../middlewares/errorHandler.js';
import { DEFAULT_MAX_RESULTS } from '../utils/helpers.js';

export async function search(req, res, next) {
  try {
    const { country, city, radius, maxResults, categories, searchMode } =
      req.body;
    const userId = req.user?.id || null;

    const result = await startSearch({
      country: country?.trim() || '',
      city: city?.trim() || '',
      radius: radius ? parseInt(radius, 10) : null,
      maxResults: maxResults ? parseInt(maxResults, 10) : DEFAULT_MAX_RESULTS,
      categories: categories?.length ? categories : undefined,
      searchMode: searchMode || 'city',
      userId,
    });

    res.status(202).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (
      error.message.includes('GOOGLE_MAPS_API_KEY') ||
      error.message.includes('Google Places')
    ) {
      return next(new AppError(error.message, 502));
    }
    next(error);
  }
}

export async function getSearchStatus(req, res, next) {
  try {
    const { searchId } = req.params;
    const progress = getSearchProgress(searchId);

    if (!progress) {
      const history = await prisma.searchHistory.findUnique({
        where: { id: searchId },
        include: { _count: { select: { companies: true } } },
      });
      if (!history) {
        throw new AppError('Search not found', 404);
      }

      if (history.status === 'in_progress') {
        const processed = history._count.companies;
        const total = history.maxResults;
        return res.json({
          success: true,
          data: {
            status: 'in_progress',
            total,
            processed,
            currentStep: `Processing companies (${processed} saved so far)...`,
            percent: Math.min(
              95,
              Math.round(10 + (processed / Math.max(total, 1)) * 85)
            ),
          },
        });
      }

      return res.json({
        success: true,
        data: {
          status: history.status,
          total: history.totalFound,
          processed: history.totalFound,
          totalFound: history.totalFound,
          currentStep:
            history.status === 'completed'
              ? 'Search completed'
              : 'Search failed',
          percent: history.status === 'completed' ? 100 : 0,
        },
      });
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
}

export async function listCompanies(req, res, next) {
  try {
    const result = await getCompanies({
      searchHistoryId: req.query.searchHistoryId,
      country: req.query.country,
      city: req.query.city,
      category: req.query.category,
      search: req.query.search,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getCompany(req, res, next) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
}

export async function deleteCompany(req, res, next) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.params.id },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    await prisma.company.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Company deleted' });
  } catch (error) {
    next(error);
  }
}

export async function deleteCompanies(req, res, next) {
  try {
    const { ids } = req.body;
    const result = await prisma.company.deleteMany({
      where: { id: { in: ids } },
    });

    res.json({
      success: true,
      message: `${result.count} companies deleted`,
      count: result.count,
    });
  } catch (error) {
    next(error);
  }
}

export async function exportCsv(req, res, next) {
  try {
    const where = buildExportWhere(req.query);
    const companies = await prisma.company.findMany({ where });
    const csv = companiesToCsv(companies);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="travel-companies-${Date.now()}.csv"`
    );
    res.send(csv);
  } catch (error) {
    next(error);
  }
}

export async function exportExcel(req, res, next) {
  try {
    const where = buildExportWhere(req.query);
    const companies = await prisma.company.findMany({ where });
    const buffer = await companiesToExcel(companies);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="travel-companies-${Date.now()}.xlsx"`
    );
    res.send(Buffer.from(buffer));
  } catch (error) {
    next(error);
  }
}

export async function exportPdf(req, res, next) {
  try {
    const where = buildExportWhere(req.query);
    const companies = await prisma.company.findMany({ where });
    const buffer = await companiesToPdf(companies);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="travel-companies-${Date.now()}.pdf"`
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
}

export async function history(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const result = await getSearchHistory(
      userId,
      parseInt(req.query.page, 10) || 1,
      parseInt(req.query.limit, 10) || 20
    );

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function config(req, res) {
  res.json({ success: true, data: getAppConfig() });
}

export async function analytics(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const data = await getSearchAnalytics(userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

function buildExportWhere(query) {
  const where = {};
  if (query.searchHistoryId) where.searchHistoryId = query.searchHistoryId;
  if (query.ids) {
    const ids = Array.isArray(query.ids) ? query.ids : query.ids.split(',');
    where.id = { in: ids };
  }
  if (query.country) where.country = { contains: query.country, mode: 'insensitive' };
  if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
  return where;
}
