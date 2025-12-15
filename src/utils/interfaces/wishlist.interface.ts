export interface AddGameWishlist {
	userId: string;
	gameId: string;
	platformId: string;
	notes: string;
	priceTarget: number;
	priority: string;
	retailerLink: string;
}