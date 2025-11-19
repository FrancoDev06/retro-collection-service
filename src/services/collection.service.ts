import DatabaseUtil from "@utils/database";
import { getGamesStatusBoxed, getGameStatusCart, getGameStatusManual, getGameStatusInserts, addGameToCollection, getUserPlatformsCollection, getUserPlatformsCollectionCount, getUserGamesCount, getUserGamesValue, getUserGamesCib } from "@utils/queries/collection.queries";


export default class CollectionService {

	static async getGamesStatusBoxed(): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesStatusBoxed, [])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getGamesStatusBoxed.getGamesStatusBoxed', error: err }));
		return result;
	}

	static async getGameStatusCart(): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGameStatusCart, [])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getGameStatusCart.getGameStatusCart', error: err }));
		return result;
	}


	static async getGameStatusManual(): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGameStatusManual, [])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getGameStatusManual.getGameStatusManual', error: err }));
		return result;
	}

	static async getGameStatusInserts(): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGameStatusInserts, [])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getGameStatusInserts.getGameStatusInserts', error: err }));
		return result;
	}

	static async addGameToCollection(
		userId: string,
		gameId: string,
		platformId: string,
		status: string,
		edition: string,
		format: string,
		notes: string,
		pricePaid: number,
		datePurchase: string,
		hasBox: boolean,
		hasNotice: boolean,
		hasInserts: boolean,
		cartConditionId: string,
		boxConditionId: string,
		noticeConditionId: string,
		insertsConditionId: string,
		hasGame: boolean,
	): Promise<any> {
console.log("userId:", userId, "gameId:", gameId, "platformId:", platformId, "status:", status, "edition:", edition, "format:", format, "notes:", notes, "pricePaid:", pricePaid, "datePurchase:", datePurchase, "hasBox:", hasBox, "hasNotice:", hasNotice, "hasInserts:", hasInserts, "cartConditionId:", cartConditionId, "boxConditionId:", boxConditionId, "noticeConditionId:", noticeConditionId, "insertsConditionId:", insertsConditionId, "hasGame:", hasGame);
console.log("hasBox:", hasBox);
console.log("hasNotice:", hasNotice);
console.log("hasInserts:", hasInserts);
console.log("cartConditionId:", cartConditionId);
console.log("boxConditionId:", boxConditionId);
console.log("noticeConditionId:", noticeConditionId);
console.log("insertsConditionId:", insertsConditionId);
console.log("hasGame:", hasGame);

		const result = await DatabaseUtil.query(DatabaseUtil.pool, addGameToCollection, [
			userId,
			gameId,
			platformId,
			status,
			edition,
			format,
			notes,
			pricePaid,
			datePurchase,
			hasBox,
			hasNotice,
			hasInserts,
			cartConditionId,
			boxConditionId,
			noticeConditionId,
			insertsConditionId,
			hasGame,
		])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'CollectionService.addGameToCollection.addGameToCollection', error: err }));
		return result;
	}

	static async getUserPlatformsCollection(userId: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getUserPlatformsCollection, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getUserPlatformsCollection.getUserPlatformsCollection', error: err }));
		return result;
	}

	static async getUserPlatformsCollectionCount(userId: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getUserPlatformsCollectionCount, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getUserPlatformsCollectionCount.getUserPlatformsCollectionCount', error: err }));
		return result;
	}

	static async getUserGamesCount(userId: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getUserGamesCount, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getUserGamesCount.getUserGamesCount', error: err }));
		return result;
	}

	static async getUserGamesValue(userId: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getUserGamesValue, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getUserGamesValue.getUserGamesValue', error: err }));
		return result;
	}

	static async getUserGamesCib(userId: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getUserGamesCib, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getUserGamesCib.getUserGamesCib', error: err }));
		return result;
	}
}
