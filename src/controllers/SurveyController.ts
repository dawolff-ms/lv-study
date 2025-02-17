import ImageProvider from "../data-provider/ImageProvider";
import Listenable from "../utils/Listenable";
import { shuffle } from "../utils/ArrayUtils";

export type ImageState = {
  source: string;
  hidden: boolean;
};

type InternalImageState = ImageState & {
  start?: number;
  delay?: number;
};

export type SurveyControllerEvent =
  | { type: "image-state-update"; image: ImageState }
  | { type: "survey-started" }
  | { type: "survey-completed" }
  | { type: "survey-reset" };

export default class SurveyController extends Listenable<SurveyControllerEvent> {
  private imageProvider: ImageProvider;

  private images: InternalImageState[] = [];
  private currentIndex = -1;

  private _initialization: Promise<void>;
  public get initialization(): Promise<void> {
    return this._initialization;
  }

  constructor(imageProvider: ImageProvider) {
    super();
    this.imageProvider = imageProvider;

    this.initialize = this.initialize.bind(this);
    this.getCurrentImage = this.getCurrentImage.bind(this);
    this.start = this.start.bind(this);
    this.acknowledge = this.acknowledge.bind(this);
    this.skip = this.skip.bind(this);
    this.reset = this.reset.bind(this);
    this.queueNextImage = this.queueNextImage.bind(this);

    this._initialization = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      const sources = await this.imageProvider.getImageList().then(shuffle);
      this.images = sources.map((source) => ({ source, hidden: true }));
    } catch (error) {
      console.error(
        "Something went wrong while initializing the SurveyController",
        error
      );
      throw error;
    }
  }

  public getCurrentImage(): ImageState {
    return this.images[this.currentIndex];
  }

  public start(): void {
    console.log("Starting survey");
    this.updateListeners({ type: "survey-started" });
    this.queueNextImage();
  }

  public acknowledge(image: ImageState): void {
    const currentImage = this.images[this.currentIndex];
    if (image.source !== currentImage.source) return;
    if (currentImage.start == null) return;

    const now = performance.now();
    const duration = now - currentImage.start;

    console.log(`Acknowledged image ${currentImage.source} in ${duration}ms`);
    this.queueNextImage();
  }

  public skip(): void {
    console.log(`Skipped image ${this.images[this.currentIndex].source}`);
    this.queueNextImage();
  }

  public reset(): void {
    console.log("Resetting survey");
    this.currentIndex = -1;
    this.images.forEach((image) => {
      image.hidden = true;
      image.start = undefined;
      image.delay = undefined;
    });
    this.updateListeners({ type: "survey-reset" });
  }

  private queueNextImage(): void {
    this.currentIndex++;
    if (this.currentIndex >= this.images.length) {
      this.updateListeners({ type: "survey-completed" });
      return;
    }

    const image = this.images[this.currentIndex];
    image.hidden = true;
    this.updateListeners({ type: "image-state-update", image: { ...image } });

    image.delay = Math.floor(Math.random() * 5000) + 1000;
    setTimeout(() => {
      image.hidden = false;
      image.start = performance.now();
      this.updateListeners({ type: "image-state-update", image: { ...image } });
    }, image.delay);
  }
}
