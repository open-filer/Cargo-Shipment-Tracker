const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const {
    validateCreateShipment,
    validateUpdateLocation,
    validateShipmentId,
    validateUpdateShipment
} = require('../middleware/validate');

console.log("✅ Shipment routes loaded");

// ==================== SHIPMENT ROUTES (RESTful) ====================

// GET /api/shipments - Get all shipments with optional filters
router.get('/shipments', shipmentController.getAllShipments);

// POST /api/shipments - Create a new shipment
router.post('/shipments', validateCreateShipment, shipmentController.createShipment);

// GET /api/shipments/:id - Get a single shipment by ID
router.get('/shipments/:id', validateShipmentId, shipmentController.getShipmentById);

// PUT /api/shipments/:id - Update shipment details
router.put('/shipments/:id', validateShipmentId, validateUpdateShipment, shipmentController.updateShipment);

// DELETE /api/shipments/:id - Delete a shipment
router.delete('/shipments/:id', validateShipmentId, shipmentController.deleteShipment);

// PATCH /api/shipments/:id/location - Update shipment location
router.patch('/shipments/:id/location', validateShipmentId, validateUpdateLocation, shipmentController.updateShipmentLocation);

// GET /api/shipments/:id/eta - Get shipment ETA
router.get('/shipments/:id/eta', validateShipmentId, shipmentController.getShipmentETA);

// ==================== LEGACY ROUTES (Deprecated - for backward compatibility) ====================
// TODO: Remove these after frontend is updated

router.get('/shipment/:id', validateShipmentId, shipmentController.getShipmentById);
router.post('/shipment', validateCreateShipment, shipmentController.createShipment);
router.post('/shipment/:id/update-location', validateShipmentId, validateUpdateLocation, shipmentController.updateShipmentLocation);
router.get('/shipment/:id/eta', validateShipmentId, shipmentController.getShipmentETA);

module.exports = router;
