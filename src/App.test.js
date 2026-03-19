import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Job Tracker header', () => {
  render(<App />);
  const el = screen.getByText(/Job Tracker/i);
  expect(el).toBeTruthy();
});
