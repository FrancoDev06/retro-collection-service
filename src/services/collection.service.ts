import DatabaseUtil from "@utils/database";
import { addGameToCollection,getCollectionPlatformsList, deleteGameFromCollection,addPlatformToCollection, getCollectionPlatformOwnedInfo, getCollectionPlatformsGamesOwned, getCollectionGamesOwned, deletePlatformFromCollection, getCollectionPlatformsManufacturerOwned } from "@utils/queries/collection.queries";
import { CollectionPlatformsList, CollectionPlatformsGamesOwned, CollectionGameOwned, CollectionPlatformOwnedInfo, CollectionPlatformsManufacturerOwned } from "@utils/interfaces/collection.interface";


export default class CollectionService {


	//PLATFORMS
	static async getCollectionPlatformsList(userId: string): Promise<CollectionPlatformsList[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getCollectionPlatformsList, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getCollectionPlatformsList.getCollectionPlatformsList', error: err }));
		return result as CollectionPlatformsList[];
	}

	static async getCollectionPlatformOwnedInfo(userId: string, platformId: string): Promise<CollectionPlatformOwnedInfo[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getCollectionPlatformOwnedInfo, [userId, platformId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getCollectionPlatformOwnedInfo.getCollectionPlatformOwnedInfo', error: err }));
		return result as CollectionPlatformOwnedInfo[];
	}

	static async addPlatformToCollection(userId: string, platformId: string, units: number, conditionStateId?: string, purchaseSource?: string, pricePaid?: number, acquiredAt?: string, notes?: string): Promise<{ id: string }> {
		
		const result = await DatabaseUtil.query(DatabaseUtil.pool, addPlatformToCollection, [
			userId,
			platformId,
			units,
			conditionStateId || null,
			purchaseSource || null,
			pricePaid || null,
			acquiredAt || null,
			notes || null
		])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'CollectionService.addPlatformToCollection.addPlatformToCollection', error: err }));
		return result as { id: string };
	}

	
	//GAMES
	static async getCollectionPlatformsGamesOwned(userId: string): Promise<CollectionPlatformsGamesOwned[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getCollectionPlatformsGamesOwned, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getCollectionPlatformsGamesOwned.getCollectionPlatformsGamesOwned', error: err }));
		return result as CollectionPlatformsGamesOwned[];
	}

	static async getCollectionGamesOwned(userId: string, platformId: string): Promise<CollectionGameOwned[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getCollectionGamesOwned, [userId, platformId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getCollectionGamesOwned.getCollectionGamesOwned', error: err }));
		return result as CollectionGameOwned[];
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

		const result = await DatabaseUtil.query(DatabaseUtil.pool, addGameToCollection, [
			userId,
			gameId,
			platformId,
			notes || null,
			pricePaid || 0,
			datePurchase || null,
			hasCart || false,
			hasBox || false,
			hasNotice || false,
			cartConditionId || null,
			boxConditionId || null,
			noticeConditionId || null,
		])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'CollectionService.addGameToCollection.addGameToCollection', error: err }));
		return result as { id: string };
	}

	static async deleteGameFromCollection(userId: string, idUserGameCollection: string): Promise<{ id: string }> {
		console.log('userId', userId);
		console.log('idUserGameCollection', idUserGameCollection);
		const result = await DatabaseUtil.query(DatabaseUtil.pool, deleteGameFromCollection, [userId, idUserGameCollection])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'CollectionService.deleteGameFromCollection.deleteGameFromCollection', error: err }));
		return result as { id: string };
	}

	static async deletePlatformFromCollection(userId: string, platformId: string): Promise<{ id: string }> {
		console.log('userId', userId);
		console.log('platformId', platformId);
		const result = await DatabaseUtil.query(DatabaseUtil.pool, deletePlatformFromCollection, [userId, platformId])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'CollectionService.deletePlatformFromCollection.deletePlatformFromCollection', error: err }));
		return result as { id: string };
	}

	static async getCollectionPlatformsManufacturerOwned(userId: string): Promise<CollectionPlatformsManufacturerOwned[]> {
		const result : CollectionPlatformsManufacturerOwned[] = await DatabaseUtil.query(DatabaseUtil.pool, getCollectionPlatformsManufacturerOwned, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getCollectionPlatformsManufacturerOwned.getCollectionPlatformsManufacturerOwned', error: err }));
		return result as CollectionPlatformsManufacturerOwned[];
	}
}
