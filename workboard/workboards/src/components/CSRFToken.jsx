import { useEffect } from 'react';
import { getCSRFToken } from '../api';


export function CSRFToken() {
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        await getCSRFToken();
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCSRFToken();
  }, []);

  return null;
}