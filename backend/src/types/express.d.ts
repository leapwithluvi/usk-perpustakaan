import { Role, Session, User } from "@prisma";
import { JWTPayload } from "./util.type";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }

    interface Response {
      locals: {
        user?: User;
        session?: Session;
        payload?: JWTPayload;
      };
    }
  }
}
