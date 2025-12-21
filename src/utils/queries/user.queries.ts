import { uptime } from "process";

export const registerUser = `
INSERT INTO
    ref_users (ll_username, ll_email, ll_password_hash)
VALUES
    ($1, $2, $3)
RETURNING id_user AS "userId";
`;

export const registerUserToken = `
INSERT INTO
    ref_tokens (id_user, ll_token, ts_expires_at)
VALUES
    ($1, $2, NOW() + INTERVAL '1 hour')
RETURNING id_token AS "tokenId";
`;

export const loginUser = `
SELECT
    id_user AS "userId",
    ll_username AS username,
    ll_email AS email,
    ll_password_hash AS "passwordHash"
FROM
    ref_users
WHERE
    ll_email = $1
    AND flag_active = TRUE;
`;

export const checkUserExists = `
SELECT
    EXISTS(
        SELECT
            1
        FROM
            ref_users
        WHERE
            ll_email = $1
            AND flag_active = TRUE
    ) AS exists;
`;

export const getUserByEmail = `
SELECT
    id_user AS "userId",
    ll_username AS username,
    ll_email AS email,
    ll_password_hash AS "passwordHash"
FROM
    ref_users
WHERE
    ll_email = $1
    AND flag_active = TRUE;
`;

export const checkUserToken = `
SELECT
    EXISTS(
        SELECT
            1
        FROM
            ref_tokens
        WHERE
            id_user = $1
            AND flag_active = TRUE
    ) AS exists;
`;

export const updateUserToken = `
UPDATE
    ref_tokens
SET
    flag_active = FALSE
WHERE
    id_user = $1
    AND flag_active = TRUE
RETURNING id_token AS "tokenId";
`;

export const getUserById = `
SELECT
    id_user AS "userId",
    ll_username AS name,
    ll_email AS email,
    ll_password_hash AS "passwordHash"
FROM
    ref_users
WHERE
    id_user = $1
    AND flag_active = TRUE;
`;