import * as jwt from "jsonwebtoken";
export const jwtSecretKey = "aksjdhsdkjalwjofsdijlk";
import atomyApi from "../apis/atomy";
import { getRepository } from "typeorm";
import { User } from "../entity";

export const checkAdminToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, jwtSecretKey);
    req.token = decoded;
    if (!req.token.adminId) {
      return res.status(403).send({ message: "권한이 없습니다." });
    }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(419).send({ message: "토큰 만료" });
    } else {
      return res.status(401).send({ message: "토큰이 유효하지 않습니다." });
    }
  }
};

export const checkToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error();
    }
    const accessToken = await atomyApi.getAccessToken({
      atomyJwtRefresh: token,
    });
    const info = await atomyApi.getUserInfo({
      atomyJwt: accessToken.item.atomyJwt,
    });
    const loginId = info.item.customer.id;
    const user = await getRepository(User)
      .createQueryBuilder("user")
      .select("user.id")
      .where("user.loginId = :loginId", { loginId })
      .getOne();
    req.userId = user.id;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(419).send({ message: "토큰 만료" });
    } else {
      return res.status(401).send({ message: "토큰이 유효하지 않습니다." });
    }
  }
};
