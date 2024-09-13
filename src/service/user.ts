import { getRepository } from "typeorm";
import { User } from "../entity";
import "reflect-metadata";

const UserService = {
  getUser: async ({ loginId }: { loginId: string }) => {
    const user = await getRepository(User)
      .createQueryBuilder("user")
      .where("loginId = :loginId", { loginId })
      .getOne();

    return user;
  },

  getUserInfo: async ({ id }: { id: number }) => {
    const item = await getRepository(User)
      .createQueryBuilder("user")
      .select("user.name")
      .where("user.id = :id", { id })
      .getOne();

    return item;
  },

  getUserToken: async ({ atomyJwtRefresh }: { atomyJwtRefresh: string }) => {
    const item = await getRepository(User)
      .createQueryBuilder("user")
      .select("user.atomyJwt")
      .where("atomyJwtRefresh = :atomyJwtRefresh", { atomyJwtRefresh })
      .getOne();
    return item.atomyJwt;
  },

  updateUser: async ({
    info,
    atomyJwt,
    atomyJwtRefresh,
    loginId,
    maxName,
    name,
  }: {
    info: object;
    atomyJwt: string;
    atomyJwtRefresh: string;
    loginId: string;
    maxName: string;
    name: string;
  }) => {
    const newUser = await getRepository(User)
      .createQueryBuilder()
      .update(User)
      .set({
        info,
        atomyJwt,
        atomyJwtRefresh,
        maxName,
        name,
      })
      .where("loginId = :loginId", { loginId })
      .execute();

    return newUser;
  },

  createUser: async ({
    info,
    atomyJwt,
    atomyJwtRefresh,
    loginId,
    maxName,
    name,
  }: {
    info: object;
    atomyJwt: string;
    atomyJwtRefresh: string;
    loginId: string;
    maxName: string;
    name: string;
  }) => {
    const createUser = new User();
    createUser.info = info;
    createUser.loginId = loginId;
    createUser.atomyJwt = atomyJwt;
    createUser.atomyJwtRefresh = atomyJwtRefresh;
    createUser.maxName = maxName;
    createUser.name = name;

    return await createUser.save();
  },
};

export default UserService;
