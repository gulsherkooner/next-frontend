// Set cookie function
export const setCookie = (name, value, options = {}) => {
  // Check if running in browser
  if (typeof window === 'undefined') {
    console.warn('setCookie called on server side');
    return;
  }

  try {
    const { 
      secure = false, 
      sameSite = 'Lax', 
      maxAge,
      expires,
      path = '/',
      domain
    } = options;

    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    // Add path
    cookie += `; Path=${path}`;
    
    // Add domain if specified
    if (domain) cookie += `; Domain=${domain}`;
    
    // Add expiration
    if (maxAge) {
      cookie += `; Max-Age=${maxAge}`;
    } else if (expires) {
      cookie += `; Expires=${expires.toUTCString()}`;
    }
    
    // Add security flags (Note: HttpOnly cannot be set via JavaScript)
    if (secure) cookie += '; Secure';
    if (sameSite) cookie += `; SameSite=${sameSite}`;
    
    document.cookie = cookie;
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

// Get cookie function with improved error handling
export const getCookie = (name) => {
  // Check if running in browser
  if (typeof window === 'undefined') {
    console.warn('getCookie called on server side');
    return null;
  }

  try {
    // Simple approach first
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      const cookieValue = parts.pop().split(';').shift();
      return decodeURIComponent(cookieValue);
    }
    return null;
    
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

// Alternative getCookie using regex (more robust)
export const getCookieRegex = (name) => {
  if (typeof window === 'undefined') return null;
  
  try {
    const matches = document.cookie.match(
      new RegExp(`(?:^|; )${encodeURIComponent(name).replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`)
    );
    
    const result = matches ? decodeURIComponent(matches[1]) : null;
    return result;
    
  } catch (error) {
    console.error('Error getting cookie with regex:', error);
    return null;
  }
};

// Delete cookie function
export const deleteCookie = (name, options = {}) => {
  if (typeof window === 'undefined') return;
  
  try {
    const { path = '/', domain } = options;
    
    let cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=${path}`;
    if (domain) cookie += `; Domain=${domain}`;
    
    document.cookie = cookie;
    
  } catch (error) {
    console.error('Error deleting cookie:', error);
  }
};

// Helper function to get all cookies
export const getAllCookies = () => {
  if (typeof window === 'undefined') return {};
  
  try {
    const cookies = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    });
    
    return cookies;
    
  } catch (error) {
    console.error('Error getting all cookies:', error);
    return {};
  }
};

// Helper function to check if cookies are enabled
export const cookiesEnabled = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const testCookie = 'test_cookie_' + Date.now();
    setCookie(testCookie, 'test', { maxAge: 1 });
    const result = getCookie(testCookie) === 'test';
    deleteCookie(testCookie);
    return result;
  } catch (error) {
    console.error('Error checking cookies enabled:', error);
    return false;
  }
};