import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import StudentRepository from '@/domain/usecases/student/StudentRepository';
import { setStudentStateList } from '@/redux/slices/studentSlices';

export default function useData() {
  const dispatch = useDispatch();
  const load = async () => {
    try{
      const studentRepository = new StudentRepository();
      const response = await studentRepository.getStudent();

      dispatch(setStudentStateList(response));
    }catch(e){
      console.log(e)
    }
  }

  useEffect(()=>{
    load()
  }, [])
}