export interface Collection {
	id: string;
	ll_user_id: string;
	ll_game_id: string;
	ll_platform_id: string;
	ll_status: string;
	ll_edition: string;
	ll_format: string;
	ll_notes: string;
	nb_price_paid: number;
	ts_acquired_at: Date;
	flag_has_box: boolean;
	flag_has_manual: boolean;
	ll_cart_condition_id: string;
	ll_box_condition_id: string;
	ll_manual_condition_id: string;
}

export interface AddGameCollection {
	userId: string;
	gameId: string;
	platformId: string;
	status: string;
	edition: string;
	format: string;
	notes: string;
	pricePaid: number;
	datePurchase: string;
	hasBox: boolean;
	hasNotice: boolean;
	cartConditionId: string;
	boxConditionId: string;
	noticeConditionId: string;
	hasGame: boolean;
}

export interface AddPlatformCollection {
	userId: string;
	platformId: string;
	units: number;
	conditionId: string;
	purchaseSource: string;
	pricePaid: number;
	datePurchase: string;
	notes: string;
}