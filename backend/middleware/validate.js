/**
 * Validation Middleware
 * Handles input validation before reaching controllers
 */

const { validationErrorResponse } = require('../utils/responseHelper');

/**
 * Validate shipment creation request
 */
exports.validateCreateShipment = (req, res, next) => {
    const { containerId, route } = req.body;
    const errors = [];

    // Validate container ID
    if (!containerId || typeof containerId !== 'string' || containerId.trim() === '') {
        errors.push('Container ID is required and must be a non-empty string');
    }

    // Validate route
    if (!route || !Array.isArray(route)) {
        errors.push('Route is required and must be an array');
    } else if (route.length < 2) {
        errors.push('Route must contain at least 2 locations (origin and destination)');
    } else {
        // Validate each location in route
        route.forEach((loc, index) => {
            if (!loc.name || typeof loc.name !== 'string') {
                errors.push(`Route location ${index + 1}: name is required`);
            }
            if (!loc.coordinates) {
                errors.push(`Route location ${index + 1}: coordinates are required`);
            } else {
                if (typeof loc.coordinates.lat !== 'number' || isNaN(loc.coordinates.lat)) {
                    errors.push(`Route location ${index + 1}: latitude must be a valid number`);
                }
                if (typeof loc.coordinates.lng !== 'number' || isNaN(loc.coordinates.lng)) {
                    errors.push(`Route location ${index + 1}: longitude must be a valid number`);
                }
                // Validate coordinate ranges
                if (loc.coordinates.lat < -90 || loc.coordinates.lat > 90) {
                    errors.push(`Route location ${index + 1}: latitude must be between -90 and 90`);
                }
                if (loc.coordinates.lng < -180 || loc.coordinates.lng > 180) {
                    errors.push(`Route location ${index + 1}: longitude must be between -180 and 180`);
                }
            }
        });
    }

    if (errors.length > 0) {
        return validationErrorResponse(res, errors);
    }

    next();
};

/**
 * Validate location update request
 */
exports.validateUpdateLocation = (req, res, next) => {
    const { coordinates } = req.body;
    const errors = [];

    if (!coordinates) {
        errors.push('Coordinates are required');
    } else {
        if (typeof coordinates.lat !== 'number' || isNaN(coordinates.lat)) {
            errors.push('Latitude must be a valid number');
        } else if (coordinates.lat < -90 || coordinates.lat > 90) {
            errors.push('Latitude must be between -90 and 90');
        }

        if (typeof coordinates.lng !== 'number' || isNaN(coordinates.lng)) {
            errors.push('Longitude must be a valid number');
        } else if (coordinates.lng < -180 || coordinates.lng > 180) {
            errors.push('Longitude must be between -180 and 180');
        }
    }

    if (errors.length > 0) {
        return validationErrorResponse(res, errors);
    }

    next();
};

/**
 * Validate shipment ID parameter
 */
exports.validateShipmentId = (req, res, next) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string' || id.trim() === '') {
        return validationErrorResponse(res, 'Valid shipment ID is required');
    }

    next();
};

/**
 * Validate shipment update request (for PUT)
 */
exports.validateUpdateShipment = (req, res, next) => {
    const { cargo, weight, status } = req.body;
    const errors = [];

    // All fields are optional for update, but validate if provided
    if (cargo !== undefined && (typeof cargo !== 'string' || cargo.trim() === '')) {
        errors.push('Cargo must be a non-empty string if provided');
    }

    if (weight !== undefined && (typeof weight !== 'number' || weight < 0)) {
        errors.push('Weight must be a positive number if provided');
    }

    const validStatuses = ['pending', 'in-transit', 'delayed', 'delivered', 'cancelled'];
    if (status !== undefined && !validStatuses.includes(status)) {
        errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    if (errors.length > 0) {
        return validationErrorResponse(res, errors);
    }

    next();
};
