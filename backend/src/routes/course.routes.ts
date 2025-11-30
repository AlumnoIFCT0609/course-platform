// ============================================
// COURSE ROUTES
// ============================================

import express from 'express';
import { authenticate, authorize, AuthRequest } from './auth';

const router = express.Router();

// Create course
router.post('/', authenticate, authorize('tutor', 'admin'), async (req: AuthRequest, res) => {
  try {
    const course = await CourseService.createCourse({
      tutorId: req.user!.userId,
      ...req.body,
    });
    res.status(201).json(course);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get courses
router.get('/', async (req, res) => {
  try {
    const result = await CourseService.getCourses({
      status: req.query.status as string,
      tutorId: req.query.tutorId as string,
      contentType: req.query.contentType as string,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const course = await CourseService.getCourseById(
      req.params.id,
      req.user?.userId
    );
    res.json(course);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
