import * as React from "react";

import SurveyController, {
  SurveyControllerEvent,
  TestState,
} from "../controllers/SurveyController";

export type SurveyContext = {
  status: SurveyStatus;
  acknowledge: (test: TestState) => void;
  start: () => void;
  reset: () => void;
  test: TestState;
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

  const [test, setTest] = React.useState<TestState>(
    controller.getCurrentTest() ?? {
      image: { source: "", mode: "dark" },
      hidden: true,
    }
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
          acknowledge: controller.acknowledge,
          start: controller.start,
          reset: controller.reset,
          test,
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
