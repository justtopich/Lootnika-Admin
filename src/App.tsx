import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import BaseLayout from './components/layout/BaseLayout';
import './App.css';

export default function App() {
  return (
    <Router>
      <BaseLayout />
    </Router>    
  );
}
