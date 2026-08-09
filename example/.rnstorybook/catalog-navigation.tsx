import React from 'react';

const CatalogNavigationContext = React.createContext<() => void>(() => undefined);

export const CatalogNavigationProvider = CatalogNavigationContext.Provider;

export function useOpenCatalog() {
  return React.useContext(CatalogNavigationContext);
}
