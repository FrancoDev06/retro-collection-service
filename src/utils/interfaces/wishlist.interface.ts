export interface AddGameWishlist {
	userId: string;
	gameId: string;
	platformId: string;
	notes: string;
	priceTarget: number;
	priority: string;
	retailerLink: string;
}

export interface WishlistGame {
	wishlistId: string;
	gameId: string;
	title: string;
	coverImage: string;
	coverImageLarge: string;
	gameUrl: string;
	platformId: string;
	platformName: string;
	priceTarget: number;
	priority: string;
	notes: string;
	retailerLink: string;
	addedAt: Date;
}

export interface WishlistPlatform {
	platformId: string;
	platformName: string;
	totalValue: number;
}