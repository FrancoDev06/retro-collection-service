import DatabaseUtil from "@utils/database";
import { addGameToWishlist, checkGameExistsInWishlist, getGamesFromWishlist, deleteGameFromWishlist, getWishlistPlatforms, getWishlistPlatformGame } from "@utils/queries/wishlist.queries";
import { WishlistGame, WishlistPlatform } from "@utils/interfaces/wishlist.interface";

export default class WishlistService {
    static async addGameToWishlist(userId: string, gameId: string, platformId: string, notes: string, priceTarget: number, priority: string, retailerLink: string): Promise<{ id: string }> {
        console.log('userId:', userId);
        console.log('gameId:', gameId);
        console.log('platformId:', platformId);
        console.log('notes:', notes);
        console.log('priceTarget:', priceTarget);
        console.log('priority:', priority);
        console.log('retailerLink:', retailerLink);
        const result = await DatabaseUtil.query(DatabaseUtil.pool, addGameToWishlist, [userId, gameId, platformId, notes, priceTarget, priority, retailerLink])
            .then((res) => res.rows[0])
            .catch((err) => Promise.reject({ id: 'WishlistService.addGameToWishlist.addGameToWishlist', error: err }));
        return result as { id: string };
    }

    static async checkGameExistsInWishlist(userId: string, gameId: string, platformId: string): Promise<boolean> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, checkGameExistsInWishlist, [userId, gameId, platformId])
            .then((res) => res.rows[0].exists)
            .catch((err) => Promise.reject({ id: 'WishlistService.checkGameExistsInWishlist.checkGameExistsInWishlist', error: err }));
        return result;
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
}
