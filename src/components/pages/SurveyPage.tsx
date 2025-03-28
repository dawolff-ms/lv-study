import {
  Body1,
  Body1Strong,
  Button,
  FluentProvider,
  Title2,
  Title3,
  makeStyles,
  webDarkTheme,
  webLightTheme,
} from "@fluentui/react-components";

import { AppRoutes } from "../../constants/AppRoutes";
import Flex from "../common/Flex";
import React from "react";
import SurveyContext from "../../contexts/SurveyContext";
import { useNavigate } from "react-router";

const useStyles = makeStyles({
  background: {
    transition: "background-color 0.5s ease-in",
  },
  container: {
    width: "100vw",
    height: "100vh",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    pointerEvents: "none",
    userSelect: "none",
  },
});

export default function SurveyPage() {
  const styles = useStyles();
  const [focusRef, setFocusRef] = React.useState<HTMLDivElement | null>(null);

  const { test, acknowledge, start, resume, reset, status, mode, surveyId } =
    React.useContext(SurveyContext);

  const navigate = useNavigate();

  const onClick = React.useCallback(() => {
    if (status === "idle") start();
    else if (status === "in-progress" && test != null) acknowledge(test);
    else if (status === "break") resume();
  }, [status, start, acknowledge, test, resume]);

  const onExit = React.useCallback(() => {
    navigate(AppRoutes.LANDING);
    reset();
  }, [reset, navigate]);

  const handleGoToLanding = React.useCallback(
    (ev?: React.MouseEvent<HTMLButtonElement>) => {
      ev?.stopPropagation?.();
      onExit();
    },
    [onExit]
  );

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        onClick();
      }
      if (event.key === "Escape") {
        const leave =
          status === "completed"
            ? true
            : confirm(
                "Are you sure you want to leave the survey? Any progress will be lost."
              );

        if (leave) onExit();
      }
    },
    [onClick, onExit, status]
  );

  React.useEffect(() => {
    focusRef?.focus?.();
  }, [focusRef, status]);

  return (
    <FluentProvider
      theme={test?.image?.mode === "light" ? webLightTheme : webDarkTheme}
      className={styles.background}
    >
      <Flex
        ref={setFocusRef}
        className={styles.container}
        justifyContent="center"
        alignItems="center"
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={0}
        aria-label={
          status === "in-progress"
            ? "Click anywhere or press SPACE when you see a text field"
            : undefined
        }
      >
        {status === "idle" && (
          <>
            <Title2 as="h1">Click anywhere or press SPACE to begin</Title2>
            {mode === "light" && (
              <Body1Strong>
                The screen will transition to light mode once you begin.
              </Body1Strong>
            )}
            <br />
            <Button
              appearance="secondary"
              onClick={handleGoToLanding}
              onKeyDown={(ev) => ev.stopPropagation()}
            >
              Go back
            </Button>
            <br />
            {surveyId && <Body1>Survey ID: {surveyId}</Body1>}
          </>
        )}
        {status === "break" && (
          <>
            <Title2 as="h1">Take a break!</Title2>
            <Body1Strong>Click anywhere or press SPACE to continue</Body1Strong>
          </>
        )}
        {status === "in-progress" && test != null && (
          <img
            className={styles.image}
            style={{ display: test.hidden ? "none" : "unset" }}
            src={test.image.source}
          />
        )}
        {status === "completed" && (
          <>
            <Title3 as="h1">
              Survey is complete, thank you for participating!
            </Title3>
            <Button appearance="secondary" onClick={handleGoToLanding}>
              Home
            </Button>
          </>
        )}
      </Flex>
    </FluentProvider>
  );
}
