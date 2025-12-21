import DatabaseUtil from "@utils/database";
import { addGameToCollection,getPlatformList, getGamesListByPlatformId, checkGameExistsInCollection, deleteGameFromCollection, getCollectionPlatformList, getCollectionPlatformListOwned } from "@utils/queries/collection.queries";
import { Collection, CollectionPlatform } from "@utils/interfaces/collection.interface";
// import { Platforms } from "@utils/interfaces/platform.interface";


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
		console.log('userId:', userId);
		console.log('gameId:', gameId);
		console.log('platformId:', platformId);
		console.log('notes:', notes);
		console.log('pricePaid:', pricePaid);
		console.log('datePurchase:', datePurchase);
		console.log('hasCart:', hasCart);
		console.log('hasBox:', hasBox);
		console.log('hasNotice:', hasNotice);
		console.log('cartConditionId:', cartConditionId);
		console.log('boxConditionId:', boxConditionId);
		console.log('noticeConditionId:', noticeConditionId);

		const result = await DatabaseUtil.query(DatabaseUtil.pool, addGameToCollection, [
			userId,
			gameId,
			platformId,
			notes,
			pricePaid,
			datePurchase,
			hasCart,
			hasBox,
			hasNotice,
			cartConditionId,
			boxConditionId,
			noticeConditionId,
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

	/**
	 * FONCTION SERVICE : Vérifie si un jeu spécifique existe déjà dans la collection d'un utilisateur
	 * 
	 * @see checkGameExistsInCollection (collection.queries.ts) - Requête SQL utilisée
	 * @see POST /collection/new - Route API qui utilise cette vérification avant d'ajouter un jeu
	 * 	
	 * @param userId - ID de l'utilisateur
	 * @param gameId - ID du jeu
	 * @param platformId - ID de la plateforme
	 * @returns Un booléen indiquant si le jeu existe (true) ou non (false) dans la collection active de l'utilisateur
	 */
	static async checkGameExistsInCollection(userId: string, gameId: string, platformId: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, checkGameExistsInCollection, [userId, gameId, platformId])
			.then((res) => res.rows[0].exists)
			.catch((err) => Promise.reject({ id: 'CollectionService.checkGameExistsInCollection.checkGameExistsInCollection', error: err }));
		return result;
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

}
