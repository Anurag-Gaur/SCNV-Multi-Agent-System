import React from 'react';
import { Toaster } from 'react-hot-toast';

/** OFI-themed react-hot-toast Toaster — dark surfaces, gold accents. */
export function OFIToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background:   '#0A0A0A',
          color:        '#FFFFFF',
          border:       '1px solid #1F1F1F',
          borderRadius: '8px',
          fontSize:     '13px',
          fontWeight:   '500',
          padding:      '10px 14px',
          boxShadow:    '0 8px 24px rgba(0,0,0,0.6)',
          maxWidth:     '360px',
        },
        success: {
          iconTheme: { primary: '#22C55E', secondary: '#0A0A0A' },
          style: { borderLeft: '3px solid #22C55E' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#0A0A0A' },
          style: { borderLeft: '3px solid #EF4444' },
        },
        loading: {
          iconTheme: { primary: '#CCA23E', secondary: '#0A0A0A' },
          style: { borderLeft: '3px solid #CCA23E' },
        },
      }}
    />
  );
}
