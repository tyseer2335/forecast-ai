import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from '../ResetPassword';
import { useSearchParams } from 'react-router-dom';
/**
 * ResetPassword Component Test Cases
 * 
 * These tests are designed to validate the functionality of the `ResetPassword` component's UI elements, ensuring that the form works as expected and interacts with user inputs correctly.
 * 
 * 1. **renders input fields and button correctly**:
 *    - This test ensures that the password reset form is rendered correctly with the appropriate input fields.
 *    - It checks for the presence of the "Enter new password" and "Confirm new password" input fields.
 * 
 * 2. **toggles password visibility**:
 *    - This test checks the functionality of toggling password visibility.
 *    - Initially, the password field should be of type `password` (hidden).
 *    - After clicking the toggle button, the password field should switch to type `text` (visible).
 *    - A second click on the toggle button should hide the password again, reverting it back to type `password`.
 *    - This verifies that the password visibility toggle works as expected.
 * 
 * 3. **shows password strength message**:
 *    - This test verifies that the password strength meter works correctly based on the input.
 *    - Using the `zxcvbn` library for password strength evaluation, the test checks for the display of the correct password strength message.
 *    - A weak password (e.g., '123') should display the message 'Very Weak'.
 *    - A strong password (e.g., 'StroaopiwejfngPasaagsdgfs)()i!') should display the message 'Strong'.
 *    - This ensures that the password strength meter responds dynamically to the user's input.
 * 
 */


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}));

describe('ResetPassword Component - UI Elements', () => {
  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams('oobCode=mockCode'),
    ]);
  });

  it('renders input fields and button correctly', () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    // Check for input fields
    expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Enter new password');
    const toggleButton = screen.getAllByRole('button')[0]; // Assuming the first button is the toggle

    // Default state: password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows password strength message', () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Enter new password');

    // Simulate typing a weak password
    fireEvent.change(passwordInput, { target: { value: '123' } });
    expect(screen.getByText(/very weak/i)).toBeInTheDocument();

    // Simulate typing a stronger password
    fireEvent.change(passwordInput, { target: { value: 'StroaopiwejfngPasaagsdgfs)()i!' } });
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });
});
