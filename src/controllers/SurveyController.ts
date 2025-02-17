import ImageProvider, { ImageState } from "../data-provider/ImageProvider";

import Listenable from "../utils/Listenable";

export type TestState = {
  image: ImageState;
  hidden: boolean;
  start?: number;
  delay?: number;
};

export type SurveyControllerEvent =
  | { type: "test-state-update"; test: TestState }
  | { type: "survey-started" }
  | { type: "survey-completed" }
  | { type: "survey-reset" };

export default class SurveyController extends Listenable<SurveyControllerEvent> {
  private imageProvider: ImageProvider;

  private tests: TestState[] = [];
  private currentIndex = -1;

  private _initialization: Promise<void>;
  public get initialization(): Promise<void> {
    return this._initialization;
  }

  constructor(imageProvider: ImageProvider) {
    super();
    this.imageProvider = imageProvider;

    this.initialize = this.initialize.bind(this);
    this.getCurrentTest = this.getCurrentTest.bind(this);
    this.start = this.start.bind(this);
    this.acknowledge = this.acknowledge.bind(this);
    this.skip = this.skip.bind(this);
    this.reset = this.reset.bind(this);
    this.queueNextImage = this.queueNextImage.bind(this);

    this._initialization = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      const images = await this.imageProvider.getImageList();
      this.tests = images.map((image) => ({ image, hidden: true }));
    } catch (error) {
      console.error(
        "Something went wrong while initializing the SurveyController",
        error
      );
      throw error;
    }
  }

  public getCurrentTest(): TestState {
    return this.tests[this.currentIndex];
  }

  public start(): void {
    console.log("Starting survey");
    this.updateListeners({ type: "survey-started" });
    this.queueNextImage();
  }

  public acknowledge(test: TestState): void {
    const currentTest = this.tests[this.currentIndex];
    if (test.image.source !== currentTest.image.source) return;
    if (currentTest.start == null) return;

    const now = performance.now();
    const duration = now - currentTest.start;

    console.log(
      `Acknowledged image ${currentTest.image.source} in ${duration}ms`
    );
    this.queueNextImage();
  }

  public skip(): void {
    console.log(`Skipped image ${this.tests[this.currentIndex].image.source}`);
    this.queueNextImage();
  }

  public reset(): void {
    console.log("Resetting survey");
    this.currentIndex = -1;
    this.tests.forEach((test) => {
      test.hidden = true;
      test.start = undefined;
      test.delay = undefined;
    });
    this.updateListeners({ type: "survey-reset" });
  }

  private queueNextImage(): void {
    this.currentIndex++;
    if (this.currentIndex >= this.tests.length) {
      this.updateListeners({ type: "survey-completed" });
      return;
    }

    const test = this.tests[this.currentIndex];
    test.hidden = true;
    this.updateListeners({
      type: "test-state-update",
      test: { ...test },
    });

    test.delay = Math.floor(Math.random() * 5000) + 1000;
    setTimeout(() => {
      test.hidden = false;
      test.start = performance.now();
      this.updateListeners({
        type: "test-state-update",
        test: { ...test },
      });
    }, test.delay);
  }
}
