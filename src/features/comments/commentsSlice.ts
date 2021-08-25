import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async () => {
    const data = await fetch(
      `http://localhost:3001/comments?_limit=10`
    ).then((res) => res.json());
    const tags = data.reduce((prev: any, curr: any) => [...prev, curr.tags], []).flat();
    const likes = data.reduce((prev: any, curr: any) => [...prev, curr.likes], []).flat();
    const comments = data.map(({id, body}: any) => ({id, body}));
    return {
      comments,
      likes,
      tags,
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (id: number) => {
    await fetch(
      `http://localhost:3001/comments/${id}`, {
        method: 'DELETE'
      }
    );
    return id;
  }
);

export const patchComment = createAsyncThunk(
  'comments/patchComment',
  async ({id, newObj}: any) => {
    await fetch(
      `http://localhost:3001/comments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(newObj)
      }
    ).then((res) => res.json());
    return { id, changes: newObj };
  }
);

const commentsAdapter = createEntityAdapter({
  selectId: (comment: any) => comment.id,
});

const likesAdapter = createEntityAdapter({
  selectId: (like: any) => like.id,
});

const tagsAdapter = createEntityAdapter({
  selectId: (tag: any) => tag.id,
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState: commentsAdapter.getInitialState({ 
    loading: false,
    tags: tagsAdapter.getInitialState(),
    likes: likesAdapter.getInitialState(), 
  }),
  reducers: {
    setAllComments: commentsAdapter.setAll,
    setOneComments: commentsAdapter.addOne,
    setManyComments: commentsAdapter.addMany,
    updateOneComment: commentsAdapter.updateOne,
    removeLikes: (state) => {
      likesAdapter.removeAll(state.likes);
    },
    removeTagById: (state, {payload: tagId}: any) => {
      tagsAdapter.removeOne(state.tags, tagId);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, { payload }: any) => {
        state.loading = false;
        commentsAdapter.setAll(state, payload.comments);
        likesAdapter.setAll(state.likes, payload.likes);
        tagsAdapter.setAll(state.tags, payload.tags);
      })
      .addCase(fetchComments.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComment.fulfilled, (state, { payload: id }: any) => {
        state.loading = false;
        commentsAdapter.removeOne(state, id);
      })
      .addCase(deleteComment.rejected, (state) => {
        state.loading = false;
      })
      .addCase(patchComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(patchComment.fulfilled, (state, { payload: { id, changes } }) => {
        state.loading = false;
        commentsAdapter.updateOne(state, {id, changes})
      })
      .addCase(patchComment.rejected, (state) => {
        state.loading = false;
      })
  },
});

export const {
  setAllComments,
  setOneComments,
  setManyComments,
  updateOneComment,
  removeLikes,
  removeTagById,
} = commentsSlice.actions;

export const commentsSelectors = commentsAdapter.getSelectors(
  (state: RootState) => state.comments
);

export const likesSelectors = likesAdapter.getSelectors(
  (state: RootState) => state.comments.likes
)

export const tagsSelectors = tagsAdapter.getSelectors(
  (state: RootState) => state.comments.tags
)

export default commentsSlice.reducer;