import React from 'react';

const STYLE_SHINY = {
  background: 'linear-gradient(135deg,#FFD700,#FF6F00)',
  color: '#fff',
  fontSize: '8px',
  padding: '1px 5px',
  borderRadius: '8px',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  animation: 'shiny-flash 2s infinite',
};

const STYLE_FUSED_SHINY = {
  background: 'linear-gradient(135deg,#D500F9,#7B1FA2)',
  color: '#fff',
  fontSize: '8px',
  padding: '1px 5px',
  borderRadius: '8px',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  animation: 'shiny-flash 2s infinite',
};

export default function ShinyBadge({ isFusedShiny, style }) {
  const baseStyle = isFusedShiny ? STYLE_FUSED_SHINY : STYLE_SHINY;
  const label = isFusedShiny ? '\u2728\u878D\u5408\u8272\u8FDD' : '\u2728\u8272\u8FDD';
  return <span style={{ ...baseStyle, ...style }}>{label}</span>;
}

export { STYLE_SHINY as STYLE_SHINY_BADGE, STYLE_FUSED_SHINY as STYLE_FUSED_SHINY_BADGE };
