export interface Platform {
    platformId: string;
    platformName: string;
    slug: string;
    manufacturer: string;
    url: string;
    details: string;
    regionName: string;
    regionCode: string;
}

export interface PlatformConditions {
    conditionStateId: string;
    code: string;
    label: string;
    description: string;
    rating: number;
}