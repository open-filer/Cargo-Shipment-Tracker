import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const GlobeMap = ({ shipments, selected, onSelect }) => {
    const globeEl = useRef();
    const [routes, setRoutes] = useState([]);
    const [rings, setRings] = useState([]);
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        const newArcs = [];
        const newRings = [];
        const newLabels = [];

        shipments.forEach(ship => {
            if (!ship.route || ship.route.length < 2) return;

            const start = ship.route[0].coordinates;
            const end = ship.route[ship.route.length - 1].coordinates;

            const isSelected = selected && selected._id === ship._id;

            let arcColor = 'rgba(14, 165, 233, 0.5)';
            let arcWidth = 1;

            if (isSelected) {
                arcColor = 'rgba(14, 165, 233, 1)';
                arcWidth = 2;
            }

            newArcs.push({
                startLat: start.lat,
                startLng: start.lng,
                endLat: end.lat,
                endLng: end.lng,
                color: arcColor,
                width: arcWidth,
                shipment: ship
            });

            newRings.push({
                lat: start.lat,
                lng: start.lng,
                color: isSelected ? '#10b981' : 'rgba(16, 185, 129, 0.5)',
                maxRadius: isSelected ? 3 : 2,
                propagationSpeed: isSelected ? 3 : 2,
                repeatPeriod: isSelected ? 800 : 1200
            });

            newRings.push({
                lat: end.lat,
                lng: end.lng,
                color: isSelected ? '#ef4444' : 'rgba(239, 68, 68, 0.5)',
                maxRadius: isSelected ? 3 : 2,
                propagationSpeed: isSelected ? 3 : 2,
                repeatPeriod: isSelected ? 800 : 1200
            });

            newLabels.push({
                lat: start.lat,
                lng: start.lng,
                text: ship.route[0].name,
                color: isSelected ? 'rgba(16, 185, 129, 1)' : 'rgba(148, 163, 184, 0.8)',
                size: isSelected ? 1.2 : 0.8
            });

            newLabels.push({
                lat: end.lat,
                lng: end.lng,
                text: ship.route[ship.route.length - 1].name,
                color: isSelected ? 'rgba(239, 68, 68, 1)' : 'rgba(148, 163, 184, 0.8)',
                size: isSelected ? 1.2 : 0.8
            });
        });

        setRoutes(newArcs);
        setRings(newRings);
        setLabels(newLabels);
    }, [shipments, selected]);

    useEffect(() => {
        if (globeEl.current) {
            const controls = globeEl.current.controls();
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.3;
            controls.enableZoom = true;
            controls.enablePan = false;
            controls.minDistance = 150;
            controls.maxDistance = 500;
        }
    }, []);

    useEffect(() => {
        if (selected && globeEl.current && selected.route && selected.route.length > 0) {
            const start = selected.route[0].coordinates;
            const end = selected.route[selected.route.length - 1].coordinates;

            const midLat = (start.lat + end.lat) / 2;
            const midLng = (start.lng + end.lng) / 2;

            globeEl.current.pointOfView({
                lat: midLat,
                lng: midLng,
                altitude: 2.5
            }, 1500);
        }
    }, [selected]);

    return (
        <Globe
            ref={globeEl}
            width={window.innerWidth - 320}
            height={window.innerHeight}

            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

            arcsData={routes}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcStroke="width"
            arcDashLength={0.6}
            arcDashGap={0.2}
            arcDashAnimateTime={2000}
            arcAltitude={0}
            arcAltitudeAutoScale={0}
            arcLabel={d => `
        <div style="
          background: rgba(15, 23, 42, 0.95);
          padding: 8px 12px;
          border-radius: 6px;
          color: #f8fafc;
          font-size: 12px;
          border: 1px solid #334155;
        ">
          <strong>${d.shipment.shipmentId}</strong><br/>
          ${d.shipment.origin} → ${d.shipment.destination}<br/>
          Status: <span style="color: #0ea5e9;">${d.shipment.status || 'pending'}</span>
        </div>
      `}
            onArcClick={d => onSelect(d.shipment)}

            ringsData={rings}
            ringColor="color"
            ringMaxRadius="maxRadius"
            ringPropagationSpeed="propagationSpeed"
            ringRepeatPeriod="repeatPeriod"

            labelsData={labels}
            labelLat="lat"
            labelLng="lng"
            labelText="text"
            labelSize="size"
            labelColor="color"
            labelResolution={2}
            labelAltitude={0.02}

            atmosphereColor="#0ea5e9"
            atmosphereAltitude={0.2}

            showGraticules={true}
            graticulesColor="rgba(148, 163, 184, 0.1)"
        />
    );
};

export default GlobeMap;
