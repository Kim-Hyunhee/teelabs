import { Response } from "express";
import { getRepository } from "typeorm";
import { Category, Product, Location, ProductLocation } from "../entity";
import "reflect-metadata";

export const getProducts = async (req: any, res: Response) => {
  const { categoryId, name, page } = req.query;
  const count = 10;
  const item = getRepository(Product)
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.ProductLocation", "ProductLocation")
    .leftJoinAndSelect("ProductLocation.location", "location")
    .leftJoinAndSelect("product.category", "category");

  if (categoryId) {
    item.andWhere("categoryId = :categoryId", {
      categoryId: categoryId,
    });
  }
  if (name) {
    item.andWhere(`product.name like '%${name}%'`);
  }

  if (page) {
    const regex = /\D/g;
    if (regex.test(page) || Number(page) <= 0) {
      return res.status(400).send({ message: "1 이상의 정수로 입력해주세요." });
    }
    item.skip((page - 1) * count).take(count);
  } else {
    item.where("product.is_show = 1");
  }
  const items = await item.getMany();

  const result = items.map((productLocation) => {
    const locations = productLocation.ProductLocation.map((l) => {
      const location = l.location;
      return {
        ...location,
      };
    });
    return { ...productLocation, locations };
  });
  if (page) {
    const total = await item.getCount();

    res.send({ result, total });
  } else {
    res.send(result);
  }
};

export const getProduct = async (req: any, res: Response) => {
  const { id } = req.params;

  const products = getRepository(Product)
    .createQueryBuilder("product")
    .where("product.id = :id", { id: id })
    .leftJoinAndSelect("product.ProductLocation", "ProductLocation")
    .leftJoinAndSelect("ProductLocation.location", "location")
    .leftJoinAndSelect("product.category", "category");

  if (req.userId) {
    products.andWhere("product.is_show = 1");
  }

  const product = await products.getOne();

  if (!product) {
    return res.status(400).send({ message: "상품이 없습니다." });
  }

  const locations = product.ProductLocation.map((productLocation) => {
    const location = productLocation.location;
    return { ...location };
  });
  delete product.ProductLocation;
  res.send({ ...product, locations });
};

export const postProduct = async (req: any, res: Response) => {
  const {
    categoryId,
    locationId,
    price,
    point,
    serial_number,
    name,
    object_id,
    company,
    country,
    colors,
    explanation,
    connection_url,
    images,
    fbx,
    outsource,
    salesPerson,
    adReview,
    manufacturer,
  } = req.body;

  const category = await getRepository(Category)
    .createQueryBuilder("category")
    .select("category.id")
    .where("category.id = :id", { id: categoryId })
    .getOne();

  if (!category) {
    return res.status(400).send({ message: "존재하지 않은 카테고리입니다." });
  }

  for (let i = 0; i < locationId.length; i++) {
    const location = await getRepository(Location)
      .createQueryBuilder("location")
      .select("location.id")
      .where("location.id = :id", { id: locationId[i] })
      .getOne();

    if (!location) {
      return res
        .status(400)
        .send({ message: "진열 위치를 다시 확인해주세요." });
    }
  }

  let product = new Product();
  product.category = category;
  product.price = price;
  product.point = point;
  product.serial_number = serial_number;
  product.name = name;
  product.object_id = object_id;
  product.company = company;
  product.country = country;
  product.colors = colors;
  product.explanation = explanation;
  product.connection_url = connection_url;
  product.images = images;
  product.fbx = fbx;
  product.salesPerson = salesPerson;
  product.outsource = outsource;
  product.adReview = adReview;
  product.manufacturer = manufacturer;

  product = await Product.save(product);

  for (let i = 0; i < locationId.length; i++) {
    let locations = new ProductLocation();
    locations.location = locationId[i];
    locations.product = product;

    locations = await ProductLocation.save(locations);
  }
  res.status(200).send(true);
};

export const putProduct = async (req: any, res: Response) => {
  const { id } = req.params;
  const {
    categoryId,
    locationId: locationIds,
    price,
    point,
    serial_number,
    salesPerson,
    name,
    object_id,
    company,
    country,
    colors,
    explanation,
    connection_url,
    images,
    outsource,
    fbx,
    adReview,
    manufacturer,
  } = req.body;

  const product = await getRepository(Product)
    .createQueryBuilder("product")
    .select("product.id")
    .where("product.id = :id", { id: id })
    .getOne();

  if (!product) {
    return res.status(400).send({ message: "존재하지 않은 상품입니다." });
  }

  const category = await getRepository(Category)
    .createQueryBuilder("category")
    .select("category.id")
    .where("category.id = :id", { id: categoryId })
    .getOne();

  if (!category) {
    return res.status(400).send({ message: "존재하지 않은 카테고리입니다." });
  }

  for (let i = 0; i < locationIds.length; i++) {
    const location = await getRepository(Location)
      .createQueryBuilder("location")
      .select("location.id")
      .where("location.id = :id", { id: locationIds[i] })
      .getOne();

    if (!location) {
      return res
        .status(400)
        .send({ message: "진열 위치를 다시 확인해주세요." });
    }
  }

  await getRepository(Product)
    .createQueryBuilder("product")
    .update(Product)
    .set({
      category: category,
      price: price,
      point: point,
      serial_number: serial_number,
      name: name,
      object_id: object_id,
      company: company,
      country: country,
      colors: colors,
      explanation: explanation,
      connection_url: connection_url,
      images: images,
      fbx: fbx,
      salesPerson: salesPerson,
      outsource,
      adReview,
      manufacturer,
    })
    .where("product.id = :id", { id: id })
    .execute();

  const pLs = await getRepository(ProductLocation)
    .createQueryBuilder("ProductLocation")
    .where("ProductLocation.productId = :id", { id })
    .getRawMany();

  const differPlList = pLs
    .map((row) => row.ProductLocation_locationId)
    .filter((x) => !locationIds.includes(x));

  // client가 보낸 locationId가 포함되지 않은 DB location 삭제
  if (differPlList.length !== 0) {
    await getRepository(ProductLocation)
      .createQueryBuilder("product_location")
      .delete()
      .from(ProductLocation)
      .where("productId = :id", { id })
      .andWhere("locationId IN (:differList)", { differList: differPlList })
      .execute();
  }

  const differLocationIds = locationIds.filter(
    (locationId) =>
      !pLs.find((pl) => locationId === pl.ProductLocation_locationId)
  );

  const values = differLocationIds.map((locationId) => ({
    location: locationId,
    product: id,
  }));

  // client가 보낸 locationId 중에 DB에 없는 locationId 추가
  await getRepository(ProductLocation)
    .createQueryBuilder()
    .insert()
    .into(ProductLocation)
    .values(values)
    .execute();

  return res.send(true);
};

export const patchProductIsShow = async (req: any, res: Response) => {
  const { id } = req.params;
  const { is_show } = req.body;

  const product = await getRepository(Product)
    .createQueryBuilder("product")
    .select("product.id")
    .where("product.id = :id", { id: id })
    .getOne();

  if (!product) {
    return res.status(400).send({ message: "존재하지 않은 상품입니다." });
  }

  await getRepository(Product)
    .createQueryBuilder("product")
    .update(Product)
    .set({ is_show: is_show })
    .where("product.id = :id", { id: id })
    .execute();

  res.send(true);
};
