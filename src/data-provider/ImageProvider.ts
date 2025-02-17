import { BlobServiceClient } from "@azure/storage-blob";

export type ImageState = {
  source: string;
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
        images.push({ source, mode: "light" });
      }

      return images;
    } catch (error) {
      console.error("Failed to get the list of images:", error);
      return [];
    }
  }
}
