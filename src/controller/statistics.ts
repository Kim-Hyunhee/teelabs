import { Response } from "express";
import "reflect-metadata";
import statisticsService from "../service/statistics";

export const getVisitor = async (req: any, res: Response) => {
  const allUserCount = await statisticsService.getUserAllCount();
  const todayVisitUserCount = await statisticsService.getUserTodayVisitCount();
  const revisitUserCount = await statisticsService.getUserRevisitCount();
  const newUserCount = await statisticsService.getUserNewCount();
  res.send({
    allUserCount,
    todayVisitUserCount,
    revisitUserCount,
    newUserCount,
  });
};

export const getUserDevice = async (req: any, res: Response) => {
  const { startDate, endDate } = req.query;
  const userDevicePercentage = await statisticsService.getUserVisitDeviceCount({
    startDate,
    endDate,
  });

  res.send(userDevicePercentage);
};

export const getProductByCategories = async (req: any, res: Response) => {
  const { startDate, endDate } = req.query;
  const productLinkClickCount = await statisticsService.getProductByCategory({
    startDate,
    endDate,
  });

  res.send(productLinkClickCount);
};

export const getUserVisitGragh = async (req: any, res: Response) => {
  const { startDate, endDate } = req.query;
  const getUserVisitGragh = await statisticsService.getUserVisitGragh({
    startDate,
    endDate,
  });

  res.send(getUserVisitGragh);
};

export const getUserCartList = async (req: any, res: Response) => {
  const { startDate, endDate, categoryId, maxName } = req.query;
  const getUsersCart = await statisticsService.getUserCartList({
    startDate,
    endDate,
    maxName,
    categoryId,
  });
  return res.send(getUsersCart);
};

export const getUserProductClickList = async (req: any, res: Response) => {
  const { startDate, endDate } = req.query;
  if (!startDate && !endDate) {
    const getUserProductClick = await statisticsService.getProductClickLog();
    return res.send(getUserProductClick);
  } else {
    const getUserProductClickParams =
      await statisticsService.getProductClickLogParams({ startDate, endDate });
    return res.send(getUserProductClickParams);
  }
};
