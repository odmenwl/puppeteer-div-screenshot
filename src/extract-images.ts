import { join } from 'path';
import sharp from 'sharp';
import { IBlockModel } from './intefaces/block-model.interface';
import { getFileName } from './get-file-name';


export async function extractImages (screenshot: Buffer | string, blockModels: IBlockModel[], directory: string) {
  try {
    return await Promise.all(
      blockModels.map(async (box, index) => {
        await sharp(screenshot)
          .extract({
            height: Math.round(box.height),
            width: Math.round(box.width),
            top: Math.round(box.top),
            left: Math.round(box.left),
          })
          .toFile(join(directory, `${getFileName(box.title)}-${index}.jpg`));
      })
    );
  } catch (e) {
    console.error(e);
  }
}
