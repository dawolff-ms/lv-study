import { BlobServiceClient } from "@azure/storage-blob";
import { shuffle } from "../../utils/ArrayUtils";

import imageAssetList from "../../image-list.json";

export type ImageState = {
  source: string;
  name: string;
  mode: "light" | "dark";
};

export abstract class ImageProvider {
  abstract getImageList(): Promise<ImageState[]>;
  protected orderImages(images: ImageState[]): ImageState[] {
    // Randomize the order of the images, but then group by light/dark mode.
    // Whether light or dark mode comes first is also randomized.
    shuffle(images);

    const modeOrderVariant = Math.random() >= 0.5 ? 1 : -1;
    images.sort((a) =>
      a.mode === "light" ? -modeOrderVariant : modeOrderVariant
    );
    return images;
  }
}

export default class ImageProviderFactory {
  public static create(): ImageProvider {
    const useBlobStorage =
      import.meta.env.VITE_UseBlobStorageForImages === "true";

    if (!useBlobStorage) {
      return new AssetImageProvider();
    } else {
      return new BlobImageProvider();
    }
  }
}

class AssetImageProvider extends ImageProvider {
  public async getImageList(): Promise<ImageState[]> {
    const images: ImageState[] = [];
    for (const source of imageAssetList as string[]) {
      const name = source.substring("/images/".length);
      const mode = source.includes("dark") ? "dark" : "light";
      images.push({ source, name, mode });
    }

    this.orderImages(images);
    return images;
  }
}

class BlobImageProvider extends ImageProvider {
  private client: BlobServiceClient;
  private container = "images";
  private blobUrl: string;

  constructor() {
    super();
    this.blobUrl = import.meta.env.VITE_BlobStorageUrl;
    if (this.blobUrl == null) {
      throw new Error(
        "BlobStorageUrl is not defined in environment variables."
      );
    }
    this.client = new BlobServiceClient(this.blobUrl);
  }

  public async getImageList(): Promise<ImageState[]> {
    try {
      const container = this.client.getContainerClient(this.container);
      const images: ImageState[] = [];

      for await (const blob of container.listBlobsFlat()) {
        const source = `${this.blobUrl}/${this.container}/${blob.name}`;
        const mode = blob.name.includes("dark") ? "dark" : "light";
        images.push({ source, mode, name: blob.name });
      }

      this.orderImages(images);
      return images;
    } catch (error) {
      console.error("Failed to get the list of images:", error);
      return [];
    }
  }
}
