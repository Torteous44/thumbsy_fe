import React, { createContext, useContext, useState } from 'react';
import AuthCard from '../components/AuthCard';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showAuthCard, setShowAuthCard] = useState(false);
  const [defaultIsSignUp, setDefaultIsSignUp] = useState(true);

  const openAuthCard = (isSignUp = true) => {
    setDefaultIsSignUp(isSignUp);
    setShowAuthCard(true);
  };

  const closeAuthCard = () => {
    setShowAuthCard(false);
  };

  return (
    <ModalContext.Provider value={{ openAuthCard, closeAuthCard }}>
      {children}
      <AuthCard 
        isVisible={showAuthCard}
        onClose={closeAuthCard}
        defaultIsSignUp={defaultIsSignUp}
      />
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext); 