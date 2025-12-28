export interface AddGameWishlist {
	userId: string;
	gameId: string;
	platformId: string;
	priceTarget: number;
	notes?: string;
	addedAt: string;
	priority: string;
	condition: string
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
	addedAt: Date;
}

export interface WishlistPlatform {
	platformId: string;
	platformName: string;
	totalValue: number;
	gamesCount: number;
}

export interface Priority {
	priorityId: string;
    code: string;
	label: string;
	order: number;
	description: string;
}