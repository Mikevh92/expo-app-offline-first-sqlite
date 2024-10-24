import studentRepositoryInterface from '@/domain/interfaces/student/studentRepositoryInterface';
import AxiosStudentRepository from '@/data/repository/student/AxiosStudentRepository';
import SQLiteStudentLocalRepository from '@/data/local/student/SQLiteStudentLocalRepository';
import SQLiteOperationQueueLocalRepository from '@/data/local/operationQueue/SQLiteOperationQueueLocalRepository';
import { IStudent } from '@/domain/types/IStudent';
import NetInfo from '@react-native-community/netinfo';

export default class StudentRepository implements studentRepositoryInterface {
  async addStudent(data: IStudent): Promise<IStudent> {
    try{
      const state = await NetInfo.fetch();
      const sqliteStudentLocalRepository = new SQLiteStudentLocalRepository();
      await sqliteStudentLocalRepository.addStudent(data);


      const sqliteOperationQueueLocalRepository = new SQLiteOperationQueueLocalRepository();
      if(state.isConnected){
        try{
          const axiosStudentRepository = new AxiosStudentRepository();
          await axiosStudentRepository.addStudent(data);
        }catch(e){
          await sqliteOperationQueueLocalRepository.addOperation({
            type: "student",
            data: JSON.stringify(data)
          })
        }
      }else{
        await sqliteOperationQueueLocalRepository.addOperation({
          type: "student",
          data: JSON.stringify(data)
        })
      }

      return data;
    }catch(e){
      throw e;
    }
  }
  async getStudent(): Promise<IStudent[]> {
    try{
      const state = await NetInfo.fetch();
      const sqliteStudentLocalRepository = new SQLiteStudentLocalRepository();
      let responseData = await sqliteStudentLocalRepository.getStudent();
      
      const localIds = new Set(responseData.map(item => item.key));

      if(state.isConnected){
        try{
          /**
           * se obtiene los datos remotos
           */
          const axiosStudentRepository = new AxiosStudentRepository();
          const remoteRs = await axiosStudentRepository.getStudent();

          /**
           * se filtra los datos que no estan en el local
           */
          const remoteNotInLocal = remoteRs.filter(remoteItem => !localIds.has(remoteItem.key));

          /**
           * si hay datos se procede a agregarlos a la bd local
           */
          if(remoteNotInLocal.length > 0){
            remoteNotInLocal.map(e => {
              responseData.push(e)
            })
          
            const promisesNotInLocal = remoteNotInLocal.map(e => sqliteStudentLocalRepository.addStudent(e))
            await Promise.all(promisesNotInLocal);
          }

          /**
           * se obtienen los datos de la lista pendiente por subir
           */
          const sqliteOperationQueueLocalRepository = new SQLiteOperationQueueLocalRepository();
          const operationQueue = await sqliteOperationQueueLocalRepository.getQueue("student");

          /** 
           * si hay datos se manda a la api
           */
          if(operationQueue.length > 0){
            for(let i in operationQueue){
              await axiosStudentRepository.addStudent(JSON.parse(operationQueue[i].data));
              await sqliteOperationQueueLocalRepository.removeOperation(operationQueue[i].key);
            }
          }
        }catch(e){
          console.log('error de red', e)
        }
      }

      return responseData;
    }catch(e){
      throw e;
    }
  }
}