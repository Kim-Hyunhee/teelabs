import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Location } from "../entity";
import "reflect-metadata";

export const getLocations = async (req: any, res: Response) => {
  const location = getRepository(Location)
    .createQueryBuilder("location")
    .leftJoinAndSelect("location.ProductLocation", "ProductLocation")
    .leftJoinAndSelect("ProductLocation.product", "product");

  if (req.userId) {
    location.where("product.is_show = 1");
  }
  const locations = await location
    .orderBy("location.position", "ASC")
    .getMany();

  const result = locations.map((location) => {
    const products = location.ProductLocation.map(
      (productLocation) => productLocation.product
    );
    return { ...location, products };
  });

  res.send(result);
};

export const getLocation = async (req: Request, res: Response) => {
  const { id } = req.params;

  const location = await getRepository(Location)
    .createQueryBuilder("location")
    .where("location.id = :id", { id: id })
    .getOne();

  if (!location) {
    return res
      .status(400)
      .send({ message: "해당 진열 위치에는 상품이 없습니다." });
  }

  const locations = await getRepository(Location)
    .createQueryBuilder("location")
    .where("location.id = :id", { id: id })
    .leftJoinAndSelect("location.ProductLocation", "ProductLocation")
    .leftJoinAndSelect("ProductLocation.product", "product")
    .andWhere("product.is_show = 1")
    .getMany();

  const result = locations.map((lo) => {
    const products = lo.ProductLocation.map(
      (productLocation) => productLocation.product
    );
    return { ...lo, products };
  });

  res.status(200).send(result);
};
