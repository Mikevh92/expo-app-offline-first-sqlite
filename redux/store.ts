import { configureStore } from '@reduxjs/toolkit';
import studentSlices from './slices/studentSlices';

const store = configureStore({
  reducer: {
    student: studentSlices
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store