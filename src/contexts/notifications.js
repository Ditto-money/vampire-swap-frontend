import React from 'react';
import { useSnackbar } from 'notistack';

const NotificationsContext = React.createContext(null);

export function NotificationsProvider({ children }) {
  const { enqueueSnackbar } = useSnackbar();

  const showTxNotification = (description, hash) =>
    enqueueSnackbar(
      { type: 'tx', description, hash },
      {
        persist: true,
      }
    );

  const showErrorNotification = msg =>
    enqueueSnackbar(
      {
        type: 'error',
        message: msg?.error?.message || msg.responseText || msg.message || msg,
      },
      {
        persist: true,
      }
    );

  const showSuccessNotification = (title, message) =>
    enqueueSnackbar(
      {
        type: 'success',
        title,
        message,
      },
      {
        persist: true,
      }
    );

  return (
    <NotificationsContext.Provider
      value={{
        showTxNotification,
        showErrorNotification,
        showSuccessNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = React.useContext(NotificationsContext);
  if (!context) {
    throw new Error('Missing notifications context');
  }
  const {
    showTxNotification,
    showErrorNotification,
    showSuccessNotification,
  } = context;
  return {
    showTxNotification,
    showErrorNotification,
    showSuccessNotification,
  };
}
