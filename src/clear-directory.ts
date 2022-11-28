import { promises } from 'fs';

export async function clearDirectory(directory: string) {
  try {
    const files = await promises.readdir(directory);

    return Promise.all(
      files.map(async (filename) => await promises.unlink(`${directory}/${filename}`)),
    );
  } catch(e) {
    console.error(e);
  }
}
