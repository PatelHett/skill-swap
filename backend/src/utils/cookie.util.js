const getCookieOptions = (maxAge) => {
  const parsedMaxAge = parseInt(maxAge);
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: parsedMaxAge,
  };
};

export default getCookieOptions;
