export const usernameValidator = (
  username: string
): { message?: string; valid: boolean } => {
  const usernameRegex = /^[a-zA-Z0-9_]{7,14}$/;

  if (!usernameRegex.test(username)) {
    return {
      message:
        "Username must be between 7 and 14 characters and can only contain letters, numbers, and underscores",
      valid: false,
    };
  }

  return { valid: true };
};
