import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";

import {
  CountryConfig,
  DEFAULT_COUNTRY,
  detectCountry,
  getCountryConfig
} from "./countryConfig";

interface CountryContextType {
  country: CountryConfig;
  isLoading: boolean;
  setCountryCode: (code: string) => void;
}

const CountryContext = createContext<CountryContextType>({
  country: getCountryConfig(DEFAULT_COUNTRY),
  isLoading: true,
  setCountryCode: () => {}
});

export const useCountry = () => useContext(CountryContext);

export const CountryProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [countryCode, setCountryCodeState] = useState(DEFAULT_COUNTRY);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    detectCountry().then((code) => {
      setCountryCodeState(code);
      setLoading(false);
    });
  }, []);

  const setCountryCode = (code: string) => {
    setCountryCodeState(code);
  };

  return (
    <CountryContext.Provider
      value={{
        country: getCountryConfig(countryCode),
        isLoading,
        setCountryCode
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};
