import { configureStore } from '@reduxjs/toolkit';
import shipmentsReducer from '../features/shipments/shipmentsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
    reducer: {
        shipments: shipmentsReducer,
        ui: uiReducer,
    },
});
