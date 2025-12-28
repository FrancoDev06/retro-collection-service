import DatabaseUtil from "@utils/database";
import { addGameToWishlist, getGamesFromWishlist, deleteGameFromWishlist, getWishlistPlatforms, getWishlistPlatformGame, getPriorities } from "@utils/queries/wishlist.queries";
import { WishlistGame, WishlistPlatform, Priority } from "@utils/interfaces/wishlist.interface";

export default class WishlistService {
    static async addGameToWishlist(userId: string, gameId: string, platformId: string, priceTarget: number, notes: string, addedAt: string, priority: string, condition: string): Promise<{ id: string }> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, addGameToWishlist, [userId, gameId, platformId, priceTarget, notes, addedAt, priority, condition])
            .then((res) => res.rows[0])
            .catch((err) => Promise.reject({ id: 'WishlistService.addGameToWishlist.addGameToWishlist', error: err }));
        return result as { id: string };
    }

    static async getGamesFromWishlist(userId: string, platformId: string): Promise<WishlistGame[]> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesFromWishlist, [userId, platformId])
            .then((res) => res.rows)
            .catch((err) => Promise.reject({ id: 'WishlistService.getGamesFromWishlist.getGamesFromWishlist', error: err }));
        return result as WishlistGame[];
    }

    static async deleteGameFromWishlist(userId: string, gameId: string, platformId: string): Promise<{ id: string }> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, deleteGameFromWishlist, [userId, gameId, platformId])
            .then((res) => res.rows[0])
            .catch((err) => Promise.reject({ id: 'WishlistService.deleteGameFromWishlist.deleteGameFromWishlist', error: err }));
        return result as { id: string };
    }

    static async getWishlistPlatforms(userId: string): Promise<WishlistPlatform[]> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, getWishlistPlatforms, [userId])
            .then((res) => res.rows)
            .catch((err) => Promise.reject({ id: 'WishlistService.getWishlistPlatforms.getWishlistPlatforms', error: err }));
        return result as WishlistPlatform[];
    }

    static async getWishlistPlatformGame(userId: string, gameId: string, platformId: string): Promise<WishlistGame> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, getWishlistPlatformGame, [userId, gameId, platformId])
            .then((res) => res.rows[0])
            .catch((err) => Promise.reject({ id: 'WishlistService.getWishlistPlatformGame.getWishlistPlatformGame', error: err }));
        return result as WishlistGame;
    }

    static async getPriorities(): Promise<Priority[]> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, getPriorities, [])
            .then((res) => res.rows)
            .catch((err) => Promise.reject({ id: 'WishlistService.getPriorities.getPriorities', error: err }));
        return result as Priority[];
    }
}
