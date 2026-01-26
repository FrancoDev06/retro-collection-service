import DatabaseUtil from "@utils/database";
import { WishlistGame, WishlistPlatform, Priority, WishlistGamesList, WishlistPlatformWish } from "@utils/interfaces/wishlist.interface";

export default class WishlistService {
    static async addGameToWishlist(userId: string, gameId: string, platformId: string, priceTarget: number, notes: string, addedAt: string, priority: string, condition: string): Promise<{ id: string }> {
        console.log('WishlistService.addGameToWishlist.addGameToWishlist', userId, gameId, platformId, priceTarget, notes, addedAt, priority, condition);
        const { data, error } = await DatabaseUtil.supabase
            .from('assoc_users_games_wishlists')
            .insert({
                id_user: userId,
                id_game: gameId,
                id_platform: platformId,
                nb_price_target: priceTarget,
                ll_notes: notes,
                ts_added_at: addedAt,
                id_priority: priority,
                ll_condition: condition,
                flag_active: true
            })
            .select('id_user_game_wishlist')
            .single();

        if (error) {
            throw { id: 'WishlistService.addGameToWishlist.addGameToWishlist', error };
        }

        return { id: data.id_user_game_wishlist };
    }

    static async getGamesFromWishlist(userId: string, platformId: string): Promise<WishlistGame[]> {
        const { data, error } = await DatabaseUtil.supabase
            .from('assoc_users_games_wishlists')
            .select(`
                id_user,
                id_game,
                ref_games!inner (
                    ll_title,
                    ll_cover_image,
                    ll_cover_image_large,
                    ll_game_url
                ),
                ref_platforms!inner (
                    ll_name,
                    ref_regions!inner (
                        ll_label
                    )
                ),
                nb_price_target,
                ll_notes,
                ts_added_at,
                id_priority,
                ref_priorities!inner (
                    ll_label
                ),
                ll_condition
            `)
            .eq('id_user', userId)
            .eq('id_platform', platformId)
            .eq('flag_active', true)
            .order('ref_priorities.nb_order', { ascending: true })
            .order('ref_games.ll_title', { ascending: true });

        if (error) {
            throw { id: 'WishlistService.getGamesFromWishlist.getGamesFromWishlist', error };
        }

        return data.map((item: any) => {
            const platform = Array.isArray(item.ref_platforms) ? item.ref_platforms[0] : item.ref_platforms;
            const region = Array.isArray(platform?.ref_regions) ? platform?.ref_regions[0] : platform?.ref_regions;
            const priority = Array.isArray(item.ref_priorities) ? item.ref_priorities[0] : item.ref_priorities;
            const game = Array.isArray(item.ref_games) ? item.ref_games[0] : item.ref_games;
            
            return {
                wishlistId: item.id_user_game_wishlist,
                gameId: item.id_game,
                platformId: platform?.id_platform || item.id_platform,
                title: game?.ll_title,
                coverImage: game?.ll_cover_image,
                coverImageLarge: game?.ll_cover_image_large,
                gameUrl: game?.ll_game_url,
                platformName: platform?.ll_name,
                priceTarget: item.nb_price_target,
                priority: item.id_priority || priority?.ll_label || '',
                notes: item.ll_notes,
                addedAt: item.ts_added_at
            };
        }) as WishlistGame[];
    }

    static async deleteGameFromWishlist(userId: string, gameId: string, platformId: string): Promise<{ id: string }> {
        const { data, error } = await DatabaseUtil.supabase
            .from('assoc_users_games_wishlists')
            .update({ flag_active: false })
            .eq('id_user', userId)
            .eq('id_game', gameId)
            .eq('id_platform', platformId)
            .eq('flag_active', true)
            .select('id_user_game_wishlist')
            .single();

        if (error) {
            throw { id: 'WishlistService.deleteGameFromWishlist.deleteGameFromWishlist', error };
        }

        return { id: data.id_user_game_wishlist };
    }

    static async getWishlistPlatforms(userId: string): Promise<WishlistPlatform[]> {
        const { data, error } = await DatabaseUtil.supabase
            .from('assoc_users_games_wishlists')
            .select(`
                id_platform,
                ref_platforms!inner (
                    id_platform,
                    ll_name
                ),
                nb_price_target
            `)
            .eq('id_user', userId)
            .eq('flag_active', true);

        if (error) {
            throw { id: 'WishlistService.getWishlistPlatforms.getWishlistPlatforms', error };
        }

        // Agrégation côté application
        const grouped = data.reduce((acc: any, item: any) => {
            const key = item.id_platform;
            const platform = Array.isArray(item.ref_platforms) ? item.ref_platforms[0] : item.ref_platforms;
            if (!acc[key]) {
                acc[key] = {
                    platformId: item.id_platform,
                    platformName: platform?.ll_name,
                    totalValue: 0,
                    gamesCount: 0
                };
            }
            acc[key].gamesCount++;
            acc[key].totalValue += item.nb_price_target || 0;
            return acc;
        }, {});

        return Object.values(grouped).sort((a: any, b: any) => 
            a.platformName.localeCompare(b.platformName)
        ) as WishlistPlatform[];
    }

    static async getWishlistPlatformGame(userId: string, gameId: string, platformId: string): Promise<WishlistGame> {
        const { data, error } = await DatabaseUtil.supabase
            .from('assoc_users_games_wishlists')
            .select(`
                id_user_game_wishlist,
                id_game,
                id_platform,
                id_priority,
                ref_games!inner (
                    id_game,
                    ll_title,
                    ll_cover_image,
                    ll_cover_image_large,
                    ll_game_url
                ),
                ref_platforms!inner (
                    id_platform,
                    ll_name
                ),
                nb_price_target,
                ll_notes,
                ts_added_at
            `)
            .eq('id_user', userId)
            .eq('id_game', gameId)
            .eq('id_platform', platformId)
            .eq('flag_active', true)
            .single();

        if (error) {
            throw { id: 'WishlistService.getWishlistPlatformGame.getWishlistPlatformGame', error };
        }

        const dataAny = data as any;
        const platform: any = Array.isArray(dataAny.ref_platforms) ? dataAny.ref_platforms[0] : dataAny.ref_platforms;
        const game: any = Array.isArray(dataAny.ref_games) ? dataAny.ref_games[0] : dataAny.ref_games;
        
        return {
            wishlistId: dataAny.id_user_game_wishlist,
            gameId: game?.id_game || dataAny.id_game,
            title: game?.ll_title,
            coverImage: game?.ll_cover_image,
            coverImageLarge: game?.ll_cover_image_large,
            gameUrl: game?.ll_game_url,
            platformId: platform?.id_platform || dataAny.id_platform,
            platformName: platform?.ll_name,
            priceTarget: dataAny.nb_price_target,
            priority: dataAny.id_priority || '',
            notes: dataAny.ll_notes,
            addedAt: dataAny.ts_added_at
        } as WishlistGame;
    }

    static async getPriorities(): Promise<Priority[]> {
        const { data, error } = await DatabaseUtil.supabase
            .from('ref_priorities')
            .select('id_priority, ll_code, ll_label, nb_order, ll_description')
            .order('nb_order', { ascending: true });

        if (error) {
            throw { id: 'WishlistService.getPriorities.getPriorities', error };
        }

        return data.map((item: any) => ({
            priorityId: item.id_priority,
            code: item.ll_code,
            label: item.ll_label,
            order: item.nb_order,
            description: item.ll_description
        })) as Priority[];
    }

    static async getGamesList(userId: string): Promise<WishlistGamesList[]> {
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_users_games_wishlists')
			.select(`
				id_user,
				id_game,
				id_platform,
				nb_price_target,
				ll_notes,
				ts_added_at,
				flag_active,
				ll_condition,
				id_priority,
				ref_priorities (
					ll_label,
					ll_description,
					nb_order
				),
				ref_games!inner (
					ll_cover_image_large,
					ll_title,
					ll_game_url,
					id_region,
					ref_regions (
						ll_code,
						ll_label
					)
				),
				ref_platforms!inner (
					ll_name
				)
			`)
			.eq('id_user', userId)
			.eq('flag_active', true)
			.order('ref_priorities.nb_order', { ascending: true })
			.order('ref_games.ll_title', { ascending: true });

		if (error) {
			throw { id: 'WishlistService.getGamesList.getGamesList', error };
		}

		return data.map((item: any) => {
			const priority = Array.isArray(item.ref_priorities) ? item.ref_priorities[0] : item.ref_priorities;
			const region = Array.isArray(item.ref_games?.ref_regions) ? item.ref_games?.ref_regions[0] : item.ref_games?.ref_regions;
			const platform = Array.isArray(item.ref_platforms) ? item.ref_platforms[0] : item.ref_platforms;
			
			return {
				userId: item.id_user,
				gameId: item.id_game,
				platformId: item.id_platform,
				priceTarget: item.nb_price_target,
				notes: item.ll_notes,
				addedAt: item.ts_added_at,
				active: item.flag_active,
				condition: item.ll_condition,
				priority: item.id_priority,
				priorityLabel: priority?.ll_label,
				priorityDescription: priority?.ll_description,
				priorityOrder: priority?.nb_order,
				coverImageLarge: item.ref_games?.ll_cover_image_large,
				title: item.ref_games?.ll_title,
				gameUrl: item.ref_games?.ll_game_url,
				regionId: item.ref_games?.id_region,
				regionCode: region?.ll_code,
				regionLabel: region?.ll_label,
				platformName: platform?.ll_name
			};
		}) as WishlistGamesList[];
	}

    static async addPlatformToWishlist(userId: string, platformId: string, priceTarget: number, notes: string, addedAt: string, priority: string, condition: string): Promise<{ id: string }> {
        const { data, error } = await DatabaseUtil.supabase
            .from('assoc_users_platforms_wishlists')
            .insert({
                id_user: userId,
                id_platform: platformId,
                nb_price_target: priceTarget,
                ll_notes: notes,
                ts_added_at: addedAt,
                id_priority: priority,
                ll_condition: condition,
                flag_active: true
            })
            .select('id_user_platform_wishlist')
            .single();

        if (error) {
            throw { id: 'WishlistService.addPlatformToWishlist.addPlatformToWishlist', error };
        }

        return { id: data.id_user_platform_wishlist };
    }

    static async getPlatformsFromWishlist(userId: string): Promise<WishlistPlatformWish[]> {
        const { data, error } = await DatabaseUtil.supabase
            .from('assoc_users_platforms_wishlists')
            .select(`
                id_user_platform_wishlist,
                id_platform,
                id_priority,
                ref_priorities!inner (
                    ll_label
                ),
                ll_condition,
                ref_platforms!inner (
                    ll_name,
                    ref_regions (
                        ll_label,
                        ll_code
                    )
                ),
                nb_price_target,
                ll_notes,
                ts_added_at
            `)
            .eq('id_user', userId)
            .eq('flag_active', true)
            .order('ref_priorities.nb_order', { ascending: true })
            .order('ref_platforms.ll_name', { ascending: true });

        if (error) {
            throw { id: 'WishlistService.getPlatformsFromWishlist.getPlatformsFromWishlist', error };
        }

        return data.map((item: any) => {
            const priority = Array.isArray(item.ref_priorities) ? item.ref_priorities[0] : item.ref_priorities;
            const platform = Array.isArray(item.ref_platforms) ? item.ref_platforms[0] : item.ref_platforms;
            const region = Array.isArray(platform?.ref_regions) ? platform?.ref_regions[0] : platform?.ref_regions;
            
            return {
                wishlistId: item.id_user_platform_wishlist,
                platformId: item.id_platform,
                priorityId: item.id_priority,
                priorityLabel: priority?.ll_label,
                condition: item.ll_condition,
                platformName: platform?.ll_name,
                regionLabel: region?.ll_label,
                regionCode: region?.ll_code,
                priceTarget: item.nb_price_target,
                notes: item.ll_notes,
                addedAt: item.ts_added_at
            };
        }) as WishlistPlatformWish[];
    }
}
