import { getRepository } from "typeorm";
import { Response } from "express";
import { User, LogUser, LogProduct, Cart } from "../entity";
import "reflect-metadata";
import atomyApi from "../apis/atomy";
import UserService from "../service/user";
import UserLogService from "../service/log";

export const getUsers = async (req: any, res: any) => {
  const { page, query } = req.query;
  const count = 10;

  const regex = /\D/g;

  if (!page || Number(page) <= 0 || regex.test(page)) {
    return res.status(400).send({ message: "1 이상의 정수로 입력해주세요." });
  }

  const item = getRepository(User).createQueryBuilder("user");

  if (query) {
    item.where("user.loginId like :query or user.name like :query", {
      query: `%${query}%`,
    });
  }
  const items = await item
    .skip((page - 1) * count)
    .take(count)
    .getManyAndCount();
  res.status(200).send({ items: items[0], total: items[1] });
};

export const getUser = async (req: any, res: any) => {
  const { id } = req.params;

  const usersInfo = await getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: id })
    .getOne();

  const userLog = await getRepository(LogUser)
    .createQueryBuilder("LogUser")
    .select("LogUser.created_at", "lastLoginLog")
    .where("LogUser.userId = :id", { id: id })
    .orderBy("LogUser.created_at", "DESC")
    .limit(1)
    .getRawOne();

  const userLogCount = await getRepository(LogUser)
    .createQueryBuilder("LogUser")
    .select("COUNT(LogUser.id) AS logUserCount")
    .where("LogUser.userId = :id", { id: id })
    .getRawOne();

  const productLog = await getRepository(LogProduct)
    .createQueryBuilder("LogProduct")
    .leftJoin("LogProduct.product", "product")
    .select("product.name", "lastProductLog")
    .where("LogProduct.userId = :id", { id: id })
    .orderBy("LogProduct.created_at", "DESC")
    .limit(1)
    .getRawOne();

  const userCart = await getRepository(Cart)
    .createQueryBuilder("cart")
    .where("cart.userId = :id", { id: id })
    .leftJoin("cart.product", "product")
    .select("product.name")
    .getRawMany();

  const cart = userCart.map((cart) => cart.product_name);

  res.send({ usersInfo, ...userLog, ...userLogCount, ...productLog, cart });
};

export const postUserToken = async (req: any, res: Response) => {
  try {
    const { id, password } = req.body;
    // atomy 로그인
    const loginData = await atomyApi.login({ id, password });
    if (!loginData) {
      return res.status(400).send({ message: "로그인 실패" });
    }
    // 유저 생성 또는 업데이트
    const { atomyJwt, atomyJwtRefresh } = loginData.item;
    const {
      item: { customer },
    } = await atomyApi.getUserInfo({ atomyJwt });
    const user = await UserService.getUser({ loginId: customer.id });

    if (user) {
      await UserService.updateUser({
        info: customer,
        atomyJwt,
        atomyJwtRefresh,
        loginId: customer.id,
        maxName: customer.maxName,
        name: customer.name,
      });
    } else {
      await UserService.createUser({
        info: customer,
        atomyJwt,
        atomyJwtRefresh,
        loginId: customer.id,
        maxName: customer.maxName,
        name: customer.name,
      });
    }
    // 유저 로그 생성
    const userAgent = req.headers["user-agent"];
    await UserLogService.postUserLog({ loginId: customer.id, userAgent });
    res.send({ token: atomyJwtRefresh });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ message: "아이디와 비밀번호를 확인해주세요." });
  }
};

export const getUserName = async (req: any, res: Response) => {
  const { userId } = req;
  const user = await UserService.getUserInfo({ id: userId });

  res.send(user);
};
