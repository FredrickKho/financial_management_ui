import { configureStore } from "@reduxjs/toolkit";
import authReducer from './reducers/auth'
import uiReducer from './reducers/ui'
import { useDispatch, useSelector } from 'react-redux';

const store = configureStore({
    reducer:{
        auth:authReducer,
        ui:uiReducer
    }
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
export default store;