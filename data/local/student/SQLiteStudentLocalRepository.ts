import studentRepositoryInterface from '@/domain/interfaces/student/studentRepositoryInterface';
import { IStudent } from '@/domain/types/IStudent';
import * as SQLite from 'expo-sqlite';
import { BD_NAME } from '../configRepository';

export default class SQLiteStudentLocalRepository implements studentRepositoryInterface{
  async addStudent(data: IStudent): Promise<IStudent> {
    try{
      const db = await SQLite.openDatabaseAsync(BD_NAME);

      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS student (
          id TEXT PRIMARY KEY NOT NULL, 
          name TEXT NOT NULL, 
          code TEXT NOT NULL
        );
      `);

      await db.runAsync('INSERT INTO student (id, name, code) VALUES (?, ?, ?)', data.key, data.name, data.code);

      return data;
    }catch(e){
      throw e;
    }
  }
  async getStudent(): Promise<IStudent[]> {
    try{
      const db = await SQLite.openDatabaseAsync(BD_NAME);
      const allRows = await db.getAllAsync('SELECT * FROM student') as { id: string, name: string, code: string }[];

      const response: IStudent[] = [];
      for (const row of allRows) {
        response.push({
          key: row.id,
          name: row.name,
          code: row.code,
        });
      }

      return response;
    }catch(e){
      throw e;
    }
  }
}