import { Response } from "express";
import "reflect-metadata";
import { uploadFileToS3 } from "../helper/s3Uploader";

export const postUpload = async (req: any, res: Response) => {
  try {
    const BUCKET = "athome-product";
    const fileName = req.files.file.name;
    const awsUrl = `product/${Date.now().toString()}${fileName}`;

    const returnFileUrl = `https://athome-product.s3.ap-northeast-2.amazonaws.com/${awsUrl}`;
    await uploadFileToS3(BUCKET, req.files.file, awsUrl);
    return res.send(returnFileUrl);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ success: false });
  }
};

export const postFbx = async (req: any, res: Response) => {
  try {
    const BUCKET = "atomy-3d";
    const nowStr = Date.now().toString();
    let returnFileUrl = "";
    for (let i = 0; i < req.files.file.length; i++) {
      const fileName = req.files.file[i].name;
      const awsUrl = `${nowStr}/${fileName}`;
      const extension = fileName.slice(-3);
      if (extension === "fbx") {
        returnFileUrl = `https://atomy-3d.s3.ap-northeast-2.amazonaws.com/${awsUrl}`;
      }
      uploadFileToS3(BUCKET, req.files.file[i], awsUrl);
    }

    return res.send(returnFileUrl);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ success: false });
  }
};
