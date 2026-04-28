/**
 * useFirestoreCollection — Real-time Firestore listener hook
 * WHY: Components need live data. This hook subscribes to Firestore collections
 * and returns reactive data with loading/error states.
 */

import { useState, useEffect } from 'react';

/**
 * Generic hook that subscribes to any Firestore real-time stream
 * @param {Function} subscribeFn - A function that takes a callback and returns an unsubscribe function
 * @param {Array} deps - Dependency array for re-subscription
 * @param {Array} fallbackData - Fallback data when Firestore is not configured
 */
export const useFirestoreCollection = (subscribeFn, deps = [], fallbackData = []) => {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeFn((items) => {
        setData(items.length > 0 ? items : fallbackData);
        setLoading(false);
      });

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (err) {
      console.warn('Firestore subscription failed, using fallback data:', err.message);
      setData(fallbackData);
      setLoading(false);
      setError(err.message);
    }
  }, deps);

  return { data, loading, error };
};

export default useFirestoreCollection;
