/**
 * This test suite verifies the behavior of the LearnMore component.
 *
 * - **Rendering Test**: 
 *   It checks that the LearnMore component renders correctly by ensuring that:
 *     - The "Back to Login" button is present.
 * 
 * - **Navigation Test**: 
 *   It tests that when the "Back to Login" button is clicked, the user is correctly navigated to the login page.
 *   This is achieved by mocking the `useNavigate` hook from `react-router-dom` and verifying that it is called 
 *   with the correct path ('/login') when the button is clicked.
 *
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import LearnMore from '../LearnMore';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('LearnMore Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test if the LearnMore component renders the "Back to Login" button correctly
  it('renders the LearnMore component correctly', () => {
    render(
      <BrowserRouter>
        <LearnMore />
      </BrowserRouter>
    );

    expect(screen.getByText('Back to Login')).toBeInTheDocument();
  });

  // Test if the "Back to Login" button triggers navigation to the login page
  it('navigates to the login page when the "Back to Login" button is clicked', () => {
    render(
      <BrowserRouter>
        <LearnMore />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Back to Login'));

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
