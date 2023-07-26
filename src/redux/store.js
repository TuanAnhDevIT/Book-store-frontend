import { combineReducers, configureStore } from '@reduxjs/toolkit';
import counterReducer from '../redux/counter/counterSlice';
import accountReducer from '../redux/account/accountSlice';

// https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['account'] //account will not be persisted
}

//tra google: redux toolkit rootReducer
const rootReducer = combineReducers({
  counter: counterReducer,
  account: accountReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export { store, persistor };

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//     account: accountReducer
//   },
// });