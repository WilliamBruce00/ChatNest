export const PORT_SERVER = 'http://localhost:3000';
export const PORT_EMOJI = 'https://emoji-api.com/emojis';
export const EMOJI_KEY = 'c28453710e8f6764b2c50f0701e16948891dafca';

export const API_URL = {
  OTP: `${PORT_SERVER}/otp`,
  USER: `${PORT_SERVER}/user`,
  EMAIL: `${PORT_SERVER}/email`,
  AUTH: `${PORT_SERVER}/auth`,
  IMAGES: `${PORT_SERVER}/images`,
  CHAT: `${PORT_SERVER}/chat`,
  EMOJI: `${PORT_EMOJI}?access_key=${EMOJI_KEY}`,
  UPLOAD: `${PORT_SERVER}/upload`,
  ADDFRIEND: `${PORT_SERVER}/addfriend`,
  FRIEND: `${PORT_SERVER}/friend`,
  GROUP: `${PORT_SERVER}/group`,
  MEMBER: `${PORT_SERVER}/member`,
};

export const imageUrlRegex = /\.(jpeg|jpg|gif|bmp|png)$/;
