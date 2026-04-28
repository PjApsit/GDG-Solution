/**
 * useGeolocation — GPS position hook
 * WHY: Volunteers need location for task proximity matching.
 * Falls back gracefully if geolocation is denied.
 */

import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const onSuccess = (pos) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      });
      setLoading(false);
    };

    const onError = (err) => {
      setError(err.message);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
      ...options,
    });
  }, []);

  return { position, error, loading };
};

export default useGeolocation;
