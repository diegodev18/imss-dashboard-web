export const usernameValidator = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{14}$/;
  return usernameRegex.test(username);
};

export const passwordValidator = (password: string): boolean => {
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+]{8,}$/;
  return passwordRegex.test(password);
};

export const rfcValidator = (rfc: string): boolean => {
  if (rfc.length === 13 || rfc.length === 12) {
    return true;
  }
  return false;
};
