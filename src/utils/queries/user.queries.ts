export const getUsers = `
    SELECT id,ll_name,ll_email FROM ref_users
	ORDER BY ll_name ASC
`;

export const createUser = `
    INSERT INTO ref_users (ll_name, ll_email, ll_password) VALUES ($1, $2, $3) RETURNING id
`;
