import React from 'react';
import { createRoot } from 'react-dom/client';
import RPG from './App';
import './App.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<RPG />);
