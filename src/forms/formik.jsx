import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';

export default function AllAboutFormik() {
  const [user, setUser] = useState('');
  useEffect(() => {
    async function getUser() {
      const { data } = await axios.get('http://localhost:3006/users');
      const _user = _.head(data);
      setUser(_user);
      console.log({ _user });
    }
    getUser();
  }, []);

  const validationSchema = yup.object({
    firstName: yup.string().required('Required'),
    lastName: yup.string().required('Required'),
  });
  const onSubmit = (values) => {
    console.log('filter onSubmit', values);
  };
  const initialValues = {
    firstName: 'ak',
    lastName: '',
    language: '',
    details: '',
    phoneNumbers: ['343434'],
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize={true}
    >
      <Form>
        <div>
          <label htmlFor="firstName">firstName</label>
          <Field type="text" name="firstName" id="firstName" />
          <ErrorMessage name="firstName" />
        </div>
        <div>
          <label htmlFor="lastName">lastName</label>
          <Field type="text" name="lastName" id="lastName" />
          <ErrorMessage name="lastName" />
        </div>
        <div>
          <label htmlFor="language">Language</label>
          <Field as="select" name="language">
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Dutch">Dutch</option>
          </Field>
          <ErrorMessage name="language" />
        </div>
        <div>
          <label htmlFor="details">Details</label>
          <Field
            type="textarea"
            name="details"
            id="details"
            cols="30"
            rows="10"
          />
          <ErrorMessage name="details" />
        </div>
        <div>
          <label htmlFor="phoneNumbers"> Phone Numbers</label>
          <FieldArray name="phoneNumbers">
            {(fieldArrayProps) => {
              const { push, remove, form } = fieldArrayProps;
              const { values } = form;
              const { phoneNumbers } = values;
              return (
                <div>
                  <button type="button" onClick={() => push()}>
                    +
                  </button>
                  {phoneNumbers.map((phoneNumber, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px' }}>
                      <Field name={`phoneNumbers[${index}]`} />
                      <button type="button" onClick={() => remove(index)}>
                        -
                      </button>
                    </div>
                  ))}
                </div>
              );
            }}
          </FieldArray>
        </div>
        <button type="submit">Submit </button>
      </Form>
    </Formik>
  );
}
