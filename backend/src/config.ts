export const { EXPRESS_PORT = 3000 } = process.env;

export const SERVER_PORT =
  typeof EXPRESS_PORT === "number" ? EXPRESS_PORT : Number(EXPRESS_PORT);
