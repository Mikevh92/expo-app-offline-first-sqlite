import { IStudent } from "@/domain/types/IStudent";

export default class studentRepositoryInterface {
  addStudent(data:IStudent):Promise<IStudent>{
    throw new Error('Method not implemented');
  }
  getStudent():Promise<IStudent[]>{
    throw new Error('Method not implemented');
  }
}