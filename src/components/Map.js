import React, { useCallback, useEffect, useRef } from "react";

function MapView() {
  const mapRef = useRef(null);

  const initMap = useCallback(() => {
    new window.google.maps.Map(mapRef.current, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }, [mapRef]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  return (
    <div
      className="map"
      style={{ width: "500px", height: "500px" }}
      ref={mapRef}
    ></div>
  );
}

export default MapView;