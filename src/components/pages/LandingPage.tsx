import {
  Body1,
  Button,
  Divider,
  Select,
  SelectOnChangeData,
  SpinButton,
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

  const selectId = "mode-select";
  const cadenceId = "cadence-spinbutton";

  const { mode, setMode, breakCadence, setBreakCadence } =
    React.useContext(SurveyContext);

  return (
    <Flex gap={12} className={styles.container}>
      <Title1 as="h1">Low-vision Survey</Title1>
      <Body1>
        Lorem ipsum odor amet, consectetuer adipiscing elit. Aliquam inceptos at
        diam; lectus facilisi nibh viverra. Lobortis ligula vehicula amet sem
        quisque aliquam nibh habitant tortor. Tristique nam id aliquet quis nec
        pharetra purus dolor. Pharetra tempor ut fermentum purus purus ac
        porttitor. Phasellus cubilia curae quis ipsum maximus non fringilla.
      </Body1>
      <Body1>
        Gravida taciti metus aenean a sociosqu eleifend cubilia. Parturient
        dolor lacus dui ac congue inceptos euismod lacinia. Porttitor
        suspendisse mauris ut porttitor mi nisi facilisis. Natoque justo litora
        per ut pretium feugiat proin. Suscipit montes ornare quam varius viverra
        vehicula leo.
      </Body1>
      <Body1>
        Porta massa class pellentesque auctor neque malesuada turpis cursus.
        Turpis adipiscing neque aliquam nascetur per suspendisse consectetur
        amet fusce. Proin litora velit vestibulum placerat interdum orci eros
        mattis. Molestie hac turpis lacus rhoncus pretium. Fermentum curabitur
        parturient sapien mollis ut nostra accumsan senectus.
      </Body1>

      <br />
      <Divider />
      <br />

      <label htmlFor={selectId}>Select the mode you'd like to test:</label>
      <Select
        id={selectId}
        value={mode}
        onChange={(_, data: SelectOnChangeData) =>
          setMode(data.value as SurveyMode)
        }
      >
        {/*<option value="both">Light and Dark mode</option>*/}
        <option value="light">Light mode only</option>
        <option value="dark">Dark mode only</option>
      </Select>

      <label htmlFor={cadenceId}>
        Select how many tests to perform in a row before taking a break:
      </label>
      <SpinButton
        id={cadenceId}
        stepPage={5}
        min={1}
        value={breakCadence}
        onChange={(_, data) => {
          const value = data.value ?? parseInt(data.displayValue ?? "");
          if (Number.isNaN(value)) return;
          setBreakCadence(value);
        }}
      />

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
