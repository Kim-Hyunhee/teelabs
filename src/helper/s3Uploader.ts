import aws from "aws-sdk";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region: "ap-northeast-2",
  credentials: { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY },
});

export const uploadFileToS3 = (bucket, file, url) => {
  const params = {
    Bucket: bucket,
    Key: url,
    Body: file.data,
    ACL: "public-read",
  };

  return new Promise((res, rej) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        rej(err);
        return;
      }

      res(data);
    });
  });
};
