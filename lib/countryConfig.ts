export interface CountryConfig {
  code: string;
  name: string;
  flag: string;

  currencyCode: string;
  currencySymbol: string;

  // Product Price
  price: number;
  formattedPrice: string;
  originalPrice: number;
  formattedOriginalPrice: string;

  // Single Selar Product Base URL
  selarCheckoutBase: string;

  // Localized Marketing Copy
  bannerText: string;
  heroCurrencyHook: string;
  premiumRentArea: string;

  cities: {
    name: string;
    city: string;
  }[];
}

export const COUNTRIES: Record<string, CountryConfig> = {
  NG: {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",

    currencyCode: "NGN",
    currencySymbol: "₦",

    price: 37000,
    formattedPrice: "₦37,000",
    originalPrice: 110000,
    formattedOriginalPrice: "₦110,000",

    selarCheckoutBase: "https://selar.com/73518502d1",

    bannerText: "🇳🇬 Limited Time Students Week Offer in Nigeria",
    heroCurrencyHook: "Naira keeps losing value",
    premiumRentArea: "Lekki",

    cities: [
      { name: "Chinedu O.", city: "Lagos" },
      { name: "Adaeze N.", city: "Abuja" }
    ]
  },

  GH: {
    code: "GH",
    name: "Ghana",
    flag: "🇬🇭",

    currencyCode: "GHS",
    currencySymbol: "GH₵",

    price: 250,
    formattedPrice: "GH₵250",
    originalPrice: 750,
    formattedOriginalPrice: "GH₵750",

    selarCheckoutBase: "https://selar.com/73518502d1",

    bannerText: "🇬🇭 Limited Time Students Week Offer in Ghana",
    heroCurrencyHook: "Cedi keeps falling",
    premiumRentArea: "East Legon",

    cities: [
      { name: "Kwame A.", city: "Accra" },
      { name: "Ama S.", city: "Kumasi" }
    ]
  },

  KE: {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",

    currencyCode: "KES",
    currencySymbol: "KSh",

    price: 3200,
    formattedPrice: "KSh 3,200",
    originalPrice: 9600,
    formattedOriginalPrice: "KSh 9,600",

    selarCheckoutBase: "https://selar.com/73518502d1",

    bannerText: "🇰🇪 Limited Time Students Week Offer in Kenya",
    heroCurrencyHook: "Shilling is dropping",
    premiumRentArea: "Westlands",

    cities: [
      { name: "Kipchumba K.", city: "Nairobi" },
      { name: "Wanjiru M.", city: "Mombasa" }
    ]
  },

  ZA: {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",

    currencyCode: "ZAR",
    currencySymbol: "R",

    price: 450,
    formattedPrice: "R450",
    originalPrice: 1350,
    formattedOriginalPrice: "R1,350",

    selarCheckoutBase: "https://selar.com/73518502d1",

    bannerText: "🇿🇦 Limited Time Students Week Offer in South Africa",
    heroCurrencyHook: "Rand keeps weakening",
    premiumRentArea: "Sandton",

    cities: [
      { name: "Thabo M.", city: "Johannesburg" },
      { name: "Naledi K.", city: "Cape Town" }
    ]
  },

  TZ: {
    code: "TZ",
    name: "Tanzania",
    flag: "🇹🇿",

    currencyCode: "TZS",
    currencySymbol: "TSh",

    price: 62000,
    formattedPrice: "TSh 62,000",
    originalPrice: 186000,
    formattedOriginalPrice: "TSh 186,000",

    selarCheckoutBase: "https://selar.com/73518502d1",

    bannerText: "🇹🇿 Limited Time Students Week Offer in Tanzania",
    heroCurrencyHook: "Shilling continues to weaken",
    premiumRentArea: "Masaki",

    cities: [
      { name: "Amina H.", city: "Dar es Salaam" },
      { name: "Joseph K.", city: "Arusha" }
    ]
  }
};

export const DEFAULT_COUNTRY = "NG";

export function getCountryConfig(countryCode: string): CountryConfig {
  return COUNTRIES[countryCode] || COUNTRIES[DEFAULT_COUNTRY];
}

/**
 * IP Auto Detection using ipapi.co with fallback
 */
export async function detectCountry(): Promise<string> {
  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.country_code && COUNTRIES[data.country_code]) {
        return data.country_code;
      }
    }
  } catch (err) {
    // Fallback to default if network/timeout fails
  }
  return DEFAULT_COUNTRY;
}
