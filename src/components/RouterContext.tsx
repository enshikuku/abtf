import React, { useState, createContext, useContext } from 'react';
type RouterContextType = {
  currentPage: string;
  navigateTo: (page: string) => void;
};
const RouterContext = createContext<RouterContextType | undefined>(undefined);
export function RouterProvider({ children }: {children: React.ReactNode;}) {
  const [currentPage, setCurrentPage] = useState('home');
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  return (
    <RouterContext.Provider
      value={{
        currentPage,
        navigateTo
      }}>

      {children}
    </RouterContext.Provider>);

}
export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within RouterProvider');
  return context;
}