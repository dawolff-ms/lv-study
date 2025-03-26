import {
  Body1,
  Button,
  Field,
  Radio,
  RadioGroup,
  RadioGroupOnChangeData,
  SpinButton,
  Subtitle1,
  Title1,
  makeStyles,
} from "@fluentui/react-components";

import { AppRoutes } from "../../constants/AppRoutes";
import Flex from "../common/Flex";
import { useNavigate } from "react-router";
import React from "react";
import SurveyContext from "../../contexts/SurveyContext";
import { SurveyMode } from "../../controllers/SurveyController";

const useStyles = makeStyles({
  container: {
    margin: "10% 25%",
  },
  button: {
    margin: "16px auto",
  },
});

export default function LandingPage() {
  const styles = useStyles();
  const navigate = useNavigate();

  const { mode, setMode, breakCadence, setBreakCadence } =
    React.useContext(SurveyContext);

  return (
    <Flex gap={12} className={styles.container}>
      <Title1 as="h1">Hello - thank you for participating in this study</Title1>

      <Subtitle1 as="h2">About the survey</Subtitle1>
      <Body1>
        You'll be shown a series of designs for a text box, in either light or
        dark mode based on your selection. Each design will be shown one at a
        time.
      </Body1>
      <ul>
        <li>
          <Body1>
            If you're able to see the text box, press the space bar on your
            keyboard or click your mouse.
          </Body1>
        </li>
        <li>
          <Body1>If you don't see it, don't take any action.</Body1>
        </li>
      </ul>
      <Body1>
        There are no wrong answers. It's important for us to understand which
        designs are or are not perceivable, so your honest response is
        appreciated.
      </Body1>

      <Subtitle1 as="h2">Rest breaks</Subtitle1>
      <Body1>
        You can choose how often you want to take a break while completing the
        survey. Based on your selection, the survey will automatically pause.
      </Body1>
      <Body1>
        Please feel free to close your eyes or whatever way you need to reset,
        and take as much time as you need. Once you're ready to continue, press
        the space bar on your keyboard or click your mouse.
      </Body1>
      <Body1>
        Also if at any other point you want to take a break, please let the
        moderator know.
      </Body1>

      <Subtitle1 as="h2">To begin the survey</Subtitle1>

      <Field label="Select the mode you'd like to test:">
        <RadioGroup
          value={mode}
          onChange={(_, data: RadioGroupOnChangeData) =>
            setMode(data.value as SurveyMode)
          }
        >
          {/*<Radio value="both" label="Light and Dark mode"/>*/}
          <Radio value="light" label="Light mode only" />
          <Radio value="dark" label="Dark mode only" />
        </RadioGroup>
      </Field>

      <Field label="Select how many tests to perform in a row before taking a break:">
        <SpinButton
          stepPage={5}
          min={1}
          value={breakCadence}
          onChange={(_, data) => {
            const value = data.value ?? parseInt(data.displayValue ?? "");
            if (Number.isNaN(value)) return;
            setBreakCadence(value);
          }}
        />
      </Field>

      <Button
        className={styles.button}
        appearance="primary"
        onClick={() => navigate(AppRoutes.SURVEY)}
      >
        Start Survey
      </Button>
    </Flex>
  );
}
