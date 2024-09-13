import { Response } from "express";
import { getRepository } from "typeorm";
import { Cart, Product } from "../entity";
import "reflect-metadata";

export const getCart = async (req: any, res: Response) => {
  const { userId } = req;
  const { categoryId } = req.query;
  const cart = getRepository(Cart)
    .createQueryBuilder("cart")
    .leftJoinAndSelect("cart.product", "product")
    .leftJoinAndSelect("product.category", "category")
    .where("cart.userId = :userId", { userId });

  if (categoryId) {
    cart.andWhere("product.categoryId = :categoryId", { categoryId });
  }
  const carts = await cart.getMany();

  const result = carts.map((cart) => {
    const product = cart.product;
    return { ...product };
  });

  res.send(result);
};

export const postCart = async (req: any, res: Response) => {
  const { productId } = req.body;
  const { userId } = req;

  const product = await getRepository(Product)
    .createQueryBuilder("product")
    .select("product.id")
    .where("product.id = :id", { id: productId })
    .andWhere("product.is_show = :is_show", { is_show: 1 })
    .getOne();

  if (!product) {
    return res.status(400).send({ message: "존재하지 않는 상품입니다." });
  }

  const cartProduct = await getRepository(Cart)
    .createQueryBuilder("cart")
    .where("cart.productId = :productId", { productId: productId })
    .andWhere("cart.userId = :userId", { userId })
    .getOne();

  if (cartProduct) {
    return res.status(400).send({ message: "이미 담긴 상품입니다." });
  }
  const cart = new Cart();
  cart.product = product;
  cart.user = userId;

  await Cart.save(cart);

  res.send(true);
};

export const deleteCart = async (req: any, res: Response) => {
  const { productIds } = req.body;
  const { userId } = req;

  const cart = await getRepository(Cart)
    .createQueryBuilder("cart")
    .where("cart.userId = :userId", { userId })
    .getOne();

  if (!cart) {
    return res
      .status(400)
      .send({ message: "본인 장바구니만 삭제 가능합니다." });
  }

  await getRepository(Cart)
    .createQueryBuilder("cart")
    .delete()
    .where("cart.productId IN (:productIds)", { productIds })
    .andWhere("cart.userId = :userId", { userId })
    .execute();

  return res.send(true);
};
