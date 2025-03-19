import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const imagesDir = path.join(__dirname, "..", "public", "images");
const outputPath = path.join(__dirname, "..", "src", "image-list.json");

// Function to read SVG files from directory
function getSvgImages(): string[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      console.error(`Directory not found: ${imagesDir}`);
      return [];
    }

    const svgFiles: string[] = [];

    // Function to recursively scan directories
    const scanDirectory = (dir: string, basePath: string = "") => {
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.join(basePath, item.name);

        if (item.isDirectory()) {
          // Recursively scan subdirectories
          scanDirectory(fullPath, relativePath);
        } else if (
          item.isFile() &&
          path.extname(item.name).toLowerCase() === ".svg"
        ) {
          // Add SVG file with its subdirectory path
          svgFiles.push(`/images/${relativePath.replace(/\\/g, "/")}`);
        }
      }
    };

    // Start scanning from the images directory
    scanDirectory(imagesDir);

    return svgFiles;
  } catch (error) {
    console.error("Error reading image directory:", error);
    return [];
  }
}

// Main function
function prepareImagesList(): void {
  console.log("Preparing images list for the app...");

  // Get SVG image paths
  const images = getSvgImages();

  if (images.length === 0) {
    console.log("No SVG images found in the public/images directory.");
    return;
  }

  // Write the JSON file
  try {
    fs.writeFileSync(outputPath, JSON.stringify(images, null, 2));
    console.log(
      `Successfully wrote ${images.length} image paths to ${outputPath}`
    );
  } catch (error) {
    console.error("Error writing image list JSON:", error);
  }
}

// Execute the main function
prepareImagesList();
