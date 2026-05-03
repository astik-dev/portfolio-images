import fs from "fs/promises";
import path from "path";
import {
	PROCESSED_PROJECTS_DIR,
	RAW_PROJECTS_DIR,
} from "./config.js";
import { processImage } from "./processImage.js";


const SCREENSHOT_OUTPUT_WIDTHS = [
	620,
	620 * 1.25,
	620 * 1.5,
	620 * 1.75,
	620 * 2,
	1420,
	1920,
];

/**
 * @param {string} project 
 * @returns {Promise<void[][][]>}
 */
export async function processScreenshots(project) {

	const screenshotsDir = path.join(RAW_PROJECTS_DIR, project, "screenshots");

	const screenshots = await fs.readdir(screenshotsDir);

	return Promise.all(screenshots.map(async screenshot => {

		const outputDir = path.join(
			PROCESSED_PROJECTS_DIR,
			project,
			"screenshots",
			path.parse(screenshot).name
		);
		await fs.mkdir(outputDir, { recursive: true });

		return processImage(
			path.join(screenshotsDir, screenshot),
			SCREENSHOT_OUTPUT_WIDTHS.map(width => ({ width })),
			{ withoutEnlargement: true },
			outputDir
		);
	}));
}
