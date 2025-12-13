export interface Collection {
	id: string;
	ll_user_id: string;
	ll_game_id: string;
	ll_platform_id: string;
	ll_notes: string;
	nb_price_paid: number;
	ts_acquired_at: string;
	flag_has_cart: boolean;
	flag_has_box: boolean;
	flag_has_notice: boolean;
	ll_cart_condition_id: string;
	ll_box_condition_id: string;
	ll_notice_condition_id: string;
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
	notes: string;
	pricePaid: number;
	datePurchase: string;
	cartConditionId: string;
	boxConditionId: string;
	conditionId: string;
}