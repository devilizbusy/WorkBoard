// Utility function to get the value of the CSRF token from cookies
export function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith('csrftoken=')) {
        return cookie.split('=')[1];
      }
    }
    return null;  // Return null if CSRF token is not found
  }
  