import App from "./App.tsx";
import { StrictMode } from "react";
import SurveyController from "./controllers/SurveyController.ts";
import { SurveyProvider } from "./contexts/SurveyContext.tsx";
import { createRoot } from "react-dom/client";
import ResultsProvider from "./data-provider/ResultsProvider.ts";
import ImageProviderFactory from "./data-provider/images/ImageProvider.ts";

const imageProvider = ImageProviderFactory.create();
const resultsProvider = new ResultsProvider();
const surveyController = new SurveyController(imageProvider, resultsProvider);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SurveyProvider controller={surveyController}>
      <App />
    </SurveyProvider>
  </StrictMode>
);
