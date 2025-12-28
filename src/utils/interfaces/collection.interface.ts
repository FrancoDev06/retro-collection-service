export interface Collection {
	id: string;
	gameId: string;
	title: string;
	coverImage: string;
	coverImageLarge: string;
	gameUrl: string;
	platformName: string;
	productId: string;
	publisher: string;
	developer: string;
	description: string;
	notes: string;
	pricePaid: number;
	acquiredAt: Date;
	hasBox: boolean;
	hasNotice: boolean;
	cartConditionId: string;
	cartConditionCode?: string;
	cartConditionLabel?: string;
	cartConditionDescription?: string;
	cartConditionRating?: number;
	boxConditionId: string;
	boxConditionCode?: string;
	boxConditionLabel?: string;
	boxConditionDescription?: string;
	boxConditionRating?: number;
	noticeConditionId: string;
	noticeConditionCode?: string;
	noticeConditionLabel?: string;
	noticeConditionDescription?: string;
	noticeConditionRating?: number;
	hasCart: boolean;
}

export interface AddGameCollection {
	userId: string;
	gameId: string;
	platformId: string;
	notes: string;
	pricePaid: number;
	datePurchase: string;
	hasCart: boolean;
	hasBox: boolean;
	hasNotice: boolean;
	cartConditionId: string;
	boxConditionId: string;
	noticeConditionId: string;
}

export interface AddPlatformCollection {
	userId: string;
	platformId: string;
	units: number;
	conditionStateId?: string;
	purchaseSource?: string;
	pricePaid?: number;
	acquiredAt?: string;
	notes?: string;
}

export interface CollectionPlatform {
    userId: string;
    platformId: string;
    platformName: string;
    units: number;
    conditionStateLabel: string;
    conditionStateDescription: string;
    conditionStateRating: number;
    purchaseSource: string;
    pricePaid: number;
    acquiredAt: string;
    notes: string;
}