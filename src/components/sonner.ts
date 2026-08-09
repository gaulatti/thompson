import type { ButtonVariant } from '@gaulatti/bleecker/core';
import React from 'react';
import { Toaster } from './extras';

export type SonnerVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type SonnerPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type SonnerActionVariant = 'link' | ButtonVariant;
export interface SonnerAction { label: string; onClick: () => void; variant?: SonnerActionVariant; }
export interface SonnerToast { action?: SonnerAction; description?: string; duration?: number; icon?: React.ReactNode; id: string; title: string; variant?: SonnerVariant; }
export interface SonnerProps { duration?: number; position?: SonnerPosition; }
export function Sonner(_props: SonnerProps) { return React.createElement(Toaster); }
export { Toaster, toast, type ToasterProps, type ToastItem } from './extras';
