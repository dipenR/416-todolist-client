import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../util/hooks';
import { FETCH_TASKS_QUERY } from '../util/graphql';

const { useState } = React

function TaskForm() {
  const { values, onChange, onSubmit } = useForm(createTaskCallback, {
    title: ''
  });
  
  const [errors, setErrors] = useState({})

  const [createTask, { error }] = useMutation(CREATE_TASK_MUTATION, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_TASKS_QUERY
      });
      data.getTasks = [result.data.createTask, ...data.getTasks];
      proxy.writeQuery({ query: FETCH_TASKS_QUERY, data });
      values.title = "";
    },
    onError(error) {
      console.log(errors)
      setErrors(error.graphQLErrors[0].extensions.errors);
    },
    variables: {title: values.title }
  });

  function createTaskCallback() {
    createTask();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a task</h2>
        <Form.Field >
          <Form.Input
            placeholder="Task"
            name="title"
            onChange={onChange}
            value={values.title}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Add
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_TASK_MUTATION = gql`
  mutation createTask($title: String!) {
    createTask(title: $title) {
      id
      title
      username
    }
  }
`;

export default TaskForm;
