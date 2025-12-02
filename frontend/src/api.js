import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Shipment API methods
export const getShipments = (params) => apiClient.get('/shipments', { params });
export const getShipment = (id) => apiClient.get(`/shipments/${id}`);
export const createShipment = (data) => apiClient.post('/shipments', data);
export const updateShipment = (id, data) => apiClient.put(`/shipments/${id}`, data);
export const deleteShipment = (id) => apiClient.delete(`/shipments/${id}`);
export const updateShipmentLocation = (id, coordinates) =>
    apiClient.patch(`/shipments/${id}/location`, { coordinates });
export const getShipmentETA = (id) => apiClient.get(`/shipments/${id}/eta`);

export default {
    getShipments,
    getShipment,
    createShipment,
    updateShipment,
    deleteShipment,
    updateShipmentLocation,
    getShipmentETA,
};

