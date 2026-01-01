import DatabaseUtil from "@utils/database";
import { addGameToCollection,getPlatformList, getGamesListByPlatformId, deleteGameFromCollection,addPlatformToCollection,  getCollectionPlatformList, getCollectionPlatformListOwned, getCollectionPlatformListOwnedByPlatformId, getTotalValue, getTotalGamesCount, getTotalPlatformsCount, getTotalGamesCib } from "@utils/queries/collection.queries";
import { Collection, CollectionPlatform } from "@utils/interfaces/collection.interface";


export default class CollectionService {


	/**
	 * FONCTION SERVICE : Ajoute un jeu à la collection d'un utilisateur
	 * 
	 * @see addGameToCollection (collection.queries.ts) - Requête SQL utilisée
	 * @see POST /collection/new - Route API qui expose cette fonctionnalité
	 * 
	 * @param userId - ID de l'utilisateur
	 * @param gameId - ID du jeu
	 * @param platformId - ID de la plateforme
	 * @param notes - Notes personnelles sur le jeu
	 * @param pricePaid - Prix payé pour le jeu
	 * @param datePurchase - Date d'acquisition
	 * @param hasCart - Indique si l'utilisateur possède le jeu lui-même
	 * @param hasBox - Indique si l'utilisateur possède la boîte
	 * @param hasNotice - Indique si l'utilisateur possède la notice
	 * @param cartConditionId - ID de l'état de condition de la cartouche
	 * @param boxConditionId - ID de l'état de condition de la boîte
	 * @param noticeConditionId - ID de l'état de condition de la notice
	 * @returns L'ID de l'enregistrement créé
	 */
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


	static async deleteGameFromCollection(userId: string, gameId: string, platformId: string): Promise<{ id: string }> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, deleteGameFromCollection, [userId, gameId, platformId])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'CollectionService.deleteGameFromCollection.deleteGameFromCollection', error: err }));
		return result as { id: string };
	}


	/**
	 * FONCTION SERVICE : Récupère la collection complète d'un utilisateur organisée par plateforme
	 * Retourne toutes les plateformes avec leurs jeux associés sous forme de JSON agrégé
	 * 
	 * @see getPlatformList (collection.queries.ts) - Requête SQL utilisée
	 * @see GET /collection/:userId/platforms/list - Route API qui expose cette fonctionnalité
	 * 
	 * @param userId - ID de l'utilisateur
	 * @returns Liste des plateformes avec leurs informations et un tableau JSON de tous les jeux associés
	 */
	static async getPlatformList(userId: string): Promise<any[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getPlatformList, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getPlatformList.getPlatformList', error: err }));
		return result as any[];
	}

	/**
	 * FONCTION SERVICE : Récupère la liste des jeux dans la collection d'un utilisateur pour une plateforme spécifique
	 * 
	 * @see getGamesListByPlatformId (collection.queries.ts) - Requête SQL utilisée
	 * @see GET /collection/:userId/platforms/:platformId/games/list - Route API qui expose cette fonctionnalité
	 * 
	 * @param userId - ID de l'utilisateur
	 * @param platformId - ID de la plateforme
	 * @returns La liste des jeux dans la collection active de l'utilisateur pour la plateforme spécifique
	 */
	static async getGamesListByPlatformId(userId: string, platformId: string): Promise<Collection[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesListByPlatformId, [userId, platformId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getGamesListByPlatformId.getGamesListByPlatformId', error: err }));
		return result as Collection[];
	}


	static async getCollectionPlatformList(userId: string): Promise<CollectionPlatform[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getCollectionPlatformList, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getCollectionPlatformList.getCollectionPlatformList', error: err }));
		return result as CollectionPlatform[];
	}

	static async getCollectionPlatformListOwned(userId: string): Promise<CollectionPlatform[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getCollectionPlatformListOwned, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getCollectionPlatformListOwned.getCollectionPlatformListOwned', error: err }));
		return result as CollectionPlatform[];
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


	static async getCollectionPlatformListOwnedByPlatformId(userId: string, platformId: string): Promise<CollectionPlatform[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getCollectionPlatformListOwnedByPlatformId, [userId, platformId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getCollectionPlatformListOwnedByPlatformId.getCollectionPlatformListOwnedByPlatformId', error: err }));
		return result as CollectionPlatform[];
	}

	static async getTotalValue(userId: string): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getTotalValue, [userId])
			.then((res) => res.rows[0].totalValue)
			.catch((err) => Promise.reject({ id: 'CollectionService.getTotalValue.getTotalValue', error: err }));
		return result as number;
	}

	static async getTotalGamesCount(userId: string): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getTotalGamesCount, [userId])
			.then((res) => res.rows[0].totalGamesCount)
			.catch((err) => Promise.reject({ id: 'CollectionService.getTotalGamesCount.getTotalGamesCount', error: err }));
		return result as number;
	}

	static async getTotalPlatformsCount(userId: string): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getTotalPlatformsCount, [userId])
			.then((res) => res.rows[0].totalPlatformsCount)
			.catch((err) => Promise.reject({ id: 'CollectionService.getTotalPlatforms.getTotalPlatforms', error: err }));
		return result as number;
	}

	static async getTotalGamesCib(userId: string): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getTotalGamesCib, [userId])
			.then((res) => res.rows[0].totalGamesCib)
			.catch((err) => Promise.reject({ id: 'CollectionService.getTotalGamesCib.getTotalGamesCib', error: err }));
		return result as number;
	}



}
