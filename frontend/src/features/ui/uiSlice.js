import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    showModal: false,
    filterStatus: 'all',
    sortBy: 'newest',
    isDetailsOpen: true,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleModal: (state, action) => {
            state.showModal = action.payload !== undefined ? action.payload : !state.showModal;
        },
        setFilterStatus: (state, action) => {
            state.filterStatus = action.payload;
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        setIsDetailsOpen: (state, action) => {
            state.isDetailsOpen = action.payload;
        },
    },
});

export const { toggleModal, setFilterStatus, setSortBy, setIsDetailsOpen } = uiSlice.actions;
export default uiSlice.reducer;
