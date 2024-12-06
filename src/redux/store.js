import { applyMiddleware } from 'redux';
import { configureStore, Tuple } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { thunk } from 'redux-thunk';
import rootReducer from './reducer';

const middleware = [thunk];

// const store = configureStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));
const store = configureStore({
  reducer: rootReducer,
  middleware: () => new Tuple(...middleware),
});
export default store;
