import fs from "fs/promises";


/**
 * @param {string} filePath 
 * @returns {Promise<boolean>}
 */
export function checkFileExists(filePath) {
	return fs.access(filePath).then(() => true).catch(() => false);
}
