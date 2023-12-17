export default function cookieParser(cookie) {
  const cookies = {};
  cookie.split('; ')?.forEach(elem => {
    const [key, value] = elem.split('=');
    cookies[key] = value;
  });

  return cookies;
}