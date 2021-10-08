import React from 'react';
import { Card, Button } from 'semantic-ui-react';


function TaskCard(props) {
  const { id, title } = props.task
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>{title}</Card.Header>
      </Card.Content>
      <Card.Content extra>
      <Button onClick={() => {props.onDelete(id)}}> Delete </Button>
      </Card.Content>
    </Card>
  );
}



export default TaskCard;
