import React from 'react';

const OVERLAY_STYLE = {
  position: 'fixed',
  inset: 0,
  zIndex: 10001,
  background: 'rgba(0,0,0,0.65)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default function ModalOverlay({ children, onClick, style }) {
  return (
    <div style={{ ...OVERLAY_STYLE, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}
