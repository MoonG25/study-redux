import React, { memo } from 'react';
import { Panel, Button, ButtonToolbar } from 'rsuite';

type CommentProps = {
  id: number;
  body: string;
  onDelete: Function;
  onPatch: Function;
  onUpdate: Function;
}

const Comment = ({
  id,
  body, 
  onDelete, 
  onPatch,
  onUpdate,
}: CommentProps) => {
  return (
    <Panel header={id} bordered style={{margin:20}}>
      {body}
      <ButtonToolbar style={{marginTop:20}}>
        <Button size="lg" color="red" onClick={() => onDelete(id)}>Delete</Button>
        <Button size="lg" color="cyan" onClick={() => onPatch(id, {body: 'NEW TEXT'})}>Patch</Button>
      </ButtonToolbar>
    </Panel>
  )
}

export default memo(Comment);