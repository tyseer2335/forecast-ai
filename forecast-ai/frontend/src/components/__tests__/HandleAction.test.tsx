import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import HandleAction from '../HandleAction';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * HandleAction Component Test Cases
 *
 * 1. **renders the "Processing your request..." message initially:**
 *    - This test checks if the component renders the default message ("Processing your request...")
 *      when it is loaded with valid query parameters (`mode` and `oobCode`).
 *    - The test ensures that this message is always shown while processing any request.
 *    - The query parameters are mocked using `useLocation` to simulate a real scenario.
 * 
 * 2. **redirects to /reset-password when mode is resetPassword:**
 *    - This test verifies that when the `mode` query parameter is set to 'resetPassword',
 *      the user is correctly redirected to the `/reset-password` route with the appropriate `oobCode`.
 *    - The test mocks `useLocation` to simulate receiving query parameters (`mode=resetPassword&oobCode=mockCode`).
 *    - It then checks whether `useNavigate` has been called to navigate to the `/reset-password` page.
 */


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

// Polyfill for clearImmediate
global.clearImmediate = jest.fn();

describe('HandleAction Component - UI Elements', () => {
  const mockNavigate = jest.fn();

  // Mock query parameters with mode and oobCode
  const mockLocation = {
    search: '?mode=verifyEmail&oobCode=mockCode',
  };

  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders the "Processing your request..." message initially', () => {
    render(
      <BrowserRouter>
        <HandleAction />
      </BrowserRouter>
    );

    expect(screen.getByText(/Processing your request.../i)).toBeInTheDocument();
  });

  it('redirects to /reset-password when mode is resetPassword', () => {
    (useLocation as jest.Mock).mockReturnValue({
      search: '?mode=resetPassword&oobCode=mockCode',
    });

    render(
      <BrowserRouter>
        <HandleAction />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/reset-password?oobCode=mockCode');
  });

});
