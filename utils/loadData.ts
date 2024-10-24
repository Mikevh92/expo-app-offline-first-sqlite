import StudentRepository from '@/domain/usecases/student/StudentRepository';

export const loadData = async () => {
  try{
    const studentRepository = new StudentRepository();
    const response = await studentRepository.getStudent();

    return response;
  }catch(e){
    console.log(e)
  }
}