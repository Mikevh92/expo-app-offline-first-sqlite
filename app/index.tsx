import { useState } from 'react'
import { Text, View, FlatList, StyleSheet } from "react-native";
import { Input, Button, ListItem } from '@rneui/base';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { IStudent } from '@/domain/types/IStudent';
import { RootState } from '@/redux/store';
import { addStudentState } from '@/redux/slices/studentSlices';
import StudentRepository from '@/domain/usecases/student/StudentRepository';
import useData from '@/hooks/useData';
import uuid from 'react-native-uuid';

export default function Index() {
  useData();
  const dispatch = useDispatch();
  const studentList = useSelector((state:RootState) => state.student.studentList);;
  const [initialValues, setInitialValues] = useState<IStudent>({
    key: '',
    name: '',
    code: ''
  });

  const handleSubmit = async (values: IStudent) => {
    try{
      const id = String(uuid.v4());
      const studentRepository = new StudentRepository();
      const response = await studentRepository.addStudent({
        ...values,
        key: id
      });

      dispatch(addStudentState(response));
    }catch(e){
      console.log(e)
    }
  }

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting, values, errors })=>(
          <View>
            <Input
              placeholder='Matricula'
              label='Matricula'
              onChangeText={handleChange('code')}
              onBlur={handleBlur('code')}
              value={values.code}
              errorMessage={errors.code}
            />
            <Input
              placeholder='Nombre'
              label='Nombre'
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              errorMessage={errors.name}
            />
            <Button
              title='Guardar'
              onPress={() => handleSubmit()}
            />
          </View>
        )}
      </Formik>
      <View style={{ marginTop: 20 }}>
        <FlatList
          data={studentList}
          renderItem={({ item }) => (
            <ListItem key={item.key}>
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{`Matricula: ${item.code}`}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  }
})