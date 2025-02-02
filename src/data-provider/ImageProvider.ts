import { BlobServiceClient } from "@azure/storage-blob"

export default class ImageProvider {

  private client: BlobServiceClient;
  private container = 'images';
  private blobUrl: string;

  constructor(blobUrl: string) {
    this.blobUrl = blobUrl;
    this.client = new BlobServiceClient(blobUrl);
  }

  public async getImageList(): Promise<string[]> {
    try {
      const container = this.client.getContainerClient(this.container);
      const images: string[] = [];
      
      for await (const blob of container.listBlobsFlat()) {
        const src = `${this.blobUrl}/${this.container}/${blob.name}`;
        images.push(src);
      }

      return images;
    } catch (error) {
      console.error("Failed to get the list of images:", error);
      return [];
    }
  }
}