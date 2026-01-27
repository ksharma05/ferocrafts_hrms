# TODO: Fix TypeError in auth.js cookie expires option

- [x] Update `sendTokenResponse` in `server/src/controllers/auth.js` to parse `process.env.JWT_COOKIE_EXPIRE` as an integer with a 7-day fallback to prevent NaN in Date calculation.
