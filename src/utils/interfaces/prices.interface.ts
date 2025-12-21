export interface Prices {
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
	createdAt: Date;
	updatedAt: Date;
	active: boolean;
}