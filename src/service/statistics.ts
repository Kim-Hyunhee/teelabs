import { getRepository } from "typeorm";
import { User, LogUser, Category, Cart, LogClickProduct } from "../entity";
import "reflect-metadata";
import moment from "moment-timezone";

const statisticsService = {
  getUserAllCount: async () => {
    const item = await getRepository(User)
      .createQueryBuilder("user")
      .select("COUNT(user.id)", "users")
      .getRawOne();

    return +item.users;
  },

  getUserTodayVisitCount: async () => {
    const now = moment().tz("Asia/Seoul").format();

    const start = moment(now).startOf("day").format();
    const end = moment(now).endOf("day").format();
    const item = await getRepository(LogUser)
      .createQueryBuilder("logUser")
      .select("COUNT(logUser.id)", "today_visit_user")
      .andWhere(
        `date(CONVERT_TZ(logUser.created_at,'UTC','Asia/Seoul')) between '${start}' and '${end}'`
      )
      .getRawOne();
    return +item.today_visit_user;
  },

  getUserRevisitCount: async () => {
    const item = await getRepository(LogUser)
      .createQueryBuilder("logUser")
      .select("COUNT(logUser.id) AS revisit_user")
      .groupBy("logUser.userId")
      .having("COUNT(logUser.id) >= 2")
      .getRawMany();

    return item.length;
  },

  getUserNewCount: async () => {
    const item = await getRepository(LogUser)
      .createQueryBuilder("logUser")
      .select("COUNT(logUser.id) as new_user")
      .groupBy("logUser.userId")
      .having("COUNT(logUser.id) = 1")
      .getRawMany();

    return item.length;
  },

  getUserVisitDeviceCount: async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => {
    const start = moment.tz(startDate, "Asia/Seoul").startOf("day").format();
    const end = moment.tz(endDate, "Asia/Seoul").endOf("day").format();

    const item = getRepository(LogUser)
      .createQueryBuilder("logUser")
      .select("logUser.device as deviceName")
      .addSelect("COUNT(logUser.id) as count");

    if (startDate && endDate) {
      item.where(
        `date(CONVERT_TZ(logUser.created_at,'UTC','Asia/Seoul')) between '${start}' and '${end}'`
      );
    } else if (startDate) {
      item.andWhere(
        "date(CONVERT_TZ(logUser.created_at,'UTC','Asia/Seoul')) >= :created_at",
        {
          created_at: start,
        }
      );
    } else if (endDate) {
      item.andWhere(
        "date(CONVERT_TZ(logUser.created_at,'UTC','Asia/Seoul')) <= :created_at",
        {
          created_at: end,
        }
      );
    }
    const items = await item.groupBy("logUser.device").getRawMany();

    return items;
  },

  getProductByCategory: async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => {
    const start = moment.tz(startDate, "Asia/Seoul").format();
    const end = moment.tz(endDate, "Asia/Seoul").format();

    const item = getRepository(Category)
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.products", "product")
      .innerJoinAndSelect("product.logProduct", "logProduct");

    if (startDate && endDate) {
      item.where(
        `date(CONVERT_TZ(logProduct.created_at,'UTC','Asia/Seoul')) between '${start}' and '${end}'`
      );
    } else if (startDate) {
      item.where(
        "date(CONVERT_TZ(logProduct.created_at,'UTC','Asia/Seoul')) >= :created_at",
        {
          created_at: start,
        }
      );
    } else if (endDate) {
      item.where(
        "date(CONVERT_TZ(logProduct.created_at,'UTC','Asia/Seoul')) <= :created_at",
        {
          created_at: end,
        }
      );
    }
    const items = await item.getMany();

    const result = items.map((category) => {
      let max = 0;
      let maxProductName = "";
      const products = category.products.map((product) => {
        const count = product.logProduct.length;
        if (max < count) {
          max = count;
          maxProductName = product.name;
        }
        delete product.logProduct;
        return { ...product, count };
      });
      const sum = products.reduce((a, b) => a + b.count, 0);
      delete category.products;
      return { ...category, products, sum, maxProductName };
    });

    return result;
  },

  getUserVisitGragh: async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => {
    const start = moment.tz(startDate, "Asia/Seoul").startOf("day").format();
    const end = moment.tz(endDate, "Asia/Seoul").endOf("day").format();

    const item = getRepository(LogUser)
      .createQueryBuilder("logUser")
      .select("COUNT(logUser.id) AS count")
      .addSelect(
        "date(CONVERT_TZ(logUser.created_at,'UTC','Asia/Seoul')) as date"
      );

    if (startDate && endDate) {
      item.where(
        `date(CONVERT_TZ(logUser.created_at,'UTC','Asia/Seoul')) between '${start}' and '${end}'`
      );
    } else if (startDate) {
      item.andWhere(
        "date(CONVERT_TZ(logUser.created_at,'UTC','Asia/Seoul')) >= :created_at",
        {
          created_at: start,
        }
      );
    } else if (endDate) {
      item.andWhere(
        "date(CONVERT_TZ(logUser.created_at,'UTC','Asia/Seoul')) <= :created_at",
        {
          created_at: end,
        }
      );
    }

    const items = await item
      .groupBy("date(CONVERT_TZ(logUser.created_at,'UTC','Asia/Seoul'))")
      .orderBy("date(CONVERT_TZ(logUser.created_at,'UTC','Asia/Seoul'))", "ASC")
      .getRawMany();

    items.forEach((element) => {
      element.date = element.date
        ? moment(element.date).add(9, "h").format("YYYY-MM-DD")
        : element.date;
    });

    const dateRange = [];
    let arrayIndex = 0;
    const modiData = [];
    for (let i = +moment(end).diff(moment(start), "days"); i >= 0; i--) {
      dateRange.push(moment(end).subtract(i, "day").format("YYYY-MM-DD"));
    }
    for (let i = 0; i < dateRange.length; i++) {
      const tempM = moment(dateRange[0]).add(i, "day").format("YYYY-MM-DD");

      if (items[arrayIndex] != null && items[arrayIndex]["date"] == tempM) {
        modiData.push(items[arrayIndex]["count"]);
        arrayIndex += 1;
      } else {
        modiData.push(0);
      }
    }
    const newArr = [];
    for (let i = 0; i < modiData.length; i++) {
      newArr.push({ date: dateRange[i], count: +modiData[i] });
    }

    return newArr;
  },

  getUserCartList: async ({
    startDate,
    endDate,
    categoryId,
    maxName,
  }: {
    startDate: string;
    endDate: string;
    categoryId?: number;
    maxName?: string;
  }) => {
    const start = moment.tz(startDate, "Asia/Seoul").startOf("day").format();

    const end = moment.tz(endDate, "Asia/Seoul").endOf("day").format();

    const item = getRepository(Cart)
      .createQueryBuilder("cart")
      .leftJoin("cart.user", "user")
      .leftJoin("cart.product", "product")
      .leftJoin("product.category", "category")
      .leftJoin("product.ProductLocation", "ProductLocation")
      .leftJoin("ProductLocation.location", "location")
      .select([
        `COUNT(cart.productId) AS count, product.name as product_name, 
        category.name as category_name, location.name as location_name, product.price, product.point,
        user.maxName`,
      ]);

    if (startDate && endDate) {
      item.where(
        `date(CONVERT_TZ(cart.created_at,'UTC','Asia/Seoul')) between '${start}' and '${end}'`
      );
    } else if (startDate) {
      item.andWhere(
        "date(CONVERT_TZ(cart.created_at,'UTC','Asia/Seoul')) >= :created_at",
        {
          created_at: start,
        }
      );
    } else if (endDate) {
      item.andWhere(
        "date(CONVERT_TZ(cart.created_at,'UTC','Asia/Seoul')) <= :created_at",
        {
          created_at: end,
        }
      );
    }

    item.groupBy("product_name");

    if (categoryId) {
      item.andWhere("category.id = :categoryId", { categoryId });
    }
    if (maxName) {
      item.andWhere("user.maxName = :maxName", { maxName });
    }

    const items = await item
      .addOrderBy("count", "DESC")
      .addOrderBy("product.name", "ASC")
      .limit(20)
      .getRawMany();

    return items;
  },

  getProductClickLog: async () => {
    const item = getRepository(LogClickProduct)
      .createQueryBuilder("logClickProduct")
      .leftJoin("logClickProduct.product", "product")
      .select([
        `COUNT(logClickProduct.productId) AS count, product.name as product_name, product.id as product_id`,
      ])
      .addOrderBy("count", "DESC")
      .addOrderBy("product.name", "ASC")
      .groupBy("product_name")
      .getRawMany();

    return item;
  },

  getProductClickLogParams: async ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => {
    const start = moment.tz(startDate, "Asia/Seoul").startOf("day").format();
    const end = moment.tz(endDate, "Asia/Seoul").endOf("day").format();
    const item = getRepository(Category)
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.products", "product")
      .innerJoinAndSelect("product.logClickProduct", "logClickProduct");

    if (startDate && endDate) {
      item.where(
        `date(CONVERT_TZ(logClickProduct.created_at,'UTC','Asia/Seoul')) between '${start}' and '${end}'`
      );
    } else if (startDate) {
      item.where(
        "date(CONVERT_TZ(logClickProduct.created_at,'UTC','Asia/Seoul')) >= :created_at",
        {
          created_at: start,
        }
      );
    } else if (endDate) {
      item.where(
        "date(CONVERT_TZ(logClickProduct.created_at,'UTC','Asia/Seoul')) <= :created_at",
        {
          created_at: end,
        }
      );
    }
    const items = await item.getMany();
    const result = items.map((category) => {
      let max = 0;
      const products = category.products.map((product) => {
        const count = product.logClickProduct.length;
        if (max < count) {
          max = count;
        }
        delete product.logClickProduct;
        return { ...product, count };
      });
      const sum = products.reduce((a, b) => a + b.count, 0);
      delete category.products;
      return { ...category, products, sum };
    });

    return result;
  },
};

export default statisticsService;
