import { config } from 'dotenv';
config();

const settings = {
  'port': parseInt(process.env.PORT, 10) || 4000,
  'origin': process.env.ORIGIN ? process.env.ORIGIN.split(',').map(v => v.trim()) : '*',
  'useHTTP2': process.env.USEHTTP2.toLowerCase() === 'true',
  'SMTP_HOST': process.env.SMTP_HOST,
  'SMTP_PORT': process.env.SMTP_PORT || '465',
  'SMTP_USER': process.env.SMTP_USER,
  'SMTP_PASSWORD': process.env.SMTP_PASSWORD,
  'EMAIL_NAME': process.env.EMAIL_NAME,
  'EMAIL_FROM': process.env.EMAIL_FROM,
  'MONGODB_URL': process.env.MONGODB_URL,
  'secret': process.env.SECRET,
  'cookieKey': process.env.COOKIE_KEY
};

export default settings;