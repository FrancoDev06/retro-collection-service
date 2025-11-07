export const createUser = `
	INSERT INTO
		ref_users (ll_name, ll_email, ll_password)
	VALUES
		($1, $2, $3) RETURNING id
`;

export const getUserInfo = `
	SELECT
		id,
		ll_name,
		ll_email,
		ll_password
	FROM
		ref_users
	WHERE
		ll_email = $1
		AND flag_active = TRUE
`;

export const userEmailExists = `
	SELECT
		EXISTS (
			SELECT
				1
			FROM
				ref_users
			WHERE
				ll_email = $1
				AND flag_active = TRUE
		) AS user_exists;
`;


export const postToken = `
    INSERT INTO ref_tokens (ll_token, ll_user_id, ts_expires_at) VALUES ($1, $2, $3) RETURNING id
`;

export const getTokenByValue = `
	SELECT
		id,
		ll_token,
		ll_user_id,
		ts_expires_at,
		flag_active
	FROM
		ref_tokens
	WHERE
		ll_token = $1
		AND flag_active = TRUE
		AND ts_expires_at > CURRENT_TIMESTAMP
`;

export const invalidateToken = `
	UPDATE ref_tokens
	SET flag_active = FALSE
	WHERE id = $1
`;

export const invalidateUserTokens = `
	UPDATE ref_tokens
	SET flag_active = FALSE
	WHERE ll_user_id = $1
	AND flag_active = TRUE
`;

export const addGameToUser = `
	INSERT INTO assoc_users_games (ll_user_id, ll_game_id)
	VALUES ($1, $2)
	ON CONFLICT (ll_user_id, ll_game_id)
	DO UPDATE SET flag_active = TRUE, ts_updated_at = CURRENT_TIMESTAMP
	RETURNING id
`;

export const addPlatformToUser = `
	INSERT INTO assoc_users_platforms (ll_user_id, ll_platform_id)
	VALUES ($1, $2)
	ON CONFLICT (ll_user_id, ll_platform_id)
	DO UPDATE SET flag_active = TRUE, ts_updated_at = CURRENT_TIMESTAMP
	RETURNING id
`;

export const getUserGameList = `
	SELECT
		g.id,
		g.ll_name,
		g.ll_console_name
	FROM
		assoc_users_games as ug
	INNER JOIN ref_games as g ON ug.ll_game_id = g.id
	INNER JOIN assoc_users_platforms as up ON ug.ll_user_id = up.ll_user_id
	INNER JOIN ref_platforms as p ON up.ll_platform_id = p.id
	WHERE ug.ll_user_id = $1
	AND ug.flag_active = TRUE
	AND g.flag_active = TRUE
	AND p.flag_active = TRUE
`;
