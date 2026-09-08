import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";

import {
  CountryConfig,
  COUNTRIES,
  DEFAULT_COUNTRY,
  detectCountry,
  getCountryConfig,
  normalizeCountryCode
} from "./countryConfig";

interface CountryContextType {
  country: CountryConfig;
  countryCode: string;
  availableCountries: CountryConfig[];
  isLoading: boolean;
  setCountryCode: (code: string) => void;
  refreshLocation: () => Promise<void>;
}

const getInitialCountryCode = (): string => {
  if (typeof window !== "undefined") {
    // 1. URL Param
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

    // 2. LocalStorage
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
  return DEFAULT_COUNTRY;
};

const CountryContext = createContext<CountryContextType>({
  country: getCountryConfig(DEFAULT_COUNTRY),
  countryCode: DEFAULT_COUNTRY,
  availableCountries: Object.values(COUNTRIES),
  isLoading: true,
  setCountryCode: () => {},
  refreshLocation: async () => {}
});

export const useCountry = () => useContext(CountryContext);

export const CountryProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [countryCode, setCountryCodeState] = useState<string>(getInitialCountryCode);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    detectCountry().then((code) => {
      if (isMounted) {
        setCountryCodeState(code);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const setCountryCode = (code: string) => {
    const normalized = normalizeCountryCode(code) || code;
    setCountryCodeState(normalized);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user_country_code", normalized);
      } catch {
        // ignore
      }
    }
  };

  const refreshLocation = async () => {
    setLoading(true);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("user_country_code");
      } catch {
        // ignore
      }
    }
    const detected = await detectCountry();
    setCountryCodeState(detected);
    setLoading(false);
  };

  return (
    <CountryContext.Provider
      value={{
        country: getCountryConfig(countryCode),
        countryCode,
        availableCountries: Object.values(COUNTRIES),
        isLoading,
        setCountryCode,
        refreshLocation
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};
