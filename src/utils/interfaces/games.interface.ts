export interface Games {
	gameId: string;
	title: string;
	coverImage: string;
	coverImageLarge: string;
	released: Date;
	genreName: string;
	platformId: string;
	platformName: string;
	inCollection?: boolean;
	inWishlist?: boolean;
}

export interface Game {
	gameId: string;
	slug: string;
	title: string;
	coverImage: string;
	coverImageLarge: string;
	gameUrl: string;
	productId: string;
	publisher: string;
	developer: string;
	description: string;
	released: Date;
	genreName: string;
	platformId: string;
	platformName: string;
}

export interface Conditions {
	conditionStateId: string;
	code: string;
	label: string;
	description: string;
	rating: number;
}

export interface GamePrices {
	marketPriceId: string;
	gameId: string;
	platformId: string;
	priceType: string;
	priceRetail: number;
	priceChange: number;
	priceChangePercent: number;
	printRun: number;
	collectedAt: Date;
	source: string;
}