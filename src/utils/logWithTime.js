/**
 * @param {...any} data
 * @returns {void}
 */
export function logWithTime(...data) {
	const time = new Date().toTimeString().split(" ")[0];
	console.log(time, ...data);
}
