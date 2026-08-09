import type { AlertType } from '@gaulatti/bleecker/core';
import React from 'react';
import { toast, Toaster } from './extras';

export { Alert, type AlertProps, type AlertVariant } from './feedback';
export type { AlertType } from '@gaulatti/bleecker/core';

export function showAlert(message: string, type: AlertType = 'info') {
  return toast.custom({ title: message, variant: type === 'error' ? 'error' : type === 'success' ? 'success' : 'default' });
}

export function AlertContainer() { return React.createElement(Toaster); }
