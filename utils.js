export const createCookieOptions = () => {
//   const path = "/";
  return {
    maxAge: 7 * 24 * 60 * 60 * 100,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  } 
};
