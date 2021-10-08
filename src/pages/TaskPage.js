import React, { useContext, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { FETCH_TASKS_QUERY } from '../util/graphql';
const { useState } = React

function TaskPage() {
    const { user } = useContext(AuthContext);
    const { loading, data } = useQuery(FETCH_TASKS_QUERY, {
      pollInterval: 100
    });

    const [idValue, setIdValues] = useState({
      taskId: "",
    });

    const [deleteTask, { del_error }] = useMutation(DELETE_TASK_MUTATION, {
      update(proxy, result) {
        const data = proxy.readQuery({
          query: FETCH_TASKS_QUERY
        })
        data.getTasks = data.getTasks.filter(t => t.id !== idValue.taskId);
        proxy.writeQuery({ query: FETCH_TASKS_QUERY, data });
      },
      onError(err) {
        console.log("del_error")
        console.log(del_error)
      },
      variables: { taskId: idValue.taskId }
    });
    
    const onDelete = (taskId) => {
      setIdValues({ taskId: taskId })
    }
  
    useEffect(() => {
      deleteTask();
    }, [idValue]);

    if (loading) {
        return <h1>Loading..</h1>    
    }
    // console.log(data)
    const tasks = data.getTasks
    return (
    <Grid columns={2}>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <TaskForm />
          </Grid.Column>
        )}
      </Grid.Row>
      <Grid.Row>
        <Transition.Group>
        {loading ? (<h1>Loading...</h1>) : user && (tasks && tasks.filter((t) => (t.username === user.username))).map((t) =>(
          <Grid.Column key={t.id} style={{ marginBottom: 20 }}>
            <TaskCard task={t} onDelete={onDelete}/>
          </Grid.Column>
        ))}
        </Transition.Group>
      </Grid.Row>
    </Grid>
    );
}

const DELETE_TASK_MUTATION = gql`
    mutation deleteTask(
        $taskId: ID!
    ){
      deleteTask(
        taskId: $taskId
      )
    }

`;

export default TaskPage