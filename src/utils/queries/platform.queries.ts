export const getPlatforms = `
    SELECT id,ll_name,ll_constructor FROM ref_platforms
	ORDER BY ll_name ASC
`;
