import * as SQLite from 'expo-sqlite';
import { BD_NAME } from '../configRepository';

export type SQLiteOperationQueueLocalRepositoryProps = {
  type: types;
  data: string;
}

type SQLiteOperationQueueLocalRepositoryPropsWithKey = SQLiteOperationQueueLocalRepositoryProps & {
  key: number;
}

export type types = "student";

export default class SQLiteOperationQueueLocalRepository {
  async addOperation(data: SQLiteOperationQueueLocalRepositoryProps): Promise<void> {
    try{
      const db = await SQLite.openDatabaseAsync(BD_NAME);

      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS operation_queue (
          key INTEGER PRIMARY KEY NOT NULL, 
          type TEXT NOT NULL,
          data TEXT NOT NULL
        );
      `);

      await db.runAsync('INSERT INTO operation_queue (type, data) VALUES (?, ?)', data.type, data.data);
    }catch(e){
      throw e;
    }
  }
  async removeOperation(keyOperation: number): Promise<void> {
    try{
      const db = await SQLite.openDatabaseAsync(BD_NAME);
      await db.runAsync('DELETE FROM operation_queue WHERE key=?', keyOperation);
    }catch(e){
      throw e;
    }
  }
  async clearQueue():Promise<void>{
    try{
      const db = await SQLite.openDatabaseAsync(BD_NAME);
      await db.execAsync('DELETE FROM operation_queue');
    }catch(e){
      throw e;
    }
  }
  async getQueue(type:types):Promise<SQLiteOperationQueueLocalRepositoryPropsWithKey[]>{
    try{
      const db = await SQLite.openDatabaseAsync(BD_NAME);
      const response = await db.getAllAsync('SELECT * FROM operation_queue WHERE type=?', type) as SQLiteOperationQueueLocalRepositoryPropsWithKey[];

      return response;
    }catch(e){
      throw e;
    }
  }
}