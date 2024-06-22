import React from 'react';
import { BrowserRouter as Router, Routes as Pathhub, Route as Path, Navigate as Redirect } from 'react-router-dom'
import HomePage from './pages/main/homepage';

// SCSS
import './assets/scss/global.scss';
import LoginPage from './pages/credentials/login';
import LogoutPage from './pages/credentials/logout';

const RenderPages: React.FC = (): React.JSX.Element => {
  return (
    <Router>
      <Pathhub>
        {/* Redirects */}
        <Path path="/login/*" element={<Redirect to="/login" />} />
        <Path path="/logout/*" element={<Redirect to="/logout" />} />
        <Path path="/*" element={<Redirect to="/" />} />

        {/* Pages */}
        <Path path="/login" element={<LoginPage />} />
        <Path path="/logout" element={<LogoutPage />} />
        <Path path="/" element={<HomePage />} />
      </Pathhub>
    </Router>
  )
}
export default RenderPages;