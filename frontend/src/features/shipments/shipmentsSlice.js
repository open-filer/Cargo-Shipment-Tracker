import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async Thunks
export const fetchShipments = createAsyncThunk('shipments/fetchShipments', async () => {
    const response = await axios.get(`${API_URL}/shipments`);
    return response.data.data.shipments || response.data.data || [];
});

export const createShipment = createAsyncThunk('shipments/createShipment', async (shipmentData) => {
    const response = await axios.post(`${API_URL}/shipment`, shipmentData);
    return response.data.data; // Assuming API returns the created shipment in data
});

export const updateLocation = createAsyncThunk('shipments/updateLocation', async ({ id, coordinates }) => {
    const response = await axios.post(`${API_URL}/shipment/${id}/update-location`, { coordinates });
    return response.data.data.shipment || response.data.data;
});

export const deleteShipment = createAsyncThunk('shipments/deleteShipment', async (id) => {
    await axios.delete(`${API_URL}/shipments/${id}`);
    return id;
});

const shipmentsSlice = createSlice({
    name: 'shipments',
    initialState: {
        items: [],
        selectedId: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        setSelectedId: (state, action) => {
            state.selectedId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Shipments
            .addCase(fetchShipments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchShipments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchShipments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Create Shipment
            .addCase(createShipment.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Update Location
            .addCase(updateLocation.fulfilled, (state, action) => {
                const index = state.items.findIndex(s => s.shipmentId === action.payload.shipmentId);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete Shipment
            .addCase(deleteShipment.fulfilled, (state, action) => {
                state.items = state.items.filter(s => s.shipmentId !== action.payload);
                if (state.selectedId === action.payload) {
                    state.selectedId = null;
                }
            });
    },
});

export const { setSelectedId } = shipmentsSlice.actions;

export const selectAllShipments = (state) => state.shipments.items;
export const selectShipmentById = (state, shipmentId) => state.shipments.items.find(s => s.shipmentId === shipmentId);
export const selectSelectedShipment = (state) => state.shipments.items.find(s => s.shipmentId === state.shipments.selectedId);

export default shipmentsSlice.reducer;
