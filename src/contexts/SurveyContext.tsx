import * as React from "react";

import SurveyController, {
  ImageState,
  SurveyControllerEvent,
} from "../controllers/SurveyController";

export type SurveyContext = {
  isLoading: boolean;
  isCompleted: boolean;
  acknowledge: (image: ImageState) => void;
  image: ImageState;
  error?: Error;
};

const SurveyContext = React.createContext<SurveyContext>({} as SurveyContext);

export function SurveyProvider(
  props: React.PropsWithChildren<{
    controller: SurveyController;
  }>
): JSX.Element {
  const { controller, children } = props;

  const [isLoading, setIsLoading] = React.useState(true);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const [image, setImage] = React.useState<ImageState>(
    controller.getCurrentImage() ?? { hidden: true, source: "" }
  );

  React.useEffect(() => {
    controller.initialization
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [controller]);

  React.useEffect(() => {
    const listener = (event: SurveyControllerEvent) => {
      switch (event.type) {
        case "survey-completed":
          setIsCompleted(true);
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
          isLoading,
          isCompleted,
          acknowledge: controller.acknowledge,
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
