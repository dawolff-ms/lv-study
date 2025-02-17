import * as React from "react";

import SurveyController, {
  ImageState,
  SurveyControllerEvent,
} from "../controllers/SurveyController";

export type SurveyContext = {
  status: SurveyStatus;
  acknowledge: (image: ImageState) => void;
  start: () => void;
  reset: () => void;
  image: ImageState;
  error?: Error;
};

type SurveyStatus = "loading" | "completed" | "idle" | "in-progress";

const SurveyContext = React.createContext<SurveyContext>({} as SurveyContext);

export function SurveyProvider(
  props: React.PropsWithChildren<{
    controller: SurveyController;
  }>
): JSX.Element {
  const { controller, children } = props;

  const [status, setStatus] = React.useState<SurveyStatus>("loading");
  const [error, setError] = React.useState<Error | null>(null);

  const [image, setImage] = React.useState<ImageState>(
    controller.getCurrentImage() ?? { hidden: true, source: "" }
  );

  React.useEffect(() => {
    controller.initialization.catch(setError).finally(() => setStatus("idle"));
  }, [controller]);

  React.useEffect(() => {
    const listener = (event: SurveyControllerEvent) => {
      switch (event.type) {
        case "survey-started":
          setStatus("in-progress");
          break;
        case "survey-reset":
          setStatus("idle");
          break;
        case "survey-completed":
          setStatus("completed");
          break;
        case "image-state-update":
          setImage(event.image);
          break;
      }
    };

    controller.addListener(listener);
    return () => {
      controller.removeListener(listener);
    };
  }, [controller]);

  return (
    <SurveyContext.Provider
      value={
        {
          status,
          acknowledge: controller.acknowledge,
          start: controller.start,
          reset: controller.reset,
          image,
          error,
        } as SurveyContext
      }
    >
      {children}
    </SurveyContext.Provider>
  );
}

export const SurveyConsumer = SurveyContext.Consumer;
export default SurveyContext;
