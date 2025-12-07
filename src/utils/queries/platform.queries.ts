export const getPlatforms = `
SELECT
    id,
    ll_name as name
FROM
    ref_platforms AS rp
WHERE
    rp.flag_active = TRUE
ORDER BY
    rp.ll_name ASC;
`;

export const getPlatform = `
SELECT
    id,
    ll_slug as slug,
    ll_name as name,
    ll_manufacturer as manufacturer,
    ll_url as url,
    ll_details as details
FROM
    ref_platforms AS rp
WHERE
    rp.id = $ 1
    AND rp.flag_active = TRUE
`;