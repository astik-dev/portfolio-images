import fs from "fs/promises";
import { processThumbnail } from "./processThumbnail.js";
import { processScreenshots } from "./processScreenshots.js";
import { logWithTime } from "./utils/logWithTime.js";
import { RAW_PROJECTS_DIR } from "./config.js";


/**
 * @param {number} ms 
 * @returns {string}
 */
const msToS = ms => (ms / 1000).toFixed(1) + " s";

/**
 * @returns {Promise<void>}
 */
async function processProjects() {

	const projectDirents =
		await fs.readdir(RAW_PROJECTS_DIR, { withFileTypes: true });

	const projectDirNames =
		projectDirents.filter(e => e.isDirectory()).map(e => e.name);

	const thumbnailsStart = performance.now();
	await Promise.all(projectDirNames.map(project => processThumbnail(project)));
	logWithTime(
		`Thumbnails processed in ${msToS(performance.now() - thumbnailsStart)}\n`
	);

	const screenshotsStart = performance.now();
	await Promise.all(projectDirNames.map(project => processScreenshots(project)));
	logWithTime(
		`Screenshots processed in ${msToS(performance.now() - screenshotsStart)}\n`
	);
}

processProjects();
