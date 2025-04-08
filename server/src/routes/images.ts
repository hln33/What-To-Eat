import crypto from 'crypto';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import {
  S3Client,
  PutObjectCommand,
  // GetObjectCommand,
} from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const IMAGE_BUCKET_NAME = 'recipe-images-23';
const s3Client = new S3Client({});

const images = new Hono().post(
  '/',
  zValidator('form', z.object({ file: z.instanceof(File) })),
  async (c) => {
    const { file } = await c.req.valid('form');
    console.log(file);

    const randomImageName = crypto.randomBytes(32).toString('hex');
    await s3Client.send(
      new PutObjectCommand({
        Bucket: IMAGE_BUCKET_NAME,
        Key: randomImageName,
        Body: Buffer.from(await file.arrayBuffer()),
      })
    );

    return c.json({
      imageName: randomImageName,
    });
  }
);

// const presignedURL = getSignedUrl(
//   s3Client,
//   new GetObjectCommand({
//     Bucket: IMAGE_BUCKET_NAME,
//     Key: randomImageName,
//   })
// );

export default images;
