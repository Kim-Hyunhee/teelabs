import { Product, User, Cart } from "../entity";
import "reflect-metadata";
import { getRepository, getConnection } from "typeorm";

const CartService = {
  createCarts: async ({
    userId,
    categoryId,
  }: {
    userId: User;
    categoryId: number;
  }) => {
    await CartService.deleteCarts({ userId, categoryId });
    const queryRunner = getConnection().createQueryRunner();

    const queryBuilder = getRepository(Product)
      .createQueryBuilder("product")
      .select("product.id")
      .where("product.is_show = :is_show", { is_show: 1 });

    if (categoryId !== 0) {
      queryBuilder.andWhere("product.categoryId = :categoryId", { categoryId });
    }
    const productIds = await queryBuilder.getMany();

    const values = productIds.map((id) => ({ product: id, user: userId }));
    await getRepository(Cart)
      .createQueryBuilder()
      .insert()
      .into(Cart)
      .values(values)
      .execute();
  },

  deleteCarts: async ({
    userId,
    categoryId,
  }: {
    userId: User;
    categoryId: number;
  }) => {
    const queryRunner = getConnection().createQueryRunner();

    const queryBuilder = Cart.getRepository()
      .createQueryBuilder("cart")
      .innerJoin("cart.product", "product")
      .where("cart.userId = :userId", { userId });

    if (categoryId !== 0) {
      queryBuilder.andWhere("product.categoryId = :categoryId", { categoryId });
    }
    const carts = await queryBuilder.getMany();

    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(Cart, carts);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return true;
  },
};
export default CartService;
