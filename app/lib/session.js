
import { IronSessionOptions } from "iron-session";

export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "audit_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
