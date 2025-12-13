import DatabaseUtil from "@utils/database";
import { getConditionsBoxed, addGameToCollection, getConditionsCart, getConditionsManual, getPlatformList, getGamesListByPlatformId, checkGameExistsInCollection } from "@utils/queries/collection.queries";


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
	 * @param status - Statut du jeu (ex: 'owned', 'wanted', etc.)
	 * @param edition - Édition du jeu
	 * @param format - Format du jeu (ex: 'physical', 'digital')
	 * @param notes - Notes personnelles sur le jeu
	 * @param pricePaid - Prix payé pour le jeu
	 * @param datePurchase - Date d'acquisition
	 * @param hasGame - Indique si l'utilisateur possède le jeu lui-même
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
	): Promise<any> {
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
		return result;
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
	static async getPlatformList(userId: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getPlatformList, [userId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getPlatformList.getPlatformList', error: err }));
		return result;
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
	static async getGamesListByPlatformId(userId: string, platformId: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesListByPlatformId, [userId, platformId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'CollectionService.getGamesListByPlatformId.getGamesListByPlatformId', error: err }));
		return result;
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


	// /**
	//  * FONCTION SERVICE : Compte le nombre total de plateformes uniques dans la collection de jeux d'un utilisateur
	//  * 
	//  * @see getPlatformsCount (collection.queries.ts) - Requête SQL utilisée
	//  * @see GET /collection/:userId/platforms/count - Route API qui expose cette fonctionnalité
	//  * 
	//  * @param userId - ID de l'utilisateur
	//  * @returns Le nombre total de plateformes distinctes dans la collection active de l'utilisateur
	//  */
	// static async getPlatformsCount(userId: string): Promise<any> {
	// 	const result = await DatabaseUtil.query(DatabaseUtil.pool, getPlatformsCount, [userId])
	// 		.then((res) => res.rows[0].total_unique_platforms)
	// 		.catch((err) => Promise.reject({ id: 'CollectionService.getPlatformsCount.getPlatformsCount', error: err }));
	// 	return result;
	// }

	// /**
	//  * FONCTION SERVICE : Compte le nombre total de jeux dans la collection d'un utilisateur
	//  * 
	//  * @see getGamesCount (collection.queries.ts) - Requête SQL utilisée
	//  * @see GET /collection/:userId/games/count - Route API qui expose cette fonctionnalité
	//  * 
	//  * @param userId - ID de l'utilisateur
	//  * @returns Le nombre total de jeux dans la collection active de l'utilisateur
	//  */
	// static async getGamesCount(userId: string): Promise<any> {
	// 	const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesCount, [userId])
	// 		.then((res) => res.rows[0].total)
	// 		.catch((err) => Promise.reject({ id: 'CollectionService.getGamesCount.getGamesCount', error: err }));
	// 	return result;
	// }

	// /**
	//  * FONCTION SERVICE : Calcule la valeur totale payée pour tous les jeux de la collection d'un utilisateur
	//  * 
	//  * @see getGamesValue (collection.queries.ts) - Requête SQL utilisée
	//  * @see GET /collection/:userId/games/value - Route API qui expose cette fonctionnalité
	//  * 
	//  * @param userId - ID de l'utilisateur
	//  * @returns La somme totale des prix payés pour tous les jeux dans la collection active de l'utilisateur
	//  */
	// static async getGamesValue(userId: string): Promise<any> {
	// 	const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesValue, [userId])
	// 		.then((res) => res.rows[0].total_value_paid)
	// 		.catch((err) => Promise.reject({ id: 'CollectionService.getGamesValue.getGamesValue', error: err }));
	// 	return result;
	// }

	// /**
	//  * FONCTION SERVICE : Compte le nombre de jeux CIB (Complete In Box) dans la collection d'un utilisateur
	//  * Un jeu CIB doit avoir le statut 'owned' et posséder la boîte, la notice et le jeu
	//  * 
	//  * @see getGamesCibCount (collection.queries.ts) - Requête SQL utilisée
	//  * @see GET /collection/:userId/games/cib - Route API qui expose cette fonctionnalité
	//  * 
	//  * @param userId - ID de l'utilisateur
	//  * @returns Le nombre total de jeux CIB (complets avec boîte, notice et jeu) dans la collection active de l'utilisateur
	//  */
	// static async getGamesCibCount(userId: string): Promise<any> {
	// 	const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesCibCount, [userId])
	// 		.then((res) => res.rows[0].total_cib_games)
	// 		.catch((err) => Promise.reject({ id: 'CollectionService.getGamesCibCount.getGamesCibCount', error: err }));
	// 	return result;
	// }


	// /**
	//  * FONCTION SERVICE : Compte le nombre de jeux dans la collection d'un utilisateur pour une plateforme spécifique
	//  * 
	//  * @see getGamesCountByPlatformId (collection.queries.ts) - Requête SQL utilisée
	//  * @see GET /collection/:userId/platforms/:platformId/games/count - Route API qui expose cette fonctionnalité
	//  * 
	//  * @param userId - ID de l'utilisateur
	//  * @param platformId - ID de la plateforme
	//  * @returns Le nombre de jeux dans la collection active de l'utilisateur pour la plateforme spécifique
	//  */
	// static async getGamesCountByPlatformId(userId: string, platformId: string): Promise<any> {
	// 	const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesCountByPlatformId, [userId, platformId])
	// 		.then((res) => res.rows[0].total)
	// 		.catch((err) => Promise.reject({ id: 'CollectionService.getGamesCountByPlatformId.getGamesCountByPlatformId', error: err }));
	// 	return result;
	// }



	// /**
	//  * FONCTION SERVICE : Ajoute une plateforme à la collection d'un utilisateur
	//  * 
	//  * @see addPlatformToCollection (collection.queries.ts) - Requête SQL utilisée
	//  * @note Cette fonctionnalité n'est pas encore exposée via une route API
	//  * 
	//  * @param userId - ID de l'utilisateur
	//  * @param platformId - ID de la plateforme
	//  * @param units - Nombre d'unités de la plateforme
	//  * @param conditionId - ID de l'état de condition de la plateforme
	//  * @param purchaseSource - Source d'achat de la plateforme
	//  * @param pricePaid - Prix payé pour la plateforme
	//  * @param datePurchase - Date d'acquisition
	//  * @param notes - Notes personnelles sur la plateforme
	//  * @returns L'ID de l'enregistrement créé
	//  */
	// static async addPlatformToCollection(
	// 	userId: string,
	// 	platformId: string,
	// 	units: number,
	// 	conditionId: string,
	// 	purchaseSource: string,
	// 	pricePaid: number,
	// 	datePurchase: string,
	// 	notes: string,
	// ): Promise<any> {
	// 	const result = await DatabaseUtil.query(DatabaseUtil.pool, addPlatformToCollection, [
	// 		userId,
	// 		platformId,
	// 		units,
	// 		conditionId,
	// 		purchaseSource,
	// 		pricePaid,
	// 		datePurchase,
	// 		notes,
	// 	])
	// 		.then((res) => res.rows[0])
	// 		.catch((err) => Promise.reject({ id: 'CollectionService.addPlatformToCollection.addPlatformToCollection', error: err }));
	// 	return result;
	// }



	// /**
	//  * FONCTION SERVICE : Vérifie si une plateforme spécifique existe déjà dans la collection d'un utilisateur
	//  * 
	//  * @see checkPlatformExistsInCollection (collection.queries.ts) - Requête SQL utilisée
	//  * @see POST /collection/new - Route API qui utilise cette vérification avant d'ajouter un jeu
	//  * 
	//  * @param userId - ID de l'utilisateur
	//  * @param platformId - ID de la plateforme
	//  * @returns Un booléen indiquant si la plateforme existe (true) ou non (false) dans la collection active de l'utilisateur
	//  */
	// static async checkPlatformExistsInCollection(userId: string, platformId: string): Promise<any> {
	// 	const result = await DatabaseUtil.query(DatabaseUtil.pool, checkPlatformExistsInCollection, [userId, platformId])
	// 		.then((res) => res.rows[0].exists)
	// 		.catch((err) => Promise.reject({ id: 'CollectionService.checkPlatformExistsInCollection.checkPlatformExistsInCollection', error: err }));
	// 	return result;
	// }

	// static async getUserPlatformsCollection(userId: string): Promise<any> {
	// 	const result = await DatabaseUtil.query(DatabaseUtil.pool, getUserPlatformsCollection, [userId])
	// 		.then((res) => res.rows)
	// 		.catch((err) => Promise.reject({ id: 'CollectionService.getUserPlatformsCollection.getUserPlatformsCollection', error: err }));
	// 	return result;
	// }


}
