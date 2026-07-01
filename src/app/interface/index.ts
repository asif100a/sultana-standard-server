import type { TokenPayloadType } from "../utils/token.utils";

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayloadType;
  }
}
