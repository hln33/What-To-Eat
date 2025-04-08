import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { createImage } from './imageUtils/index.ts';

const images = new Hono().post(
  '/',
  zValidator('form', z.object({ file: z.instanceof(File) })),
  async (c) => {
    const { file } = await c.req.valid('form');

    const randomImageName = await createImage(file);

    return c.json({
      imageName: randomImageName,
    });
  }
);

export default images;
