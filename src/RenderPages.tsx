import React from 'react';
import { BrowserRouter as Router, Routes as Pathhub, Route as Path, Navigate as Redirect } from 'react-router-dom'
import HomePage from './pages/main/homepage';

const RenderPages: React.FC = (): React.JSX.Element => {
  return (
    <Router>
      <Pathhub>
        <Path path="/" element={<HomePage />} />
        <Path path="/about" element={<h1>About</h1>} />
        <Path path="/contact" element={<h1>Contact</h1>} />
        <Path path="*" element={<Redirect to="/" />} />
      </Pathhub>
    </Router>
  )
}
export default RenderPages;