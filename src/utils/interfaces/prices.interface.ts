export interface Prices {
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
	ts_created_at: Date;
	ts_updated_at: Date;
	flag_active: boolean;
}