import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Admin } from "../entity";
import "reflect-metadata";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecretKey as secretKey } from "../helper/auth";

export const postAdminLogin = async (req: Request, res: Response) => {
  const { user_name, password } = req.body;
  try {
    const item = await getRepository(Admin)
      .createQueryBuilder("admin")
      .addSelect("admin.passwordHashed")
      .addSelect("admin.salt")
      .andWhere("admin.user_name = :user_name", { user_name: user_name })
      .getOne();

    if (!item) {
      return res.status(400).send({ message: "아이디를 확인해주세요." });
    }
    const hashedPW = await bcrypt.hash(password, item.salt);

    if (hashedPW !== item.passwordHashed) {
      return res.status(400).send({ message: "비밀번호가 잘못되었습니다." });
    }

    const payload = {
      adminId: item.id,
    };
    const option = { expiresIn: "1d" };
    const token = jwt.sign(payload, secretKey, option);

    res.status(200).send({ admin: item.name, token: token });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ success: false });
  }
};

export const patchPassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    let admin = await getRepository(Admin)
      .createQueryBuilder("admin")
      .addSelect("admin.passwordHashed")
      .addSelect("admin.salt")
      .where("admin.id = :id", { id: req.token.adminId })
      .getOne();

    const hashedPW = await bcrypt.hash(currentPassword, admin.salt);
    const newSalt = await bcrypt.genSalt();

    if (currentPassword.length <= 0 || newPassword.length <= 0) {
      return res.status(400).send({ message: "비밀번호를 입력해주세요." });
    }

    if (currentPassword && newPassword) {
      if (admin.passwordHashed !== hashedPW) {
        return res
          .status(400)
          .send({ message: "현재 비밀번호가 일치하지 않습니다." });
      }
      admin.passwordHashed = await bcrypt.hash(newPassword, newSalt);
      admin.salt = newSalt;
    }
    admin = await Admin.save(admin);
    return res.send({ message: "비밀번호 변경이 완료되었습니다." });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ success: false });
  }
};
