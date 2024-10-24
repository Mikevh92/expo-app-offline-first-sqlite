import studentRepositoryInterface from '@/domain/interfaces/student/studentRepositoryInterface';
import { IStudent } from '@/domain/types/IStudent';
import { API_BASE_URL } from '../configRepository';
import axios from 'axios';

export default class AxiosStudentRepository implements studentRepositoryInterface{
  async addStudent(dataStudent: IStudent): Promise<IStudent> {
    try{
      const { data } = await axios.post(`${API_BASE_URL}estudiante/add`, 
        {
          id: dataStudent.key,
          name: dataStudent.name,
          matricula: dataStudent.code
        }
      )

      if(data.errors){
        throw data.errors.details;
      }

      return dataStudent;
    }catch(e){
      throw e;
    }
  }
  async getStudent(): Promise<IStudent[]> {
    try{
      const { data } = await axios.get(`${API_BASE_URL}estudiante/`)

      if(data.errors){
        throw data.errors.details;
      }

      const include:Array<any> = data.data.include;
      const response:IStudent[] = [];
      
      for(let i in include){
        response.push({
          key: include[i].id,
          name: include[i].name,
          code: include[i].matricula
        })
      }

      return response;
    }catch(e){
      throw e;
    }
  }
}