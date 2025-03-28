import { BrowserRouter, Route, Routes } from "react-router";
import {
  FluentProvider,
  makeStyles,
  webDarkTheme,
} from "@fluentui/react-components";

import { AppRoutes } from "./constants/AppRoutes";
import LandingPage from "./components/pages/LandingPage";
import SurveyPage from "./components/pages/SurveyPage";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    width: "100%",
    minHeight: "100vh",
  },
});

export default function App() {
  const styles = useStyles();
  return (
    <FluentProvider theme={webDarkTheme} className={styles.root}>
      <BrowserRouter>
        <Routes>
          <Route path={AppRoutes.LANDING} element={<LandingPage />} />
          <Route path={AppRoutes.SURVEY} element={<SurveyPage />} />
        </Routes>
      </BrowserRouter>
    </FluentProvider>
  );
}
