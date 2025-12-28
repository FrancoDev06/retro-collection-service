export const getPlatformsList = `
SELECT
    rp.id_platform AS "platformId",
    rp.ll_name AS "platformName",
    rp.ll_slug AS "slug",
    rp.ll_manufacturer AS "manufacturer",
    rp.ll_url AS "url",
    rp.ll_details AS "details",
    rr.ll_label AS "regionName",
    rr.ll_code AS "regionCode"
FROM
    ref_platforms AS rp
LEFT JOIN ref_regions AS rr ON rr.id_region = rp.id_region
WHERE
  rp.flag_active = TRUE AND
  rr.flag_active = TRUE
ORDER BY rp.ll_name ASC
`;

export const getPlatformConditions = `
    SELECT
        rcs.id_condition_state AS "conditionStateId",
        rcs.ll_code AS "code",
        rcs.ll_label AS "label",
        rcs.ll_description AS "description",
        rcs.nb_rating AS "rating"
    FROM
        ref_condition_states AS rcs
    WHERE rcs.ll_element_type = 'platform' AND rcs.flag_active = TRUE
    ORDER BY rcs.ll_label ASC
`;