export interface Games {
	id: string;
	title: string;
	cover_image: string;
	cover_image_large: string;
	released: Date;
	genre_name: string;
	platform_id: string;
	platform_name: string;
}

export interface Game {
	id: string;
	slug: string;
	title: string;
	cover_image: string;
	cover_image_large: string;
	game_url: string;
	product_id: string;
	publisher: string;
	developer: string;
	description: string;
	released: Date;
	genre_name: string;
	platform_id: string;
	platform_name: string;
}

export interface ConditionsGames {
	id: string;
    code: string;
    label: string;
    element_type: string;
    description: string;
    rating: number;
}