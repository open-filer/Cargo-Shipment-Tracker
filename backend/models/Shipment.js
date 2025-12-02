const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  // --- 1. CORE IDENTIFIERS ---
  shipmentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  // This was missing before, causing your E11000 null error
  containerId: {
    type: String,
    required: [true, 'Container ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },

  // --- 2. BASIC SHIPMENT INFO (From your Controller) ---
  cargo: {
    type: String,
    default: 'General Cargo'
  },

  weight: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ['pending', 'in-transit', 'delayed', 'delivered', 'cancelled', 'held'],
    default: 'pending',
    index: true // Indexed for fast filtering by status
  },

  origin: { type: String },
  destination: { type: String },

  // --- 3. ROUTE & LOCATION TRACKING ---

  // The current active location
  currentLocation: {
    name: String,
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    timestamp: { type: Date, default: Date.now }
  },

  // The full planned path
  route: [{
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    status: { type: String, enum: ['upcoming', 'passed', 'current'], default: 'upcoming' },
    estimatedArrival: Date
  }],

  // Historical breadcrumbs
  locationHistory: [{
    coordinates: {
      lat: Number,
      lng: Number
    },
    timestamp: { type: Date, default: Date.now },
    speed: Number, // knots or km/h
    heading: Number, // degrees
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],

  // --- 4. TIMING & ETA ---
  currentETA: Date, // Calculated dynamically in your controller
  estimatedDepartureTime: Date,
  actualDepartureTime: Date,
  estimatedArrivalTime: Date,
  actualArrivalTime: Date,

  // --- 5. NOTIFICATIONS & ALERTS ---
  notifications: [{
    type: { type: String, enum: ['delay', 'arrival', 'departure', 'warning', 'info'] },
    message: String,
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],

  delays: [{
    reason: String,
    duration: Number, // in hours
    startTime: Date,
    endTime: Date,
    location: { lat: Number, lng: Number }
  }],

  weatherConditions: [{
    location: { lat: Number, lng: Number },
    condition: String,
    temperature: Number,
    windSpeed: Number,
    timestamp: { type: Date, default: Date.now }
  }],

  // --- 6. CONTAINER & SPECS ---
  containerDetails: {
    type: { type: String, enum: ['20ft', '40ft', '40ft-HC', 'reefer', 'open-top'] },
    temperature: Number, // For reefer containers
    humidity: Number,
    sealNumber: String,
    maxWeight: Number
  },

  // --- 7. LEGAL & DOCUMENTS ---
  documents: [{
    name: String,
    url: String, // S3 or Cloudinary URL
    type: String, // e.g., 'Bill of Lading', 'Invoice'
    uploadedAt: { type: Date, default: Date.now }
  }],

  customs: {
    clearanceStatus: { type: String, enum: ['pending', 'cleared', 'held', 'rejected'], default: 'pending' },
    clearanceDate: Date,
    brokerName: String,
    documents: [String]
  },

  deliveryProof: {
    signature: String, // Base64 or URL
    photos: [String], // Array of image URLs
    receivedBy: String,
    notes: String,
    timestamp: Date
  },

  // --- 8. USERS & RELATIONSHIPS ---
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Driver or Logistics Manager
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Client

  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  }

const mongoose = require('mongoose');

  const shipmentSchema = new mongoose.Schema({
    // --- 1. CORE IDENTIFIERS ---
    shipmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    // This was missing before, causing your E11000 null error
    containerId: {
      type: String,
      required: [true, 'Container ID is required'],
      unique: true,
      uppercase: true,
      trim: true
    },

    // --- 2. BASIC SHIPMENT INFO (From your Controller) ---
    cargo: {
      type: String,
      default: 'General Cargo'
    },

    weight: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ['pending', 'in-transit', 'delayed', 'delivered', 'cancelled', 'held'],
      default: 'pending',
      index: true // Indexed for fast filtering by status
    },

    origin: { type: String },
    destination: { type: String },

    // --- 3. ROUTE & LOCATION TRACKING ---

    // The current active location
    currentLocation: {
      name: String,
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      },
      timestamp: { type: Date, default: Date.now }
    },

    // The full planned path
    route: [{
      name: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      status: { type: String, enum: ['upcoming', 'passed', 'current'], default: 'upcoming' },
      estimatedArrival: Date
    }],

    // Historical breadcrumbs
    locationHistory: [{
      coordinates: {
        lat: Number,
        lng: Number
      },
      timestamp: { type: Date, default: Date.now },
      speed: Number, // knots or km/h
      heading: Number, // degrees
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],

    // --- 4. TIMING & ETA ---
    currentETA: Date, // Calculated dynamically in your controller
    estimatedDepartureTime: Date,
    actualDepartureTime: Date,
    estimatedArrivalTime: Date,
    actualArrivalTime: Date,

    // --- 5. NOTIFICATIONS & ALERTS ---
    notifications: [{
      type: { type: String, enum: ['delay', 'arrival', 'departure', 'warning', 'info'] },
      message: String,
      timestamp: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }],

    delays: [{
      reason: String,
      duration: Number, // in hours
      startTime: Date,
      endTime: Date,
      location: { lat: Number, lng: Number }
    }],

    weatherConditions: [{
      location: { lat: Number, lng: Number },
      condition: String,
      temperature: Number,
      windSpeed: Number,
      timestamp: { type: Date, default: Date.now }
    }],

    // --- 6. CONTAINER & SPECS ---
    containerDetails: {
      type: { type: String, enum: ['20ft', '40ft', '40ft-HC', 'reefer', 'open-top'] },
      temperature: Number, // For reefer containers
      humidity: Number,
      sealNumber: String,
      maxWeight: Number
    },

    // --- 7. LEGAL & DOCUMENTS ---
    documents: [{
      name: String,
      url: String, // S3 or Cloudinary URL
      type: String, // e.g., 'Bill of Lading', 'Invoice'
      uploadedAt: { type: Date, default: Date.now }
    }],

    customs: {
      clearanceStatus: { type: String, enum: ['pending', 'cleared', 'held', 'rejected'], default: 'pending' },
      clearanceDate: Date,
      brokerName: String,
      documents: [String]
    },

    deliveryProof: {
      signature: String, // Base64 or URL
      photos: [String], // Array of image URLs
      receivedBy: String,
      notes: String,
      timestamp: Date
    },

    // --- 8. USERS & RELATIONSHIPS ---
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Driver or Logistics Manager
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Client

    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }

  }, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt'
  });

  // --- INDEXES ---

  // Index for Geospatial queries (finding shipments near a location)
  // Note: standard 2dsphere works best with [lng, lat], but this helps simple queries
  // shipmentSchema.index({ 'currentLocation.coordinates': '2dsphere' });

  // Performance indexes
  shipmentSchema.index({ customer: 1 });
  shipmentSchema.index({ status: 1 });
  shipmentSchema.index({ 'containerDetails.sealNumber': 1 });

  module.exports = mongoose.model('Shipment', shipmentSchema);