import { uptime } from "process";

export const registerUser = `
INSERT INTO
    ref_users (ll_username, ll_email, ll_password_hash)
VALUES
    ($1, $2, $3)
RETURNING id;
`;

export const registerUserToken = `
INSERT INTO
    ref_tokens (ll_user_id, ll_token, ts_expires_at)
VALUES
    ($1, $2, NOW() + INTERVAL '1 hour')
RETURNING id;
`;

export const loginUser = `
SELECT
    id,
    ll_username,
    ll_email,
    ll_password_hash
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

export const getUserInfo = `
SELECT
    id,
    ll_username,
    ll_email,
    ll_password_hash
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
            ll_user_id = $1
            AND flag_active = TRUE
    ) AS exists;
`;

export const updateUserToken = `
UPDATE
    ref_tokens
SET
    flag_active = FALSE
WHERE
    ll_user_id = $1
    AND flag_active = TRUE
RETURNING id;
`;
