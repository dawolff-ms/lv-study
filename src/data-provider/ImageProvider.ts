import { BlobServiceClient } from "@azure/storage-blob";
import { shuffle } from "../utils/ArrayUtils";

export type ImageState = {
  source: string;
  name: string;
  mode: "light" | "dark";
};

export default class ImageProvider {
  private client: BlobServiceClient;
  private container = "images";
  private blobUrl: string;

  constructor(blobUrl: string) {
    this.blobUrl = blobUrl;
    this.client = new BlobServiceClient(blobUrl);
  }

  public async getImageList(): Promise<ImageState[]> {
    try {
      const container = this.client.getContainerClient(this.container);
      const images: ImageState[] = [];

      for await (const blob of container.listBlobsFlat()) {
        const source = `${this.blobUrl}/${this.container}/${blob.name}`;
        const mode = blob.name.startsWith("dark") ? "dark" : "light";
        images.push({ source, mode, name: blob.name });
      }

      // Randomize the order of the images, but then group by light/dark mode.
      // Whether light or dark mode comes first is also randomized.
      shuffle(images);

      const modeOrderVariant = Math.random() >= 0.5 ? 1 : -1;
      images.sort((a) =>
        a.mode === "light" ? -modeOrderVariant : modeOrderVariant
      );

      return images;
    } catch (error) {
      console.error("Failed to get the list of images:", error);
      return [];
    }
  }
}
