import DatabaseUtil from "@utils/database";
import { CollectionPlatformsList, CollectionPlatformsGamesOwned, CollectionGameOwned, CollectionPlatformOwnedInfo, CollectionPlatformsManufacturerOwned } from "@utils/interfaces/collection.interface";


export default class CollectionService {


	//PLATFORMS
	static async getCollectionPlatformsList(userId: string): Promise<CollectionPlatformsList[]> {
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_users_platforms_collections')
			.select(`
				id_platform,
				ref_platforms!inner (
					ll_name,
					ref_regions!inner (
						ll_label,
						ll_code
					)
				),
				id_condition_state,
				ref_condition_states!inner (
					ll_label
				),
				nb_price_paid,
				ts_acquired_at
			`)
			.eq('id_user', userId)
			.eq('flag_active', true)
			.order('ts_acquired_at', { ascending: true });

		if (error) {
			throw { id: 'CollectionService.getCollectionPlatformsList.getCollectionPlatformsList', error };
		}

		return data.map((item: any) => ({
			platformId: item.id_platform,
			platformName: item.ref_platforms?.ll_name,
			regionLabel: item.ref_platforms?.ref_regions?.ll_label,
			regionCode: item.ref_platforms?.ref_regions?.ll_code,
			conditionStateId: item.id_condition_state,
			conditionStateLabel: item.ref_condition_states?.ll_label,
			pricePaid: item.nb_price_paid,
			acquiredAt: item.ts_acquired_at
		})) as CollectionPlatformsList[];
	}

	static async getCollectionPlatformOwnedInfo(userId: string, platformId: string): Promise<CollectionPlatformOwnedInfo[]> {
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_users_platforms_collections')
			.select(`
				id_user,
				id_platform,
				ref_platforms!inner (
					ll_name
				),
				nb_units,
				ref_condition_states!inner (
					ll_label,
					ll_description,
					nb_rating
				),
				ll_purchase_source,
				nb_price_paid,
				ts_acquired_at,
				ll_notes
			`)
			.eq('id_user', userId)
			.eq('id_platform', platformId)
			.eq('flag_active', true)
			.order('ts_acquired_at', { ascending: true });

		if (error) {
			throw { id: 'CollectionService.getCollectionPlatformOwnedInfo.getCollectionPlatformOwnedInfo', error };
		}

		return data.map((item: any) => ({
			userId: item.id_user,
			platformId: item.id_platform,
			platformName: item.ref_platforms?.ll_name,
			units: item.nb_units,
			conditionStateLabel: item.ref_condition_states?.ll_label,
			conditionStateDescription: item.ref_condition_states?.ll_description,
			conditionStateRating: item.ref_condition_states?.nb_rating,
			purchaseSource: item.ll_purchase_source,
			pricePaid: item.nb_price_paid,
			acquiredAt: item.ts_acquired_at,
			notes: item.ll_notes
		})) as CollectionPlatformOwnedInfo[];
	}

	static async addPlatformToCollection(userId: string, platformId: string, units: number, conditionStateId?: string, purchaseSource?: string, pricePaid?: number, acquiredAt?: string, notes?: string): Promise<{ id: string }> {
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_users_platforms_collections')
			.insert({
				id_user: userId,
				id_platform: platformId,
				nb_units: units,
				id_condition_state: conditionStateId || null,
				ll_purchase_source: purchaseSource || null,
				nb_price_paid: pricePaid || null,
				ts_acquired_at: acquiredAt || null,
				ll_notes: notes || null,
				flag_active: true
			})
			.select('id_user_platform_collection')
			.single();

		if (error) {
			throw { id: 'CollectionService.addPlatformToCollection.addPlatformToCollection', error };
		}

		return { id: data.id_user_platform_collection };
	}

	
	//GAMES
	static async getCollectionPlatformsGamesOwned(userId: string): Promise<CollectionPlatformsGamesOwned[]> {
		// Cette requête nécessite une agrégation, on utilise une requête RPC ou on fait plusieurs requêtes
		// Pour l'instant, on récupère les données et on fait l'agrégation côté application
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_users_games_collections')
			.select(`
				id_platform,
				ref_platforms!inner (
					ll_name,
					ref_regions!inner (
						ll_code,
						ll_label
					)
				),
				ll_notes,
				nb_price_paid,
				ts_acquired_at,
				flag_has_box,
				flag_has_notice,
				flag_has_cart,
				id_cart_condition,
				id_box_condition,
				id_notice_condition,
				ref_condition_states_cart:ref_condition_states!id_cart_condition (
					ll_code,
					ll_label,
					ll_description,
					nb_rating
				),
				ref_condition_states_box:ref_condition_states!id_box_condition (
					ll_code,
					ll_label,
					ll_description,
					nb_rating
				),
				ref_condition_states_notice:ref_condition_states!id_notice_condition (
					ll_code,
					ll_label,
					ll_description,
					nb_rating
				)
			`)
			.eq('id_user', userId)
			.eq('flag_active', true);


		if (error) {
			throw { id: 'CollectionService.getCollectionPlatformsGamesOwned.getCollectionPlatformsGamesOwned', error };
		}

		// Agrégation côté application
		const grouped = data.reduce((acc: any, item: any) => {
			const key = `${item.id_platform}`;
			if (!acc[key]) {
				acc[key] = {
					platformId: item.id_platform,
					platformName: item.ref_platforms?.ll_name,
					regionCode: item.ref_platforms?.ref_regions?.ll_code,
					regionName: item.ref_platforms?.ref_regions?.ll_label,
					notes: item.ll_notes,
					pricePaid: item.nb_price_paid,
					acquiredAt: item.ts_acquired_at,
					hasBox: item.flag_has_box,
					hasNotice: item.flag_has_notice,
					hasCart: item.flag_has_cart,
					cartConditionId: item.id_cart_condition,
					cartConditionCode: item.ref_condition_states_cart?.ll_code,
					cartConditionLabel: item.ref_condition_states_cart?.ll_label,
					cartConditionDescription: item.ref_condition_states_cart?.ll_description,
					cartConditionRating: item.ref_condition_states_cart?.nb_rating,
					boxConditionId: item.id_box_condition,
					boxConditionCode: item.ref_condition_states_box?.ll_code,
					boxConditionLabel: item.ref_condition_states_box?.ll_label,
					boxConditionDescription: item.ref_condition_states_box?.ll_description,
					boxConditionRating: item.ref_condition_states_box?.nb_rating,
					noticeConditionId: item.id_notice_condition,
					noticeConditionCode: item.ref_condition_states_notice?.ll_code,
					noticeConditionLabel: item.ref_condition_states_notice?.ll_label,
					noticeConditionDescription: item.ref_condition_states_notice?.ll_description,
					noticeConditionRating: item.ref_condition_states_notice?.nb_rating,
				};
			}
			return acc;
		}, {});

		return Object.values(grouped) as CollectionPlatformsGamesOwned[];
	}

	static async getCollectionGamesOwned(userId: string, platformId: string): Promise<CollectionGameOwned[]> {
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_users_games_collections')
			.select(`
				id_user_game_collection,
				ref_games!inner (
					id_game,
					ll_title,
					ll_cover_image,
					ll_cover_image_large,
					ll_game_url,
					ll_product_id,
					ll_publisher,
					ll_developer,
					ll_description
				),
				ref_platforms!inner (
					ll_name
				),
				ll_notes,
				nb_price_paid,
				ts_acquired_at,
				flag_has_box,
				flag_has_notice,
				flag_has_cart,
				id_cart_condition,
				id_box_condition,
				id_notice_condition,
				ref_condition_states_cart:ref_condition_states!id_cart_condition (
					ll_code,
					ll_label,
					ll_description,
					nb_rating
				),
				ref_condition_states_box:ref_condition_states!id_box_condition (
					ll_code,
					ll_label,
					ll_description,
					nb_rating
				),
				ref_condition_states_notice:ref_condition_states!id_notice_condition (
					ll_code,
					ll_label,
					ll_description,
					nb_rating
				)
			`)
			.eq('id_user', userId)
			.eq('id_platform', platformId)
			.eq('flag_active', true)
			.order('ref_games(ll_title)', { ascending: true });

		if (error) {
			throw { id: 'CollectionService.getCollectionGamesOwned.getCollectionGamesOwned', error };
		}

		return data.map((item: any) => ({
			idUserGameCollection: item.id_user_game_collection,
			gameId: item.ref_games?.id_game,
			title: item.ref_games?.ll_title,
			coverImage: item.ref_games?.ll_cover_image,
			coverImageLarge: item.ref_games?.ll_cover_image_large,
			gameUrl: item.ref_games?.ll_game_url,
			platformName: item.ref_platforms?.ll_name,
			productId: item.ref_games?.ll_product_id,
			publisher: item.ref_games?.ll_publisher,
			developer: item.ref_games?.ll_developer,
			description: item.ref_games?.ll_description,
			notes: item.ll_notes,
			pricePaid: item.nb_price_paid,
			acquiredAt: item.ts_acquired_at,
			hasBox: item.flag_has_box,
			hasNotice: item.flag_has_notice,
			hasCart: item.flag_has_cart,
			cartConditionId: item.id_cart_condition,
			cartConditionCode: item.ref_condition_states_cart?.ll_code,
			cartConditionLabel: item.ref_condition_states_cart?.ll_label,
			cartConditionDescription: item.ref_condition_states_cart?.ll_description,
			cartConditionRating: item.ref_condition_states_cart?.nb_rating,
			boxConditionId: item.id_box_condition,
			boxConditionCode: item.ref_condition_states_box?.ll_code,
			boxConditionLabel: item.ref_condition_states_box?.ll_label,
			boxConditionDescription: item.ref_condition_states_box?.ll_description,
			boxConditionRating: item.ref_condition_states_box?.nb_rating,
			noticeConditionId: item.id_notice_condition,
			noticeConditionCode: item.ref_condition_states_notice?.ll_code,
			noticeConditionLabel: item.ref_condition_states_notice?.ll_label,
			noticeConditionDescription: item.ref_condition_states_notice?.ll_description,
			noticeConditionRating: item.ref_condition_states_notice?.nb_rating
		})) as CollectionGameOwned[];
	}

	static async addGameToCollection(
		userId: string,
		gameId: string,
		platformId: string,
		notes: string,
		pricePaid: number,
		datePurchase: string,
		hasCart: boolean,
		hasBox: boolean,
		hasNotice: boolean,
		cartConditionId: string,
		boxConditionId: string,
		noticeConditionId: string,
	): Promise<{ id: string }> {
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_users_games_collections')
			.insert({
				id_user: userId,
				id_game: gameId,
				id_platform: platformId,
				ll_notes: notes || null,
				nb_price_paid: pricePaid || 0,
				ts_acquired_at: datePurchase || null,
				flag_has_cart: hasCart || false,
				flag_has_box: hasBox || false,
				flag_has_notice: hasNotice || false,
				id_cart_condition: cartConditionId || null,
				id_box_condition: boxConditionId || null,
				id_notice_condition: noticeConditionId || null,
				flag_active: true
			})
			.select('id_user_game_collection')
			.single();

		if (error) {
			throw { id: 'CollectionService.addGameToCollection.addGameToCollection', error };
		}

		return { id: data.id_user_game_collection };
	}

	static async deleteGameFromCollection(userId: string, idUserGameCollection: string): Promise<{ id: string }> {
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_users_games_collections')
			.update({ flag_active: false })
			.eq('id_user', userId)
			.eq('id_user_game_collection', idUserGameCollection)
			.eq('flag_active', true)
			.select('id_user_game_collection')
			.single();

		if (error) {
			throw { id: 'CollectionService.deleteGameFromCollection.deleteGameFromCollection', error };
		}

		return { id: data.id_user_game_collection };
	}

	static async deletePlatformFromCollection(userId: string, platformId: string): Promise<{ id: string }> {
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_users_platforms_collections')
			.update({ flag_active: false })
			.eq('id_user', userId)
			.eq('id_platform', platformId)
			.eq('flag_active', true)
			.select('id_user_platform_collection')
			.single();

		if (error) {
			throw { id: 'CollectionService.deletePlatformFromCollection.deletePlatformFromCollection', error };
		}

		return { id: data.id_user_platform_collection };
	}

	static async getCollectionPlatformsManufacturerOwned(userId: string): Promise<CollectionPlatformsManufacturerOwned[]> {
		// Récupérer les plateformes possédées avec leur manufacturer
		const { data: ownedPlatforms, error: ownedError } = await DatabaseUtil.supabase
			.from('assoc_users_platforms_collections')
			.select(`
				id_platform,
				ref_platforms!inner (
					ll_manufacturer
				)
			`)
			.eq('id_user', userId)
			.eq('flag_active', true);

		if (ownedError) {
			throw { id: 'CollectionService.getCollectionPlatformsManufacturerOwned.getCollectionPlatformsManufacturerOwned', error: ownedError };
		}

		// Récupérer toutes les plateformes par manufacturer pour le total
		const { data: allPlatforms, error: allError } = await DatabaseUtil.supabase
			.from('ref_platforms')
			.select('id_platform, ll_manufacturer')
			.eq('flag_active', true);

		if (allError) {
			throw { id: 'CollectionService.getCollectionPlatformsManufacturerOwned.getCollectionPlatformsManufacturerOwned', error: allError };
		}

		// Agrégation côté application
		const manufacturerMap = new Map<string, { platformsOwned: Set<string>, platformsTotal: Set<string> }>();

		// Compter les plateformes possédées par manufacturer
		ownedPlatforms.forEach((item: any) => {
			const manufacturer = item.ref_platforms?.ll_manufacturer;
			if (manufacturer) {
				if (!manufacturerMap.has(manufacturer)) {
					manufacturerMap.set(manufacturer, { platformsOwned: new Set(), platformsTotal: new Set() });
				}
				manufacturerMap.get(manufacturer)!.platformsOwned.add(item.id_platform);
			}
		});

		// Compter toutes les plateformes par manufacturer
		allPlatforms.forEach((item: any) => {
			const manufacturer = item.ll_manufacturer;
			if (manufacturer && manufacturerMap.has(manufacturer)) {
				manufacturerMap.get(manufacturer)!.platformsTotal.add(item.id_platform);
			}
		});

		return Array.from(manufacturerMap.entries()).map(([manufacturer, counts]) => ({
			manufacturer,
			platformsOwned: counts.platformsOwned.size,
			platformsTotal: counts.platformsTotal.size
		})).sort((a, b) => a.manufacturer.localeCompare(b.manufacturer)) as CollectionPlatformsManufacturerOwned[];
	}
}
