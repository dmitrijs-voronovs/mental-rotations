export const scale = (
	val: number,
	fromLeft: number,
	fromRight: number,
	toLeft: number,
	toRight: number
): number =>
	toLeft + ((val - fromLeft) / (fromRight - fromLeft)) * (toRight - toLeft);

export const getRandomInt = (maxNonInclusive: number) =>
	Math.floor(Math.random() * maxNonInclusive);
