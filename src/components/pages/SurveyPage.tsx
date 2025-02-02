import { AppRoutes } from "../../constants/AppRoutes";
import Flex from "../common/Flex";
import React from "react";
import SurveyContext from "../../contexts/SurveyContext";
import { makeStyles } from "@fluentui/react-components";
import { useNavigate } from "react-router";

const useStyles = makeStyles({
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

  const { image, acknowledge } = React.useContext(SurveyContext);

  const navigate = useNavigate();

  const onClick = React.useCallback(
    () => acknowledge(image),
    [acknowledge, image]
  );

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        acknowledge(image);
      }
      if (event.key === "Escape") {
        const leave = confirm("Are you sure you want to leave the survey?");
        if (leave) navigate(AppRoutes.LANDING);
      }
    },
    [acknowledge, image, navigate]
  );

  return (
    <Flex
      className={styles.container}
      justifyContent="center"
      alignItems="center"
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="presentation"
    >
      <img
        className={styles.image}
        style={{ display: image.hidden ? "none" : "unset" }}
        src={image.source}
      />
    </Flex>
  );
}
