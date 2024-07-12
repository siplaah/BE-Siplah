import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
  async saveFile(attachment: any): Promise<string> {
    try {
      const { filename, content } = attachment;
      const decodedFileContent = Buffer.from(content, 'base64');
      const filePath = `./uploads/${filename}`; // Ganti dengan path yang sesuai di server Anda
      fs.writeFileSync(filePath, decodedFileContent);
      return filePath; // Return path file yang disimpan untuk disimpan di database atau digunakan di tempat lain
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }
}
