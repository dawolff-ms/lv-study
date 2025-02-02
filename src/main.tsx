import App from './App.tsx'
import ImageProvider from './data-provider/ImageProvider.ts'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const BlobStorageUrl = import.meta.env.VITE_BlobStorageUrl;

const imageProvider = new ImageProvider(BlobStorageUrl);
console.log(imageProvider.getImageList());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
