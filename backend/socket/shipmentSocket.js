const socketIO = require('socket.io');

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join room for specific shipment
    socket.on('track-shipment', (shipmentId) => {
      socket.join(`shipment-${shipmentId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

// Emit updates from controller
exports.updateShipmentLocation = async (req, res) => {
  // ... existing code ...
  
  // Emit real-time update
  req.app.get('io').to(`shipment-${shipmentId}`).emit('location-updated', {
    shipmentId,
    currentLocation: shipment.currentLocation,
    status: shipment.status,
    currentETA: shipment.currentETA
  });
};
