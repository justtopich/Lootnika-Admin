import React from "react";
import AppProvider from './AppProvider'
import { BrowserRouter as Router } from 'react-router-dom';
import BaseLayout from './components/layout/BaseLayout';
import './App.css';


export default function App() {
  return (
    <AppProvider>
      <Router>
        <BaseLayout />
      </Router>    
    </AppProvider>
  );
}
