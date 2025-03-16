import App from "./App.tsx";
import ImageProvider from "./data-provider/ImageProvider.ts";
import { StrictMode } from "react";
import SurveyController from "./controllers/SurveyController.ts";
import { SurveyProvider } from "./contexts/SurveyContext.tsx";
import { createRoot } from "react-dom/client";
import ResultsProvider from "./data-provider/ResultsProvider.ts";

import images from "./image-list.json";
console.log(images);

const BlobStorageUrl = import.meta.env.VITE_BlobStorageUrl;

const imageProvider = new ImageProvider(BlobStorageUrl);
const resultsProvider = new ResultsProvider();
const surveyController = new SurveyController(imageProvider, resultsProvider);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SurveyProvider controller={surveyController}>
      <App />
    </SurveyProvider>
  </StrictMode>
);
