import { createContext, useContext, useState } from "react";
import Warning from "../components/Warning/Warning";

const warningContext = createContext();

export const useWarning = () => useContext(warningContext);

export const WarningProvider = ({ children }) => {
  const [warningState, setWarningState] = useState({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });
  const showWarning = (message, onConfirm = () => {}) => {
    setWarningState({
      isOpen: true,
      message,
      onConfirm: onConfirm || (() => {}),
    });
  };

  const hideWarning = () => {
    setWarningState({
      isOpen: false,
      message: "",
      onConfirm: () => {},
    });
  };

  const handleConfirm = () => {
    warningState.onConfirm();
    hideWarning();
  };

  return (
    <warningContext.Provider value={{ showWarning }}>
      {children}
      {warningState.isOpen && (
        <Warning
          message={warningState.message}
          onClose={hideWarning}
          onConfirm={handleConfirm}
        />
      )}
    </warningContext.Provider>
  );
};
