export interface AddGameWishlist {
	userId: string;
	gameId: string;
	platformId: string;
	priceTarget: number;
	notes?: string;
	addedAt: string;
	priority?: string;
	priorityId?: string;
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

export interface WishlistGamesList {
	userId: string;
	gameId: string;
	platformId: string;
	priceTarget: number;
	notes: string;
	addedAt: Date;
	active: boolean;
	condition: string;
	priority: string;
	priorityLabel: string;
	priorityDescription: string;
	priorityOrder: number;
	coverImageLarge: string;
	title: string;
	gameUrl: string;
	regionId: string;
	regionCode: string;
	regionLabel: string;
	platformName: string;
}

export interface AddPlatformWishlist {
	userId: string;
	platformId: string;
	priceTarget: number;
	notes?: string;
	addedAt: string;
	priorityId?: string;
	condition: string
}

export interface WishlistPlatformWish {
    wishlistId: string;
    platformId: string;
    priorityId: string;
    priorityLabel: string;
    condition: string;
    platformName: string;
    regionLabel: string;
    regionCode: string;
    priceTarget: number;
    notes: string;
    addedAt: Date;
}