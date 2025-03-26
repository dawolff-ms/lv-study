import * as React from "react";

import SurveyController, {
  SurveyControllerEvent,
  SurveyMode,
  TestState,
} from "../controllers/SurveyController";

export type SurveyContext = {
  status: SurveyStatus;
  test?: TestState;
  acknowledge: (test: TestState) => void;
  start: () => void;
  resume: () => void;
  reset: () => void;
  setMode: (mode: SurveyMode) => void;
  mode: SurveyMode;
  setBreakCadence: (cadence: number) => void;
  breakCadence: number;
  error?: Error;
};

type SurveyStatus = "loading" | "completed" | "idle" | "in-progress" | "break";

const SurveyContext = React.createContext<SurveyContext>({} as SurveyContext);

export function SurveyProvider(
  props: React.PropsWithChildren<{
    controller: SurveyController;
  }>
): JSX.Element {
  const { controller, children } = props;

  const [status, setStatus] = React.useState<SurveyStatus>("loading");
  const [mode, setMode] = React.useState<SurveyMode>(controller.getMode());
  const [breakCadence, setBreakCadence] = React.useState<number>(
    controller.getBreakCadence()
  );
  const [error, setError] = React.useState<Error | null>(null);

  const [test, setTest] = React.useState<TestState>();

  React.useEffect(() => {
    controller.initialization.catch(setError).finally(() => setStatus("idle"));
  }, [controller]);

  const setModeHandler = React.useCallback(
    (mode: SurveyMode) => {
      controller.setMode(mode);
      setMode(mode);
    },
    [controller]
  );

  const setBreakCadenceHandler = React.useCallback(
    (cadence: number) => {
      controller.setBreakCadence(cadence);
      setBreakCadence(cadence);
    },
    [controller]
  );

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
        case "survey-break":
          setStatus("break");
          break;
        case "survey-completed":
          setStatus("completed");
          break;
        case "test-state-update":
          setStatus("in-progress");
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
          resume: controller.resume,
          reset: controller.reset,
          setMode: setModeHandler,
          mode,
          setBreakCadence: setBreakCadenceHandler,
          breakCadence,
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
