import React, { useCallback, useEffect } from 'react';
import { Button } from 'rsuite';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { commentsSelectors, deleteComment, fetchComments, likesSelectors, patchComment, removeLikes, removeTagById, tagsSelectors, updateOneComment } from './commentsSlice';
import Comment from './components/Comment';

/*
  useDispatch가 아닌 useAppDispatch를 사용하는 이유

  타입스크립트 환경에서 createAsyncThunk에 then을 적용하려고 했는데 안됨

*/

const Comments = () => {
  const dispatch = useAppDispatch();
  const total = useAppSelector(commentsSelectors.selectTotal)
  const allComments = useAppSelector(commentsSelectors.selectAll)
  const allNestedLikes = useAppSelector(likesSelectors.selectAll)
  const allNestedTags = useAppSelector(tagsSelectors.selectAll)
  const onDelete = useCallback((id: number) => dispatch(deleteComment(id)), []);
  const onPatch = useCallback((id: number, newObj: any) => dispatch(patchComment({id, newObj})), []);
  const onUpdate = useCallback((id: number, newObj: any) => dispatch(updateOneComment({id, changes: newObj})), []);

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  console.log('allNestedLIkes', allNestedLikes);
  console.log('allNestedTags', allNestedTags);
  return (
    <React.Fragment>
      <Button color="yellow" size="lg" onClick={() => dispatch(removeLikes())}>
        DELETE ALL LIKES
      </Button>
      <Button color="blue" size="lg" onClick={() => dispatch(removeTagById("c41b3774-8aca-4fca-bc6d-3d4172eccd90"))}>
        REMOVE TAGS BY ID
      </Button>
      {
        allComments.map(({id, body}: any) => 
          <Comment 
            key={id} 
            id={id}
            body={body} 
            onDelete={onDelete} 
            onPatch={onPatch} 
            onUpdate={onUpdate}
          />
        )
      }
    </React.Fragment>
  )
}

export default Comments;