import { IStudent } from '@/domain/types/IStudent';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type initialState = {
  studentList: IStudent[],
}

const initialState:initialState = {
  studentList: [], 
}

export const studentSlices = createSlice({
  name: "studentSlices",
  initialState: initialState,
  reducers: {
    setStudentStateList: (state, action:PayloadAction<IStudent[]>) => {
      state.studentList = action.payload
    },
    addStudentState: (state, action:PayloadAction<IStudent>) => {
      state.studentList.unshift(action.payload)
    },
  }
})

export const {
  setStudentStateList,
  addStudentState
} = studentSlices.actions
export default studentSlices.reducer