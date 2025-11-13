export interface Game {
	id: string;
	ll_slug: string;
	ll_title: string;
	ll_cover_image: string;
	ll_game_url: string;
	ll_product_id: string;
	ll_publisher: string;
	ll_developer: string;
	ll_description: string;
	ts_released: Date;
}

export interface Platform {
	id: string;
	ll_slug: string;
	ll_name: string;
	ll_manufacturer: string;
	ll_url: string;
	ll_details: string;
}

export interface MarketPrice {
	id: string;
	ll_game_id: string;
	ll_platform_id: string;
	ll_price_type: string;
	nb_price_retail: number;
	nb_price_change: number;
	nb_price_change_percent: number;
	nb_print_run: number;
	ts_collected_at: Date;
	ll_source: string;
}

export interface Region {
	id: string;
	ll_code: string;
	ll_label: string;
}
