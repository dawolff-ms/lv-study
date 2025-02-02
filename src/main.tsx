import App from "./App.tsx";
import ImageProvider from "./data-provider/ImageProvider.ts";
import { StrictMode } from "react";
import SurveyController from "./controllers/SurveyController.ts";
import { SurveyProvider } from "./contexts/SurveyContext.tsx";
import { createRoot } from "react-dom/client";

const BlobStorageUrl = import.meta.env.VITE_BlobStorageUrl;

const imageProvider = new ImageProvider(BlobStorageUrl);
const surveyController = new SurveyController(imageProvider);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SurveyProvider controller={surveyController}>
      <App />
    </SurveyProvider>
  </StrictMode>
);
