import DatabaseUtil from "@utils/database";
import { Conditions, Game, GamePrices, Games } from "@utils/interfaces/games.interface";

export default class GameService {


	static async getGame(platformId: string, gameId: string): Promise<Game> {
		// Récupérer le jeu avec ses relations
		const { data: gameData, error: gameError } = await DatabaseUtil.supabase
			.from('ref_games')
			.select(`
				id_game,
				ll_slug,
				ll_title,
				ll_cover_image,
				ll_cover_image_large,
				ll_game_url,
				ll_product_id,
				ll_publisher,
				ll_developer,
				ll_description,
				ts_released,
				assoc_games_platforms!inner (
					id_platform,
					ref_platforms!inner (
						id_platform,
						ll_name
					)
				)
			`)
			.eq('id_game', gameId)
			.eq('flag_active', true)
			.eq('assoc_games_platforms.id_platform', platformId)
			.eq('assoc_games_platforms.flag_active', true)
			.single();

		if (gameError) {
			throw { id: 'GameService.getGame.getGame', error: gameError };
		}

		// Récupérer les genres
		const { data: genresData } = await DatabaseUtil.supabase
			.from('assoc_games_genres')
			.select(`
				ref_genres!inner (
					ll_name
				)
			`)
			.eq('id_game', gameId)
			.eq('flag_active', true);

		const genreName = genresData?.map((item: any) => item.ref_genres?.ll_name).filter(Boolean).join(', ') || '';

		return {
			gameId: gameData.id_game,
			slug: gameData.ll_slug,
			title: gameData.ll_title,
			coverImage: gameData.ll_cover_image,
			coverImageLarge: gameData.ll_cover_image_large,
			gameUrl: gameData.ll_game_url,
			productId: gameData.ll_product_id,
			publisher: gameData.ll_publisher,
			developer: gameData.ll_developer,
			description: gameData.ll_description,
			released: gameData.ts_released,
			genreName: genreName,
			platformId: gameData.assoc_games_platforms?.[0]?.ref_platforms?.[0]?.id_platform,
			platformName: gameData.assoc_games_platforms?.[0]?.ref_platforms?.[0]?.ll_name
		} as Game;
	}

	static async getGamesLimited(limit: number, offset: number, userId: string): Promise<Games[]> {
		// Récupérer les jeux avec leurs plateformes
		const { data, error } = await DatabaseUtil.supabase
			.from('ref_games')
			.select(`
				id_game,
				ll_title,
				ll_cover_image,
				ll_cover_image_large,
				ts_released,
				assoc_games_platforms!inner (
					id_platform,
					ref_platforms!inner (
						id_platform,
						ll_name
					)
				)
			`)
			.eq('flag_active', true)
			.eq('assoc_games_platforms.flag_active', true)
			.order('ll_title', { ascending: true })
			.range(offset, offset + limit - 1);

		if (error) {
			throw { id: 'GameService.getGamesLimited.getGamesLimited', error };
		}

		// Récupérer les genres pour chaque jeu
		const gameIds = [...new Set(data.map((item: any) => item.id_game))];
		const { data: genresData } = await DatabaseUtil.supabase
			.from('assoc_games_genres')
			.select('id_game, ref_genres!inner(ll_name)')
			.in('id_game', gameIds)
			.eq('flag_active', true);

		// Récupérer les collections et wishlists si userId fourni
		let collectionData: any[] = [];
		let wishlistData: any[] = [];
		if (userId) {
			const { data: collData } = await DatabaseUtil.supabase
				.from('assoc_users_games_collections')
				.select('id_game')
				.eq('id_user', userId)
				.eq('flag_active', true)
				.in('id_game', gameIds);
			collectionData = collData || [];

			const { data: wishData } = await DatabaseUtil.supabase
				.from('assoc_users_games_wishlists')
				.select('id_game')
				.eq('id_user', userId)
				.eq('flag_active', true)
				.in('id_game', gameIds);
			wishlistData = wishData || [];
		}

		const collectionSet = new Set(collectionData.map((item: any) => item.id_game));
		const wishlistSet = new Set(wishlistData.map((item: any) => item.id_game));
		const genresMap = new Map<string, string[]>();
		genresData?.forEach((item: any) => {
			if (!genresMap.has(item.id_game)) {
				genresMap.set(item.id_game, []);
			}
			if (item.ref_genres?.ll_name) {
				genresMap.get(item.id_game)!.push(item.ref_genres.ll_name);
			}
		});

		// Transformer les données
		const result: Games[] = [];
		const processedGames = new Set<string>();

		data.forEach((item: any) => {
			const gameKey = `${item.id_game}_${item.assoc_games_platforms?.[0]?.id_platform}`;
			if (processedGames.has(gameKey)) return;
			processedGames.add(gameKey);

			const genres = genresMap.get(item.id_game) || [];
			result.push({
				gameId: item.id_game,
				title: item.ll_title,
				coverImage: item.ll_cover_image,
				coverImageLarge: item.ll_cover_image_large,
				released: item.ts_released,
				genreName: genres.sort().join(', '),
				platformId: item.assoc_games_platforms?.[0]?.ref_platforms?.id_platform,
				platformName: item.assoc_games_platforms?.[0]?.ref_platforms?.ll_name,
				inCollection: userId ? collectionSet.has(item.id_game) : false,
				inWishlist: userId ? wishlistSet.has(item.id_game) : false
			});
		});

		return result;
	}

	static async getGamesCount(): Promise<number> {
		const { count, error } = await DatabaseUtil.supabase
			.from('ref_games')
			.select('*', { count: 'exact', head: true })
			.eq('flag_active', true);

		if (error) {
			throw { id: 'GameService.getGamesCount.getGamesCount', error };
		}

		return count || 0;
	}

	static async getGamesLimitedByPlatformId(id: string, limit: number, offset: number): Promise<Games[]> {
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_games_platforms')
			.select(`
				id_game,
				ref_games!inner (
					id_game,
					ll_title,
					ll_cover_image,
					ll_cover_image_large,
					ts_released
				),
				ref_platforms!inner (
					id_platform,
					ll_name
				)
			`)
			.eq('id_platform', id)
			.eq('flag_active', true)
			.eq('ref_games.flag_active', true)
			.order('ref_games.ll_title', { ascending: true })
			.range(offset, offset + limit - 1);

		if (error) {
			throw { id: 'GameService.getGamesLimitedByPlatformId.getGamesLimitedByPlatformId', error };
		}

		// Récupérer les genres
		const gameIds = data.map((item: any) => item.id_game);
		const { data: genresData } = await DatabaseUtil.supabase
			.from('assoc_games_genres')
			.select('id_game, ref_genres!inner(ll_name)')
			.in('id_game', gameIds)
			.eq('flag_active', true);

		const genresMap = new Map<string, string[]>();
		genresData?.forEach((item: any) => {
			if (!genresMap.has(item.id_game)) {
				genresMap.set(item.id_game, []);
			}
			if (item.ref_genres?.ll_name) {
				genresMap.get(item.id_game)!.push(item.ref_genres.ll_name);
			}
		});

		return data.map((item: any) => {
			const genres = genresMap.get(item.id_game) || [];
			return {
				gameId: item.ref_games?.id_game,
				title: item.ref_games?.ll_title,
				coverImage: item.ref_games?.ll_cover_image,
				coverImageLarge: item.ref_games?.ll_cover_image_large,
				released: item.ref_games?.ts_released,
				genreName: genres.sort().join(', '),
				platformId: item.ref_platforms?.id_platform,
				platformName: item.ref_platforms?.ll_name
			};
		}) as Games[];
	}

	static async getGamesCountByPlatformId(id: string): Promise<number> {
		const { count, error } = await DatabaseUtil.supabase
			.from('assoc_games_platforms')
			.select('*', { count: 'exact', head: true })
			.eq('id_platform', id)
			.eq('flag_active', true);

		if (error) {
			throw { id: 'GameService.getGamesCountByPlatformId.getGamesCountByPlatformId', error };
		}

		return count || 0;
	}

	static async getGamesSearch(query: string, limit: number, offset: number, userId?: string): Promise<Games[]> {
		const { data, error } = await DatabaseUtil.supabase
			.from('ref_games')
			.select(`
				id_game,
				ll_title,
				ll_cover_image,
				ll_cover_image_large,
				ts_released,
				assoc_games_platforms!inner (
					id_platform,
					ref_platforms!inner (
						id_platform,
						ll_name
					)
				)
			`)
			.ilike('ll_title', `%${query}%`)
			.eq('flag_active', true)
			.eq('assoc_games_platforms.flag_active', true)
			.order('ll_title', { ascending: true })
			.range(offset, offset + limit - 1);

		if (error) {
			throw { id: 'GameService.getGamesSearch.getGamesSearch', error };
		}

		// Récupérer les genres et collections/wishlists comme dans getGamesLimited
		const gameIds = [...new Set(data.map((item: any) => item.id_game))];
		const { data: genresData } = await DatabaseUtil.supabase
			.from('assoc_games_genres')
			.select('id_game, ref_genres!inner(ll_name)')
			.in('id_game', gameIds)
			.eq('flag_active', true);

		let collectionData: any[] = [];
		let wishlistData: any[] = [];
		if (userId) {
			const { data: collData } = await DatabaseUtil.supabase
				.from('assoc_users_games_collections')
				.select('id_game')
				.eq('id_user', userId)
				.eq('flag_active', true)
				.in('id_game', gameIds);
			collectionData = collData || [];

			const { data: wishData } = await DatabaseUtil.supabase
				.from('assoc_users_games_wishlists')
				.select('id_game')
				.eq('id_user', userId)
				.eq('flag_active', true)
				.in('id_game', gameIds);
			wishlistData = wishData || [];
		}

		const collectionSet = new Set(collectionData.map((item: any) => item.id_game));
		const wishlistSet = new Set(wishlistData.map((item: any) => item.id_game));
		const genresMap = new Map<string, string[]>();
		genresData?.forEach((item: any) => {
			if (!genresMap.has(item.id_game)) {
				genresMap.set(item.id_game, []);
			}
			if (item.ref_genres?.ll_name) {
				genresMap.get(item.id_game)!.push(item.ref_genres.ll_name);
			}
		});

		const result: Games[] = [];
		const processedGames = new Set<string>();

		data.forEach((item: any) => {
			const gameKey = `${item.id_game}_${item.assoc_games_platforms?.[0]?.id_platform}`;
			if (processedGames.has(gameKey)) return;
			processedGames.add(gameKey);

			const genres = genresMap.get(item.id_game) || [];
			result.push({
				gameId: item.id_game,
				title: item.ll_title,
				coverImage: item.ll_cover_image,
				coverImageLarge: item.ll_cover_image_large,
				released: item.ts_released,
				genreName: genres.sort().join(', '),
				platformId: item.assoc_games_platforms?.[0]?.ref_platforms?.id_platform,
				platformName: item.assoc_games_platforms?.[0]?.ref_platforms?.ll_name,
				inCollection: userId ? collectionSet.has(item.id_game) : false,
				inWishlist: userId ? wishlistSet.has(item.id_game) : false
			});
		});

		return result;
	}

	static async getGamesSearchCount(searchTerm: string): Promise<number> {
		const { count, error } = await DatabaseUtil.supabase
			.from('ref_games')
			.select('*', { count: 'exact', head: true })
			.ilike('ll_title', `%${searchTerm}%`)
			.eq('flag_active', true);

		if (error) {
			throw { id: 'GameService.getGamesSearchCount.getGamesSearchCount', error };
		}

		return count || 0;
	}

	static async getGamePrices(gameId: string, platformId: string): Promise<GamePrices[]> {
		const { data, error } = await DatabaseUtil.supabase
			.from('ref_market_prices')
			.select('*')
			.eq('id_game', gameId)
			.eq('id_platform', platformId)
			.eq('flag_active', true);

		if (error) {
			throw { id: 'GameService.getGamePrices.getGamePrices', error };
		}

		return data.map((item: any) => ({
			marketPriceId: item.id_market_price,
			gameId: item.id_game,
			platformId: item.id_platform,
			priceType: item.ll_price_type,
			priceRetail: item.nb_price_retail,
			priceChange: item.nb_price_change,
			priceChangePercent: item.nb_price_change_percent,
			printRun: item.nb_print_run,
			collectedAt: item.ts_collected_at,
			source: item.ll_source
		})) as GamePrices[];
	}

	static async getGamesByPlatform(platformId: string): Promise<Games[]> {
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_games_platforms')
			.select(`
				id_game,
				ref_games!inner (
					id_game,
					ll_title
				),
				ref_platforms!inner (
					id_platform,
					ll_name
				)
			`)
			.eq('id_platform', platformId)
			.eq('flag_active', true)
			.eq('ref_games.flag_active', true)
			.order('ref_games.ll_title', { ascending: true });

		if (error) {
			throw { id: 'GameService.getGamesByPlatform.getGamesByPlatform', error };
		}

		return data.map((item: any) => ({
			gameId: item.ref_games?.id_game,
			title: item.ref_games?.ll_title,
			platformId: item.ref_platforms?.id_platform,
			platformName: item.ref_platforms?.ll_name
		})) as Games[];
	}

	static async getCartConditions(): Promise<Conditions[]> {
		const { data, error } = await DatabaseUtil.supabase
			.from('ref_condition_states')
			.select('id_condition_state, ll_code, ll_label, ll_element_type, ll_description, nb_rating')
			.eq('ll_element_type', 'cart')
			.eq('flag_active', true);

		if (error) {
			throw { id: 'GameService.getCartConditions.getCartConditions', error };
		}

		return data.map((item: any) => ({
			conditionStateId: item.id_condition_state,
			code: item.ll_code,
			label: item.ll_label,
			elementType: item.ll_element_type,
			description: item.ll_description,
			rating: item.nb_rating
		})) as Conditions[];
	}

	static async getBoxConditions(): Promise<Conditions[]> {
		const { data, error } = await DatabaseUtil.supabase
			.from('ref_condition_states')
			.select('id_condition_state, ll_code, ll_label, ll_element_type, ll_description, nb_rating')
			.eq('ll_element_type', 'box')
			.eq('flag_active', true);

		if (error) {
			throw { id: 'GameService.getBoxConditions.getBoxConditions', error };
		}

		return data.map((item: any) => ({
			conditionStateId: item.id_condition_state,
			code: item.ll_code,
			label: item.ll_label,
			elementType: item.ll_element_type,
			description: item.ll_description,
			rating: item.nb_rating
		})) as Conditions[];
	}

	static async getNoticeConditions(): Promise<Conditions[]> {
		const { data, error } = await DatabaseUtil.supabase
			.from('ref_condition_states')
			.select('id_condition_state, ll_code, ll_label, ll_element_type, ll_description, nb_rating')
			.eq('ll_element_type', 'manual')
			.eq('flag_active', true);

		if (error) {
			throw { id: 'GameService.getNoticeConditions.getNoticeConditions', error };
		}

		return data.map((item: any) => ({
			conditionStateId: item.id_condition_state,
			code: item.ll_code,
			label: item.ll_label,
			elementType: item.ll_element_type,
			description: item.ll_description,
			rating: item.nb_rating
		})) as Conditions[];
	}

}
