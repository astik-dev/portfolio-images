import fs from "fs/promises";
import path from "path";
import { checkFileExists } from "./utils/checkFileExists.js";
import {
	PROCESSED_PROJECTS_DIR,
	RAW_PROJECTS_DIR,
} from "./config.js";
import { processImage } from "./processImage.js";


const THUMBNAIL_OUTPUT_WIDTHS = [ 400, 600, 800, 1000, 1200, 1400 ];

const THUMBNAIL_OUTPUT_ASPECT_RATIO = 2;

/**
 * @param {string} project 
 * @returns {Promise<void[][]>}
 */
export async function processThumbnail(project) {

	const thumbnailPath = path.join(RAW_PROJECTS_DIR, project, "thumbnail.png");
	
	const inputThumbnailPath = await checkFileExists(thumbnailPath)
		? thumbnailPath
		: path.join(RAW_PROJECTS_DIR, project, "screenshots", "1.png"); 

	const outputDir = path.join(PROCESSED_PROJECTS_DIR, project, "thumbnail");
	await fs.mkdir(outputDir, { recursive: true });

	const sizes = THUMBNAIL_OUTPUT_WIDTHS.map(width => {
		return { width, height: width / THUMBNAIL_OUTPUT_ASPECT_RATIO };
	});

	return processImage(
		inputThumbnailPath,
		sizes,
		{ position: "top", withoutEnlargement: true },
		outputDir
	);
}
