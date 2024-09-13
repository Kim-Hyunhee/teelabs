import { User, LogUser, LogClickProduct, Product } from "../entity";
import "reflect-metadata";
import { getDeviceFromUserAgent } from "../helper/user";
import { getRepository } from "typeorm";
import UserService from "./user";

const UserLogService = {
  postUserLog: async ({
    loginId,
    userAgent,
  }: {
    loginId: string;
    userAgent: string;
  }) => {
    const device = getDeviceFromUserAgent(userAgent);
    const user = await UserService.getUser({ loginId });

    const logUser = new LogUser();
    logUser.user = user;
    logUser.device = device;

    await logUser.save();

    return user;
  },

  postClickProductLog: async ({
    productId,
    userId,
  }: {
    productId: number;
    userId: number;
  }) => {
    const product = await getRepository(Product)
      .createQueryBuilder("product")
      .where("product.id = :productId", { productId })
      .getOne();

    const user = await getRepository(User)
      .createQueryBuilder("user")
      .where("user.id = :userId", { userId })
      .getOne();

    const clickProduct = new LogClickProduct();
    clickProduct.product = product;
    clickProduct.user = user;

    await LogClickProduct.save(clickProduct);
    return true;
  },
};
export default UserLogService;
