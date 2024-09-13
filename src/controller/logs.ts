import { Response } from "express";
import { getRepository } from "typeorm";
import { Product, LogProduct } from "../entity";
import "reflect-metadata";
import UserLogService from "../service/log";

export const postLogsProduct = async (req: any, res: Response) => {
  const { productId } = req.body;
  const { userId } = req;

  const product = await getRepository(Product)
    .createQueryBuilder("product")
    .where("product.id = :id", { id: productId })
    .getOne();

  if (!product) {
    return res.status(400).send({ message: "존재하지 않는 상품입니다." });
  }

  const logProduct = new LogProduct();
  logProduct.product = productId;
  logProduct.user = userId;

  await logProduct.save();

  res.send(true);
};

export const postClickProductLog = async (req: any, res: Response) => {
  const { productId } = req.body;
  const { userId } = req;
  await UserLogService.postClickProductLog({ productId, userId });
  return res.send(true);
};
