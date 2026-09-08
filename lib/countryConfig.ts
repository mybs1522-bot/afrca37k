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
  earningRange: string;
  topCities: string;
  premiumRentArea: string;

  cities: {
    name: string;
    city: string;
  }[];
}

export const COUNTRIES: Record<string, CountryConfig> = {
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

    bannerText: "🇬🇭 3 Freelance Paid Projects For Every Student in Ghana worth 300 USD",
    heroCurrencyHook: "Cedi keeps falling",
    earningRange: "GH₵1,500–GH₵5,000",
    topCities: "Accra, Kumasi, and Takoradi",
    premiumRentArea: "East Legon",

    cities: [
      { name: "Kwame A.", city: "Accra" },
      { name: "Ama S.", city: "Kumasi" },
      { name: "Kofi B.", city: "Takoradi" },
      { name: "Abena M.", city: "Tema" }
    ]
  },

  KE: {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",

    currencyCode: "KES",
    currencySymbol: "KSh ",

    price: 3200,
    formattedPrice: "KSh 3,200",
    originalPrice: 9600,
    formattedOriginalPrice: "KSh 9,600",

    selarCheckoutBase: "https://selar.com/73518502d1",

    bannerText: "🇰🇪 3 Freelance Paid Projects For Every Student in Kenya worth 300 USD",
    heroCurrencyHook: "Shilling is dropping",
    earningRange: "KSh 15,000–KSh 50,000",
    topCities: "Nairobi, Mombasa, and Kisumu",
    premiumRentArea: "Westlands",

    cities: [
      { name: "Kipchumba K.", city: "Nairobi" },
      { name: "Wanjiru M.", city: "Mombasa" },
      { name: "Brian O.", city: "Kisumu" },
      { name: "Faith N.", city: "Nakuru" }
    ]
  },

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

    bannerText: "🇳🇬 3 Freelance Paid Projects For Every Student in Nigeria worth 300 USD",
    heroCurrencyHook: "Naira keeps losing value",
    earningRange: "₦50,000–₦200,000",
    topCities: "Lagos, Abuja, and Port Harcourt",
    premiumRentArea: "Lekki",

    cities: [
      { name: "Chinedu O.", city: "Lagos" },
      { name: "Adaeze N.", city: "Abuja" },
      { name: "Emeka N.", city: "Port Harcourt" },
      { name: "Ngozi O.", city: "Ibadan" }
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

    bannerText: "🇿🇦 3 Freelance Paid Projects For Every Student in South Africa worth 300 USD",
    heroCurrencyHook: "Rand keeps weakening",
    earningRange: "R2,000–R8,000",
    topCities: "Johannesburg, Cape Town, and Durban",
    premiumRentArea: "Sandton",

    cities: [
      { name: "Thabo M.", city: "Johannesburg" },
      { name: "Naledi K.", city: "Cape Town" },
      { name: "Sipho D.", city: "Durban" }
    ]
  },

  TZ: {
    code: "TZ",
    name: "Tanzania",
    flag: "🇹🇿",

    currencyCode: "TZS",
    currencySymbol: "TSh ",

    price: 62000,
    formattedPrice: "TSh 62,000",
    originalPrice: 186000,
    formattedOriginalPrice: "TSh 186,000",

    selarCheckoutBase: "https://selar.com/73518502d1",

    bannerText: "🇹🇿 3 Freelance Paid Projects For Every Student in Tanzania worth 300 USD",
    heroCurrencyHook: "Shilling continues to weaken",
    earningRange: "TSh 300,000–TSh 1,000,000",
    topCities: "Dar es Salaam, Arusha, and Mwanza",
    premiumRentArea: "Masaki",

    cities: [
      { name: "Amina H.", city: "Dar es Salaam" },
      { name: "Joseph K.", city: "Arusha" },
      { name: "Baraka M.", city: "Mwanza" }
    ]
  }
};

export const DEFAULT_COUNTRY = "NG";

/**
 * Normalizes common variations of country names / codes / currencies to our supported 2-letter country code
 */
export function normalizeCountryCode(input: string | null | undefined): string | null {
  if (!input) return null;
  const cleaned = input.trim().toUpperCase();

  // Exact 2-letter match
  if (COUNTRIES[cleaned]) return cleaned;

  // Common aliases & currencies
  switch (cleaned) {
    case "GHANA":
    case "GHA":
    case "GHS":
    case "CEDI":
    case "CEDIS":
      return "GH";

    case "KENYA":
    case "KEN":
    case "KES":
    case "KSH":
    case "KSHS":
    case "SHILLING":
      return "KE";

    case "NIGERIA":
    case "NGA":
    case "NGN":
    case "NAIRA":
      return "NG";

    case "SOUTH AFRICA":
    case "SOUTHAFRICA":
    case "ZAF":
    case "ZAR":
    case "RAND":
      return "ZA";

    case "TANZANIA":
    case "TZA":
    case "TZS":
      return "TZ";

    // Neighboring African defaults
    case "UGANDA":
    case "UG":
    case "UGA":
    case "UGX":
    case "RWANDA":
    case "RW":
    case "RWA":
      return "KE"; // East Africa regional pricing

    default:
      return null;
  }
}

export function getCountryConfig(countryCode: string): CountryConfig {
  const normalized = normalizeCountryCode(countryCode);
  return (normalized && COUNTRIES[normalized]) || COUNTRIES[DEFAULT_COUNTRY];
}

/**
 * Fast multi-provider IP geo lookup with race and fallback
 */
async function fetchCountryFromIp(): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  const providers = [
    // Provider 1: api.country.is (very fast Cloudflare Edge lookup)
    fetch("https://api.country.is/", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("status");
        const data = await res.json();
        return normalizeCountryCode(data?.country);
      }),

    // Provider 2: ipapi.co
    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("status");
        const data = await res.json();
        return normalizeCountryCode(data?.country_code);
      }),

    // Provider 3: ipwho.is
    fetch("https://ipwho.is/", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("status");
        const data = await res.json();
        return normalizeCountryCode(data?.country_code);
      }),

    // Provider 4: geojs.io
    fetch("https://get.geojs.io/v1/ip/country.json", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("status");
        const data = await res.json();
        return normalizeCountryCode(data?.country);
      })
  ];

  try {
    // Return first provider that resolves with a recognized supported country
    const results = await Promise.allSettled(providers);
    clearTimeout(timeoutId);

    for (const result of results) {
      if (result.status === "fulfilled" && result.value && COUNTRIES[result.value]) {
        return result.value;
      }
    }
  } catch {
    clearTimeout(timeoutId);
  }

  return null;
}

/**
 * Detects country from browser TimeZone heuristic (useful if IP services are adblocked or offline)
 */
function detectFromTimezone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (/Accra/i.test(tz)) return "GH";
    if (/Nairobi|Kampala|Kigali/i.test(tz)) return "KE";
    if (/Lagos/i.test(tz)) return "NG";
    if (/Johannesburg|Harare|Maputo|Gaborone/i.test(tz)) return "ZA";
    if (/Dar_es_Salaam/i.test(tz)) return "TZ";
  } catch {
    // ignore
  }
  return null;
}

/**
 * Detects country from browser Language/Locale
 */
function detectFromLocale(): string | null {
  try {
    const languages = (typeof navigator !== "undefined" && (navigator.languages || [navigator.language])) || [];
    for (const lang of languages) {
      if (!lang) continue;
      const lower = lang.toLowerCase();
      if (lower.includes("-gh") || lower === "ak" || lower === "tw" || lower === "ee") return "GH";
      if (lower.includes("-ke") || lower === "sw" || lower === "ki" || lower === "luo") return "KE";
      if (lower.includes("-ng") || lower === "yo" || lower === "ha" || lower === "ig") return "NG";
      if (lower.includes("-za") || lower === "af" || lower === "zu" || lower === "xh") return "ZA";
      if (lower.includes("-tz")) return "TZ";
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Multi-layer robust Country Detection
 * 1. URL Query Param Override (?country=GH, ?country=KE, ?geo=ghana, ?currency=GHS)
 * 2. Cached in LocalStorage
 * 3. Multi-API IP Geo Detection (Race between api.country.is, ipapi, ipwhois, geojs)
 * 4. Timezone Heuristic (Africa/Accra -> GH, Africa/Nairobi -> KE)
 * 5. Browser Locale / Language Heuristic
 * 6. Default (NG)
 */
export async function detectCountry(): Promise<string> {
  // 1. URL Parameter Override (Highest priority)
  if (typeof window !== "undefined") {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam =
        urlParams.get("country") ||
        urlParams.get("geo") ||
        urlParams.get("c") ||
        urlParams.get("location") ||
        urlParams.get("currency") ||
        urlParams.get("cur");

      const normalized = normalizeCountryCode(queryParam);
      if (normalized && COUNTRIES[normalized]) {
        localStorage.setItem("user_country_code", normalized);
        return normalized;
      }
    } catch {
      // ignore
    }

    // 2. LocalStorage Cache (if previously set by user or detected)
    try {
      const cached = localStorage.getItem("user_country_code");
      const normalizedCached = normalizeCountryCode(cached);
      if (normalizedCached && COUNTRIES[normalizedCached]) {
        return normalizedCached;
      }
    } catch {
      // ignore
    }
  }

  // 3. Multi-API IP Geo Detection
  try {
    const ipCountry = await fetchCountryFromIp();
    if (ipCountry && COUNTRIES[ipCountry]) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("user_country_code", ipCountry);
        } catch {
          // ignore
        }
      }
      return ipCountry;
    }
  } catch {
    // ignore
  }

  // 4. Timezone heuristic
  const tzCountry = detectFromTimezone();
  if (tzCountry && COUNTRIES[tzCountry]) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user_country_code", tzCountry);
      } catch {
        // ignore
      }
    }
    return tzCountry;
  }

  // 5. Browser Locale heuristic
  const localeCountry = detectFromLocale();
  if (localeCountry && COUNTRIES[localeCountry]) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user_country_code", localeCountry);
      } catch {
        // ignore
      }
    }
    return localeCountry;
  }

  // 6. Default Fallback
  return DEFAULT_COUNTRY;
}
