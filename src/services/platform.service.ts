import DatabaseUtil from "@utils/database";
import { Platform, PlatformConditions } from "@utils/interfaces/platform.interface";

export default class PlatformService {

    static async getPlatformsList(): Promise<Platform[]> {
        const { data, error } = await DatabaseUtil.supabase
            .from('ref_platforms')
            .select(`
                id_platform,
                ll_name,
                ll_slug,
                ll_manufacturer,
                ll_url,
                ll_details,
                ref_regions!inner (
                    ll_label,
                    ll_code
                )
            `)
            .eq('flag_active', true)
            .order('ll_name', { ascending: true });

        if (error) {
            throw { id: 'PlatformService.getPlatformsList.getPlatformsList', error };
        }

        // Transformer les données pour correspondre à l'interface
        return data.map((item: any) => ({
            platformId: item.id_platform,
            platformName: item.ll_name,
            slug: item.ll_slug,
            manufacturer: item.ll_manufacturer,
            url: item.ll_url,
            details: item.ll_details,
            regionName: item.ref_regions?.ll_label || null,
            regionCode: item.ref_regions?.ll_code || null
        })) as Platform[];
    }

    static async getPlatformConditions(): Promise<PlatformConditions[]> {
        const { data, error } = await DatabaseUtil.supabase
            .from('ref_condition_states')
            .select('id_condition_state, ll_code, ll_label, ll_description, nb_rating')
            .eq('ll_element_type', 'platform')
            .eq('flag_active', true)
            .order('ll_label', { ascending: true });

        if (error) {
            throw { id: 'PlatformService.getPlatformConditions.getPlatformConditions', error };
        }

        return data.map((item: any) => ({
            conditionStateId: item.id_condition_state,
            code: item.ll_code,
            label: item.ll_label,
            description: item.ll_description,
            rating: item.nb_rating
        })) as PlatformConditions[];
    }

}