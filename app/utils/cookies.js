function cookieOptions(maxAgeMs) {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd,         
    sameSite: isProd ? "none" : "lax",
    maxAge: maxAgeMs,
  };
}

module.exports = { cookieOptions };
