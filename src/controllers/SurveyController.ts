import { nanoid } from "nanoid";
import {
  ImageMode,
  ImageProvider,
  ImageState,
} from "../data-provider/images/ImageProvider";
import ResultsProvider from "../data-provider/ResultsProvider";

import Listenable from "../utils/Listenable";

export type SurveyMode = ImageMode | "both";

export type TestState = {
  image: ImageState;
  hidden: boolean;
  start?: number;
  delay?: number;
  showTimeout?: NodeJS.Timeout;
  skipTimeout?: NodeJS.Timeout;
};

export type SurveyControllerEvent =
  | { type: "test-state-update"; test: TestState }
  | { type: "survey-started" }
  | { type: "survey-completed" }
  | { type: "survey-reset" };

export default class SurveyController extends Listenable<SurveyControllerEvent> {
  private SKIP_TIMEOUT_MS = 20000;

  private imageProvider: ImageProvider;
  private resultsProvider: ResultsProvider;

  private allTests: TestState[] = [];
  private currentTests: TestState[] = [];
  private currentIndex = -1;

  private mode: SurveyMode = "light";
  private userId?: string;

  private _initialization: Promise<void>;
  public get initialization(): Promise<void> {
    return this._initialization;
  }

  constructor(imageProvider: ImageProvider, resultsProvider: ResultsProvider) {
    super();
    this.imageProvider = imageProvider;
    this.resultsProvider = resultsProvider;

    this.initialize = this.initialize.bind(this);
    this.getCurrentTest = this.getCurrentTest.bind(this);
    this.start = this.start.bind(this);
    this.acknowledge = this.acknowledge.bind(this);
    this.skip = this.skip.bind(this);
    this.reset = this.reset.bind(this);
    this.setMode = this.setMode.bind(this);
    this.queueNextImage = this.queueNextImage.bind(this);

    this._initialization = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      const images = await this.imageProvider.getImageList();
      this.allTests = images.map((image) => ({ image, hidden: true }));
    } catch (error) {
      console.error(
        "Something went wrong while initializing the SurveyController",
        error
      );
      throw error;
    }
  }

  public getCurrentTest(): TestState {
    return this.currentTests[this.currentIndex];
  }

  public start(): void {
    this.reset();
    this.userId = nanoid(8);

    this.updateListeners({ type: "survey-started" });
    this.queueNextImage();
  }

  public acknowledge(test: TestState): void {
    const currentTest = this.currentTests[this.currentIndex];
    if (test.image.source !== currentTest.image.source) return;
    if (currentTest.start == null) return;
    if (this.userId == null) return;

    // Prevent the skip timeout from triggering.
    clearTimeout(currentTest.skipTimeout);

    const now = performance.now();
    const duration = Math.floor(now - currentTest.start);

    console.log(
      `Acknowledged image ${currentTest.image.source} in ${duration}ms`
    );

    this.resultsProvider.createResult({
      UserID: this.userId,
      TestName: currentTest.image.name,
      TestNumber: this.currentIndex,
      Duration: duration,
      Delay: currentTest.delay ?? 0,
      Acknowledged: true,
    });
    this.queueNextImage();
  }

  public skip(test: TestState): void {
    const currentTest = this.currentTests[this.currentIndex];
    if (test.image.source !== currentTest.image.source) return;
    if (this.userId == null) return;

    console.log(`Skipped image ${currentTest.image.source}`);

    this.resultsProvider.createResult({
      UserID: this.userId,
      TestName: currentTest.image.name,
      TestNumber: this.currentIndex,
      Delay: currentTest.delay ?? 0,
      Acknowledged: false,
    });
    this.queueNextImage();
  }

  public reset(): void {
    // Clear out the current test, if applicable.
    const currentTest = this.currentTests[this.currentIndex];
    if (currentTest != null) {
      clearTimeout(currentTest.showTimeout);
      clearTimeout(currentTest.skipTimeout);
    }

    // Recreate our current tests array, reset our index.
    this.currentIndex = -1;
    this.currentTests = this.allTests
      .filter((test) => {
        if (this.mode === "both") return true;
        return test.image.mode === this.mode;
      })
      .map((test) => ({ ...test }));

    this.updateListeners({ type: "survey-reset" });
  }

  /**
   * Sets the mode of the survey. This will determine which images are shown.
   * @param mode the mode to set the survey to.
   */
  public setMode(mode: SurveyMode): void {
    this.mode = mode;
  }

  private queueNextImage(): void {
    this.currentIndex++;
    if (this.currentIndex >= this.currentTests.length) {
      this.updateListeners({ type: "survey-completed" });
      return;
    }

    const test = this.currentTests[this.currentIndex];
    test.hidden = true;
    this.updateListeners({
      type: "test-state-update",
      test: { ...test },
    });

    test.delay = Math.floor(Math.random() * 5000) + 1000;

    // Timeout for the delay before showing the image.
    test.showTimeout = setTimeout(() => {
      test.hidden = false;
      test.start = performance.now();
      this.updateListeners({
        type: "test-state-update",
        test: { ...test },
      });
    }, test.delay);

    // Timeout for when we auto-skip the image.
    test.skipTimeout = setTimeout(() => {
      this.skip(test);
    }, test.delay + this.SKIP_TIMEOUT_MS);
  }
}
