// ============================================
// COURSE SERVICE
// ============================================

import { Pool } from 'pg';
import slugify from 'slugify';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface CreateCourseDTO {
  tutorId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  contentType: 'video' | 'document' | 'mixed';
  level?: string;
  durationHours?: number;
  maxStudents?: number;
  enrollmentAutoApprove?: boolean;
}

interface Course {
  id: string;
  tutorId: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  contentType: string;
  status: string;
  createdAt: Date;
}

export class CourseService {
  // Create course
  static async createCourse(data: CreateCourseDTO): Promise<Course> {
    const slug = slugify(data.title, { lower: true, strict: true });

    // Check if slug exists
    const existing = await pool.query('SELECT id FROM courses WHERE slug = $1', [slug]);

    if (existing.rows.length > 0) {
      throw new Error('Course with this title already exists');
    }

    const result = await pool.query(
      `INSERT INTO courses (
        tutor_id, title, slug, description, thumbnail_url, 
        content_type, level, duration_hours, max_students, enrollment_auto_approve
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        data.tutorId,
        data.title,
        slug,
        data.description || '',
        data.thumbnailUrl || null,
        data.contentType,
        data.level || 'beginner',
        data.durationHours || 0,
        data.maxStudents || null,
        data.enrollmentAutoApprove || false,
      ]
    );

    return result.rows[0];
  }

  // Get course by ID
  static async getCourseById(courseId: string, userId?: string): Promise<any> {
    const query = `
      SELECT 
        c.*,
        u.first_name || ' ' || u.last_name as tutor_name,
        u.avatar_url as tutor_avatar,
        COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'approved') as enrolled_students,
        COUNT(DISTINCT cm.id) as modules_count,
        ${userId ? `EXISTS(SELECT 1 FROM enrollments WHERE student_id = $2 AND course_id = c.id) as is_enrolled` : 'false as is_enrolled'}
      FROM courses c
      JOIN users u ON u.id = c.tutor_id
      LEFT JOIN enrollments e ON e.course_id = c.id
      LEFT JOIN course_modules cm ON cm.course_id = c.id
      WHERE c.id = $1
      GROUP BY c.id, u.first_name, u.last_name, u.avatar_url
    `;

    const result = await pool.query(query, userId ? [courseId, userId] : [courseId]);

    if (result.rows.length === 0) {
      throw new Error('Course not found');
    }

    return result.rows[0];
  }

  // Get all courses with filters
  static async getCourses(filters: {
    status?: string;
    tutorId?: string;
    contentType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ courses: Course[]; total: number; page: number; totalPages: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (filters.status) {
      whereConditions.push(`c.status = $${paramIndex}`);
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.tutorId) {
      whereConditions.push(`c.tutor_id = $${paramIndex}`);
      params.push(filters.tutorId);
      paramIndex++;
    }

    if (filters.contentType) {
      whereConditions.push(`c.content_type = $${paramIndex}`);
      params.push(filters.contentType);
      paramIndex++;
    }

    if (filters.search) {
      whereConditions.push(`(c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM courses c
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get courses
    const query = `
      SELECT 
        c.*,
        u.first_name || ' ' || u.last_name as tutor_name,
        u.avatar_url as tutor_avatar,
        COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'approved') as enrolled_students
      FROM courses c
      JOIN users u ON u.id = c.tutor_id
      LEFT JOIN enrollments e ON e.course_id = c.id
      ${whereClause}
      GROUP BY c.id, u.first_name, u.last_name, u.avatar_url
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);
    const result = await pool.query(query, params);

    return {
      courses: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Update course
  static async updateCourse(
    courseId: string,
    tutorId: string,
    updates: Partial<CreateCourseDTO>
  ): Promise<Course> {
    // Verify ownership
    const course = await pool.query('SELECT tutor_id FROM courses WHERE id = $1', [
      courseId,
    ]);

    if (course.rows.length === 0) {
      throw new Error('Course not found');
    }

    if (course.rows[0].tutor_id !== tutorId) {
      throw new Error('Unauthorized');
    }

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.title) {
      updateFields.push(`title = $${paramIndex}`);
      values.push(updates.title);
      paramIndex++;

      // Update slug
      const newSlug = slugify(updates.title, { lower: true, strict: true });
      updateFields.push(`slug = $${paramIndex}`);
      values.push(newSlug);
      paramIndex++;
    }

    if (updates.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      values.push(updates.description);
      paramIndex++;
    }

    if (updates.thumbnailUrl !== undefined) {
      updateFields.push(`thumbnail_url = $${paramIndex}`);
      values.push(updates.thumbnailUrl);
      paramIndex++;
    }

    if (updates.level) {
      updateFields.push(`level = $${paramIndex}`);
      values.push(updates.level);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(courseId);

    const query = `
      UPDATE courses
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Publish course
  static async publishCourse(courseId: string, tutorId: string): Promise<void> {
    // Verify ownership
    const course = await pool.query('SELECT tutor_id, status FROM courses WHERE id = $1', [
      courseId,
    ]);

    if (course.rows.length === 0) {
      throw new Error('Course not found');
    }

    if (course.rows[0].tutor_id !== tutorId) {
      throw new Error('Unauthorized');
    }

    // Check if course has content
    const modules = await pool.query(
      'SELECT COUNT(*) as count FROM course_modules WHERE course_id = $1',
      [courseId]
    );

    if (parseInt(modules.rows[0].count) === 0) {
      throw new Error('Cannot publish course without modules');
    }

    await pool.query(
      `UPDATE courses 
       SET status = 'published', published_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [courseId]
    );
  }

  // Delete course
  static async deleteCourse(courseId: string, tutorId: string): Promise<void> {
    const course = await pool.query('SELECT tutor_id FROM courses WHERE id = $1', [
      courseId,
    ]);

    if (course.rows.length === 0) {
      throw new Error('Course not found');
    }

    if (course.rows[0].tutor_id !== tutorId) {
      throw new Error('Unauthorized');
    }

    await pool.query('DELETE FROM courses WHERE id = $1', [courseId]);
  }
}