import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Category, Location } from "../entity";
import * as jwt from "jsonwebtoken";
import { jwtSecretKey } from "../helper/auth";
import "reflect-metadata";

export const getCategories = async (req: any, res: Response) => {
  const categories = await getRepository(Category)
    .createQueryBuilder("category")
    .leftJoinAndSelect("category.products", "product")
    .leftJoinAndSelect("product.ProductLocation", "ProductLocation")
    .leftJoinAndSelect("ProductLocation.location", "location")
    .orderBy("category.position")
    .getMany();

  const result = categories.map((category) => {
    const products = category.products.map((product) => {
      const location = product.ProductLocation.map((pl) => pl.location);
      delete product.ProductLocation, category.products;
      return {
        ...product,
        location,
      };
    });
    return { ...category, products };
  });

  res.status(200).send(result);
};

export const getCategoryProducts = async (req: any, res: Response) => {
  const { id } = req.params;

  let isAdmin = true;
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    jwt.verify(token, jwtSecretKey);
  } catch (error) {
    isAdmin = false;
  }

  const productResult = getRepository(Location)
    .createQueryBuilder("location")
    .leftJoinAndSelect("location.ProductLocation", "ProductLocation")
    .innerJoinAndSelect("ProductLocation.product", "product")
    .leftJoinAndSelect("product.category", "category")
    .where("category.id = :id", { id });

  if (!isAdmin) {
    productResult.andWhere("product.is_show = 1");
  }
  productResult.orderBy({
    "category.position": "ASC",
    "location.position": "ASC",
    "product.name": "ASC",
  });
  const product = await productResult.getMany();

  return res.send(product);
};

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await getRepository(Category)
    .createQueryBuilder("category")
    .where("category.id = :id", { id: id })
    .getOne();

  if (!category) {
    return res
      .status(400)
      .send({ message: "해당 카테고리에는 상품이 없습니다." });
  }

  const categories = await getRepository(Category)
    .createQueryBuilder("category")
    .leftJoinAndSelect("category.products", "product")
    .leftJoinAndSelect("product.ProductLocation", "ProductLocation")
    .leftJoinAndSelect("ProductLocation.location", "location")
    .where("product.is_show = 1")
    .andWhere("category.id = :id", { id: id })
    .getOne();

  const products = categories.products.map((product) => {
    const location = product.ProductLocation.map((pl) => pl.location);
    delete product.ProductLocation;
    return {
      ...product,
      location,
    };
  });

  res.status(200).send(products);
};
