export const createCookieOptions = () => {
//   const path = "/";
  return {
    maxAge: 5 * 24 * 60 * 60 * 1000, // Note: fixed the 100 multiplier to 1000 to represent milliseconds
    httpOnly: false,
    secure: true,
    sameSite: "None",
  };
};
