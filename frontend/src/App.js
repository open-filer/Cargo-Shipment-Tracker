import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { PORTS } from './ports';
import GlobeMap from './GlobeMap';
import {
  fetchShipments,
  createShipment,
  updateLocation,
  deleteShipment,
  setSelectedId,
  selectSelectedShipment,
  selectAllShipments
} from './features/shipments/shipmentsSlice';
import {
  toggleModal,
  setFilterStatus,
  setSortBy,
  setIsDetailsOpen
} from './features/ui/uiSlice';

function App() {
  const dispatch = useDispatch();

  // Redux State
  const shipments = useSelector(selectAllShipments);
  const selected = useSelector(selectSelectedShipment);
  const status = useSelector(state => state.shipments.status);
  const { showModal, filterStatus, sortBy, isDetailsOpen } = useSelector(state => state.ui);

  // Local Form State
  const [newId, setNewId] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState(PORTS[0]?.name || '');
  const [selectedDest, setSelectedDest] = useState(PORTS[1]?.name || '');
  const [updateLat, setUpdateLat] = useState('');
  const [updateLng, setUpdateLng] = useState('');

  const loading = status === 'loading';

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchShipments());
    }
  }, [status, dispatch]);

  // Sync update form when selected shipment changes
  useEffect(() => {
    if (selected) {
      setUpdateLat(selected.currentLocation?.coordinates?.lat || '');
      setUpdateLng(selected.currentLocation?.coordinates?.lng || '');
    }
  }, [selected]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const origin = PORTS.find(p => p.name === selectedOrigin);
    const dest = PORTS.find(p => p.name === selectedDest);

    if (!origin || !dest) return;

    try {
      await dispatch(createShipment({
        containerId: newId,
        route: [
          { name: origin.name, coordinates: origin.coordinates },
          { name: dest.name, coordinates: dest.coordinates }
        ]
      })).unwrap();

      dispatch(toggleModal(false));
      setNewId('');
    } catch (error) {
      console.error('Failed to create shipment:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selected || !updateLat || !updateLng) return;

    try {
      await dispatch(updateLocation({
        id: selected.shipmentId,
        coordinates: { lat: parseFloat(updateLat), lng: parseFloat(updateLng) }
      })).unwrap();

      setUpdateLat('');
      setUpdateLng('');
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const handleDelete = async () => {
    if (!selected || !window.confirm('Are you sure you want to delete this shipment?')) return;

    try {
      await dispatch(deleteShipment(selected.shipmentId)).unwrap();
      dispatch(setIsDetailsOpen(false));
    } catch (error) {
      console.error('Failed to delete shipment:', error);
    }
  };

  const processedShipments = [...shipments]
    .filter(s => filterStatus === 'all' ? true : s.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'eta') return new Date(a.currentETA) - new Date(b.currentETA);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="header">
          <div className="brand">
            <span className="icon">🚢</span>
            <h1>CargoTrack</h1>
          </div>
        </div>

        <div className="sidebar-actions">
          <button className="btn-primary full-width" onClick={() => dispatch(toggleModal(true))}>
            + New Shipment
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => dispatch(setFilterStatus(e.target.value))}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-transit">In Transit</option>
              <option value="delayed">Delayed</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))}>
              <option value="newest">Newest First</option>
              <option value="eta">Earliest ETA</option>
            </select>
          </div>
        </div>

        <div className="shipments-list">
          {loading && shipments.length === 0 ? (
            <div className="state-msg">Loading shipments...</div>
          ) : processedShipments.length === 0 ? (
            <div className="state-msg">No shipments found</div>
          ) : (
            processedShipments.map(ship => (
              <div
                key={ship._id || ship.shipmentId}
                className={`shipment-card ${selected?.shipmentId === ship.shipmentId ? 'active' : ''}`}
                onClick={() => {
                  dispatch(setSelectedId(ship.shipmentId));
                  dispatch(setIsDetailsOpen(true));
                }}
              >
                <div className="card-header">
                  <span className="id">{ship.shipmentId}</span>
                  <span className={`status-badge ${ship.status || 'pending'}`}>
                    {ship.status || 'PENDING'}
                  </span>
                </div>
                <div className="route-line">
                  <span className="port">{ship.origin}</span>
                  <span className="arrow">→</span>
                  <span className="port">{ship.destination}</span>
                </div>
                <div className="eta">
                  ETA: {ship.currentETA ? new Date(ship.currentETA).toLocaleDateString() : 'TBD'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Globe Area */}
      <div className="globe-area">
        <GlobeMap
          shipments={processedShipments}
          selected={selected}
          onSelect={(ship) => {
            dispatch(setSelectedId(ship.shipmentId));
            dispatch(setIsDetailsOpen(true));
          }}
        />

        {/* Collapsible Details Panel */}
        {selected && isDetailsOpen && (
          <div className="details-panel">
            <div className="panel-header">
              <h2>Shipment Details</h2>
              <button className="btn-icon" onClick={() => dispatch(setIsDetailsOpen(false))}>✕</button>
            </div>

            <div className="panel-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>ID</label>
                  <span>{selected.shipmentId}</span>
                </div>
                <div className="info-item">
                  <label>Status</label>
                  <span className={`status-text ${selected.status}`}>{selected.status?.toUpperCase()}</span>
                </div>
                <div className="info-item full">
                  <label>Route</label>
                  <span>{selected.origin} → {selected.destination}</span>
                </div>
                <div className="info-item">
                  <label>ETA</label>
                  <span>{selected.currentETA ? new Date(selected.currentETA).toLocaleString() : 'TBD'}</span>
                </div>
              </div>

              <div className="update-section">
                <h3>Update Location</h3>
                <form onSubmit={handleUpdate}>
                  <div className="input-row">
                    <input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      value={updateLat}
                      onChange={e => setUpdateLat(e.target.value)}
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      value={updateLng}
                      onChange={e => setUpdateLng(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-update" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Location'}
                  </button>
                </form>
              </div>

              <div className="actions-section">
                <button
                  className="btn-delete"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete Shipment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Re-open button if closed */}
        {selected && !isDetailsOpen && (
          <button className="btn-floating" onClick={() => dispatch(setIsDetailsOpen(true))}>
            Show Details
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => dispatch(toggleModal(false))}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Shipment</h2>
              <button className="btn-icon" onClick={() => dispatch(toggleModal(false))}>✕</button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label>Container ID</label>
                <input
                  type="text"
                  placeholder="e.g. CONT-1234"
                  value={newId}
                  onChange={e => setNewId(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Origin</label>
                <select value={selectedOrigin} onChange={e => setSelectedOrigin(e.target.value)}>
                  {PORTS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Destination</label>
                <select value={selectedDest} onChange={e => setSelectedDest(e.target.value)}>
                  {PORTS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-primary full-width" disabled={loading}>
                {loading ? 'Creating...' : 'Create Shipment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;