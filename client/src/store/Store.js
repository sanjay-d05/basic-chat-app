import { combineReducers,configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import socketSlice from './socketSlice';
import chatSlice from './chatSlice';

import {
    persistReducer ,
    FLUSH,
    REHYDRATE ,
    PAUSE ,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key:'chat',
    version:1,
    storage
}

const rootReducers = combineReducers({
    auth:authSlice,
    socket:socketSlice,
    chats:chatSlice
})

const persistedReducer = persistReducer(persistConfig,rootReducers)

const store = configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck:{
                ignoreActions:[FLUSH,REHYDRATE,PAUSE,PURGE,PERSIST,REGISTER],
            },
        }),
})

export default store;