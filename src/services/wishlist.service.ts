import DatabaseUtil from "@utils/database";
import { addGameToWishlist, checkGameExistsInWishlist, getGamesFromWishlist, deleteGameFromWishlist, getGamesFromWishlistByPlatformId } from "@utils/queries/wishlist.queries";

export default class WishlistService {
    static async addGameToWishlist(userId: string, gameId: string, platformId: string, notes: string, priceTarget: number, priority: string, retailerLink: string): Promise<any> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, addGameToWishlist, [userId, gameId, platformId, notes, priceTarget, priority, retailerLink])
            .then((res) => res.rows[0])
            .catch((err) => Promise.reject({ id: 'WishlistService.addGameToWishlist.addGameToWishlist', error: err }));
        return result;
    }

    static async checkGameExistsInWishlist(userId: string, gameId: string, platformId: string): Promise<boolean> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, checkGameExistsInWishlist, [userId, gameId, platformId])
            .then((res) => res.rows[0])
            .catch((err) => Promise.reject({ id: 'WishlistService.checkGameExistsInWishlist.checkGameExistsInWishlist', error: err }));
        return result;
    }

    static async getGamesFromWishlist(userId: string): Promise<any> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesFromWishlist, [userId])
            .then((res) => res.rows)
            .catch((err) => Promise.reject({ id: 'WishlistService.getGamesFromWishlist.getGamesFromWishlist', error: err }));
        return result;
    }

    static async deleteGameFromWishlist(userId: string, gameId: string, platformId: string): Promise<any> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, deleteGameFromWishlist, [userId, gameId, platformId])
            .then((res) => res.rows[0])
            .catch((err) => Promise.reject({ id: 'WishlistService.deleteGameFromWishlist.deleteGameFromWishlist', error: err }));
        return result;
    }

    static async getGamesFromWishlistByPlatformId(userId: string, platformId: string): Promise<any> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesFromWishlistByPlatformId, [userId, platformId])
            .then((res) => res.rows)
            .catch((err) => Promise.reject({ id: 'WishlistService.getGamesFromWishlistByPlatformId.getGamesFromWishlistByPlatformId', error: err }));
        return result;
    }
}
