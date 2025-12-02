const Shipment = require('../models/Shipment');
const { calculateETA, determineStatus } = require('../utils/etaCalculator');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// ==================== GET ALL SHIPMENTS ====================
exports.getAllShipments = async (req, res) => {
  try {
    const { status, sort } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'eta') {
      sortOption = { currentETA: 1 };
    }

    const shipments = await Shipment.find(query).sort(sortOption).limit(100);

    return successResponse(res, { shipments, count: shipments.length }, `Found ${shipments.length} shipments`);
  } catch (error) {
    console.error('❌ GET /shipments error:', error);
    return errorResponse(res, error);
  }
};

// ==================== GET SINGLE SHIPMENT ====================
exports.getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ shipmentId: req.params.id });

    if (!shipment) {
      return errorResponse(res, 'Shipment not found', 404);
    }

    return successResponse(res, shipment);
  } catch (error) {
    console.error('❌ GET /shipment/:id error:', error);
    return errorResponse(res, error);
  }
};

// ==================== CREATE NEW SHIPMENT ====================
exports.createShipment = async (req, res) => {


  try {
    const { containerId, route, cargo, weight } = req.body;

    if (!containerId) {
      return errorResponse(res, "containerId is required.", 400);
    }

    // Validation is now handled by middleware
    const currentLocation = route[0];
    const finalDestination = route[route.length - 1];



    // Calculate ETA
    const etaData = calculateETA(
      currentLocation.coordinates.lat,
      currentLocation.coordinates.lng,
      finalDestination.coordinates.lat,
      finalDestination.coordinates.lng
    );

    // Create shipment
    const newShipment = new Shipment({
      shipmentId: containerId.toUpperCase(),
      containerId: containerId.toUpperCase(),
      route,
      currentLocation,
      currentETA: etaData.eta,
      origin: currentLocation.name,
      destination: finalDestination.name,
      cargo: cargo || 'General Cargo',
      weight: weight || 0,
      status: 'pending'
    });

    const savedShipment = await newShipment.save();


    return successResponse(
      res,
      savedShipment,
      `Shipment ${savedShipment.shipmentId} created successfully`,
      201
    );

  } catch (error) {
    console.error('❌ CREATE ERROR:', error.message);

    if (error.code === 11000) {
      return errorResponse(res, `Container ID '${req.body.containerId}' already exists.`, 400);
    }

    if (error.name === 'ValidationError') {
      return errorResponse(res, Object.values(error.errors).map(e => e.message).join(', '), 400);
    }

    return errorResponse(res, error.message || 'Server Error', 500);
  }
};

// ==================== UPDATE SHIPMENT ====================
exports.updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { cargo, weight, status } = req.body;

    const shipment = await Shipment.findOne({ shipmentId: id });

    if (!shipment) {
      return errorResponse(res, `Shipment not found: ${id}`, 404);
    }

    // Update only provided fields
    if (cargo !== undefined) shipment.cargo = cargo;
    if (weight !== undefined) shipment.weight = weight;
    if (status !== undefined) shipment.status = status;

    const updatedShipment = await shipment.save();

    console.log(`✅ Shipment ${id} updated`);
    return successResponse(res, updatedShipment, 'Shipment updated successfully');

  } catch (error) {
    console.error('❌ UPDATE ERROR:', error);
    return errorResponse(res, error);
  }
};

// ==================== UPDATE SHIPMENT LOCATION ====================
exports.updateShipmentLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const { id } = req.params;

    // Validation is now handled by middleware
    const shipment = await Shipment.findOne({ shipmentId: id });

    if (!shipment) {
      return errorResponse(res, `Shipment not found: ${id}`, 404);
    }

    console.log(`📍 Updating location for ${id} to [${coordinates.lat}, ${coordinates.lng}]`);

    // Update current location
    shipment.currentLocation = {
      name: 'En Route',
      coordinates: {
        lat: parseFloat(coordinates.lat),
        lng: parseFloat(coordinates.lng)
      },
      timestamp: new Date()
    };

    // Recalculate ETA
    const finalDest = shipment.route[shipment.route.length - 1];
    const etaData = calculateETA(
      coordinates.lat,
      coordinates.lng,
      finalDest.coordinates.lat,
      finalDest.coordinates.lng
    );

    shipment.currentETA = etaData.eta;

    // Update status
    shipment.status = determineStatus(
      coordinates.lat,
      coordinates.lng,
      shipment.route
    );

    const updatedShipment = await shipment.save();

    console.log(`✅ Location updated for ${id}. New status: ${updatedShipment.status}`);

    return successResponse(
      res,
      { shipment: updatedShipment, eta: etaData },
      `Location updated. Status: ${updatedShipment.status}`
    );

  } catch (error) {
    console.error('❌ UPDATE LOCATION ERROR:', error);
    return errorResponse(res, error);
  }
};

// ==================== GET SHIPMENT ETA ====================
exports.getShipmentETA = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ shipmentId: req.params.id });

    if (!shipment) {
      return errorResponse(res, 'Shipment not found', 404);
    }

    const etaData = {
      shipmentId: shipment.shipmentId,
      currentETA: shipment.currentETA,
      currentLocation: shipment.currentLocation,
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.status
    };

    return successResponse(res, etaData);
  } catch (error) {
    console.error('❌ GET ETA ERROR:', error);
    return errorResponse(res, error);
  }
};

// ==================== DELETE SHIPMENT ====================
exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndDelete({ shipmentId: req.params.id });

    if (!shipment) {
      return errorResponse(res, 'Shipment not found', 404);
    }

    console.log(`✅ Shipment ${req.params.id} deleted`);
    return successResponse(res, null, `Shipment ${req.params.id} deleted successfully`);
  } catch (error) {
    console.error('❌ DELETE ERROR:', error);
    return errorResponse(res, error);
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { lat, lng, speed, heading } = req.body;

    const shipment = await Shipment.findOne({ shipmentId });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // 1. Push the OLD current location into history before updating
    shipment.locationHistory.push({
      coordinates: shipment.currentLocation.coordinates,
      timestamp: shipment.currentLocation.timestamp,
      speed: shipment.locationHistory.length > 0 ? shipment.locationHistory.slice(-1)[0].speed : 0,
      heading: 0,
      updatedBy: req.user ? req.user._id : null // If you have auth
    });

    // 2. Update to the NEW location
    shipment.currentLocation = {
      name: `Lat: ${lat}, Lng: ${lng}`, // You could use a reverse geocoding API here to get city name
      coordinates: { lat, lng },
      timestamp: new Date()
    };

    // 3. Update Status automatically if close to destination (e.g., within 10km)
    // (Optional logic you can add later)

    await shipment.save();

    console.log(`📍 Location updated for ${shipmentId}: [${lat}, ${lng}]`);

    return res.status(200).json({
      success: true,
      data: shipment,
      message: 'Location updated successfully'
    });

  } catch (error) {
    console.error('Update Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};