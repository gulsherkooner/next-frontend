export const setCookie = (name, value, options = {}) => {
  const { httpOnly = false, secure = false, sameSite = 'Lax', maxAge } = options;
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  if (maxAge) cookie += `; Max-Age=${maxAge}`;
  if (httpOnly) cookie += '; HttpOnly';
  if (secure) cookie += '; Secure';
  if (sameSite) cookie += `; SameSite=${sameSite}`;
  document.cookie = cookie;
};

export const getCookie = (name) => {
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${encodeURIComponent(name).replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`)
  );
  return matches ? decodeURIComponent(matches[1]) : null;
};

export const deleteCookie = (name) => {
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=/`;
};