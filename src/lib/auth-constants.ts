export const SESSION_COOKIE_NAME = "atn_session";

/** Full session length when "Remember me" is checked (48 hours). */
export const SESSION_MAX_AGE_REMEMBER_SEC = 48 * 60 * 60;

/** Shorter session when signing in without remember (8 hours). */
export const SESSION_MAX_AGE_TRANSIENT_SEC = 8 * 60 * 60;
