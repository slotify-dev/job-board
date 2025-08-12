import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

export interface FileUploadResponse {
  success: boolean;
  fileUrl?: string;
  filename?: string;
  originalName?: string;
  size?: number;
  message?: string;
}

export class UploadController {
  async uploadResume(req: Request, res: Response<FileUploadResponse>) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      // Validate file exists on disk
      if (!fs.existsSync(req.file.path)) {
        return res.status(500).json({
          success: false,
          message: 'File upload failed',
        });
      }

      // Create file URL (relative path for serving)
      const fileUrl = `/uploads/resumes/${req.file.filename}`;

      return res.status(201).json({
        success: true,
        fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        message: 'Resume uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      return res.status(500).json({
        success: false,
        message: 'File upload failed',
      });
    }
  }

  async serveResume(req: Request, res: Response) {
    try {
      const { filename } = req.params;
      const { download } = req.query;

      if (!filename) {
        return res.status(400).json({
          success: false,
          message: 'Filename required',
        });
      }

      const filePath = path.join(process.cwd(), 'uploads', 'resumes', filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found',
        });
      }

      // Get file stats
      const stats = fs.statSync(filePath);
      const mimeType = mime.lookup(filePath) || 'application/octet-stream';

      // Set appropriate headers
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Length', stats.size);

      if (download === 'true') {
        // Force download
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${filename}"`,
        );
      } else {
        // Inline viewing (for PDFs in iframe)
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      }

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Error serving resume:', error);
      return res.status(500).json({
        success: false,
        message: 'File serving failed',
      });
    }
  }

  async deleteResume(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const { filename } = req.params;

      if (!filename) {
        return res.status(400).json({
          success: false,
          message: 'Filename required',
        });
      }

      const filePath = path.join(process.cwd(), 'uploads', 'resumes', filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found',
        });
      }

      // Delete file
      fs.unlinkSync(filePath);

      return res.json({
        success: true,
        message: 'Resume deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting resume:', error);
      return res.status(500).json({
        success: false,
        message: 'File deletion failed',
      });
    }
  }
}
