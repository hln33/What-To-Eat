import crypto from 'crypto';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const IMAGE_BUCKET_NAME = 'recipe-images-23';
const s3Client = new S3Client({});

export const createImage = async (imageFile: File): Promise<string> => {
  const randomImageName = crypto.randomBytes(32).toString('hex');
  await s3Client.send(
    new PutObjectCommand({
      Bucket: IMAGE_BUCKET_NAME,
      Key: randomImageName,
      Body: Buffer.from(await imageFile.arrayBuffer()),
    })
  );

  return randomImageName;
};

export const createPresignedUrl = async (
  imageName: string
): Promise<string> => {
  const EXPIRATION_SEC = 60;

  return await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: IMAGE_BUCKET_NAME,
      Key: imageName,
    }),
    { expiresIn: EXPIRATION_SEC }
  );
};
