// ============================================
// ARCHIVO: backend/src/controllers/course.controller.ts
// ============================================

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CourseService, ModuleService, LessonService } from '../services/course.service';

export class CourseController {
  static async createCourse(req: AuthRequest, res: Response) {
    try {
      const tutorId = req.user?.userId;
      if (!tutorId) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const course = await CourseService.createCourse({
        tutorId,
        ...req.body,
      });

      res.status(201).json(course);
    } catch (error: any) {
      console.error('Error en createCourse:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getCourses(req: AuthRequest, res: Response) {
    try {
      const filters = {
        status: req.query.status as string,
        tutorId: req.query.tutorId as string,
        contentType: req.query.contentType as string,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };

      const result = await CourseService.getCourses(filters);
      res.json(result);
    } catch (error: any) {
      console.error('Error en getCourses:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getCourseById(req: AuthRequest, res: Response) {
    try {
      const courseId = req.params.id;
      const userId = req.user?.userId;

      const course = await CourseService.getCourseById(courseId, userId);
      res.json(course);
    } catch (error: any) {
      console.error('Error en getCourseById:', error);
      res.status(404).json({ error: error.message });
    }
  }

  static async updateCourse(req: AuthRequest, res: Response) {
    try {
      const courseId = req.params.id;
      const tutorId = req.user?.userId;

      if (!tutorId) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const course = await CourseService.updateCourse(courseId, tutorId, req.body);
      res.json(course);
    } catch (error: any) {
      console.error('Error en updateCourse:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCourse(req: AuthRequest, res: Response) {
    try {
      const courseId = req.params.id;
      const tutorId = req.user?.userId;

      if (!tutorId) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      await CourseService.deleteCourse(courseId, tutorId);
      res.status(204).send();
    } catch (error: any) {
      console.error('Error en deleteCourse:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async publishCourse(req: AuthRequest, res: Response) {
    try {
      const courseId = req.params.id;
      const tutorId = req.user?.userId;

      if (!tutorId) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      await CourseService.publishCourse(courseId, tutorId);
      res.json({ message: 'Curso publicado exitosamente' });
    } catch (error: any) {
      console.error('Error en publishCourse:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

export class ModuleController {
  static async createModule(req: AuthRequest, res: Response) {
    try {
      const courseId = req.params.courseId;
      const tutorId = req.user?.userId;

      if (!tutorId) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const module = await ModuleService.createModule({
        courseId,
        tutorId,
        ...req.body,
      });

      res.status(201).json(module);
    } catch (error: any) {
      console.error('Error en createModule:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getCourseModules(req: AuthRequest, res: Response) {
    try {
      const courseId = req.params.courseId;
      const modules = await ModuleService.getCourseModules(courseId);
      res.json(modules);
    } catch (error: any) {
      console.error('Error en getCourseModules:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

export class LessonController {
  static async createLesson(req: AuthRequest, res: Response) {
    try {
      const moduleId = req.params.moduleId;
      const lesson = await LessonService.createLesson({
        moduleId,
        ...req.body,
      });

      res.status(201).json(lesson);
    } catch (error: any) {
      console.error('Error en createLesson:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getLessonById(req: AuthRequest, res: Response) {
    try {
      const lessonId = req.params.id;
      const lesson = await LessonService.getLessonById(lessonId);
      res.json(lesson);
    } catch (error: any) {
      console.error('Error en getLessonById:', error);
      res.status(404).json({ error: error.message });
    }
  }

  static async addVideo(req: AuthRequest, res: Response) {
    try {
      const lessonId = req.params.id;
      const video = await LessonService.addVideo(lessonId, req.body);
      res.status(201).json(video);
    } catch (error: any) {
      console.error('Error en addVideo:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async addDocument(req: AuthRequest, res: Response) {
    try {
      const lessonId = req.params.id;
      const document = await LessonService.addDocument(lessonId, req.body);
      res.status(201).json(document);
    } catch (error: any) {
      console.error('Error en addDocument:', error);
      res.status(400).json({ error: error.message });
    }
  }
}