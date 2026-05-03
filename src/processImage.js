import path from "path";
import sharp from "sharp";
import { logWithTime } from "./utils/logWithTime.js";
import { checkFileExists } from "./utils/checkFileExists.js";


const SHARP_OUTPUT_FORMATS = /** @type {const} */ ([
	{
		ext: "jpg",
		format: "jpeg",
		options: { quality: 80, mozjpeg: true, progressive: true },
	},
	{ ext: "webp", format: "webp", options: { quality: 80, effort: 4 } },
	{ ext: "avif", format: "avif", options: { quality: 50, effort: 4 } },
]);

/**
 * @param {string} input 
 * @param {{ width: number, height?: number }[]} sizes 
 * @param {sharp.ResizeOptions} resizeOptions 
 * @param {string} dirOut 
 * @returns {Promise<void[][]>}
 */
export function processImage(input, sizes, resizeOptions, dirOut) {

	return Promise.all(sizes.map(size => {
		return Promise.all(SHARP_OUTPUT_FORMATS.map(async format => {

			const fileOut = path.join(dirOut, `${size.width}.${format.ext}`);

			const fileOutExists = await checkFileExists(fileOut);
			if (fileOutExists) return;

			const resizedBuffer = await sharp(input)
				.resize({ ...size, ...resizeOptions })
				.toBuffer();

			const pipeline = sharp(resizedBuffer);

			if (format.format === "webp" || format.format === "avif") {
				const metadata = await pipeline.metadata();
				if (metadata.width > 16383 || metadata.height > 16383) {
					pipeline.resize({
						width: 16383,
						height: 16383,
						fit: "inside",
					});
				}
			}

			await pipeline
				.toFormat(format.format, format.options)
				.toFile(fileOut);

			logWithTime(fileOut);
		}));
	}));
}
