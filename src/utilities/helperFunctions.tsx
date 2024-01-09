export const generateRandomString = (length: number): string => {
  let text = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += characters[Math.floor(Math.random() * characters.length)];
  }
  return text;
}
