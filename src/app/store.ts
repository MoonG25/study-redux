import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import comments from '../features/comments/commentsSlice';
import counter from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    comments,
    counter,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
