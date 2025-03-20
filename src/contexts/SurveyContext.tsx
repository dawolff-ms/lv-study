import * as React from "react";

import SurveyController, {
  SurveyControllerEvent,
  TestState,
} from "../controllers/SurveyController";

export type SurveyContext = {
  status: SurveyStatus;
  test?: TestState;
  acknowledge: (test: TestState) => void;
  start: () => void;
  reset: () => void;
  setMode: (mode: "light" | "dark" | "both") => void;
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

  const [test, setTest] = React.useState<TestState>();

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
          setTest(undefined);
          break;
        case "survey-completed":
          setStatus("completed");
          break;
        case "test-state-update":
          setTest(event.test);
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
          test,
          acknowledge: controller.acknowledge,
          start: controller.start,
          reset: controller.reset,
          setMode: controller.setMode,
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
