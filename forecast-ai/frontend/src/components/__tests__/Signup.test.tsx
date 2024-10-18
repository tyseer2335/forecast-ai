import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import Signup from '../Signup';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

/**
 * Signup Component Test Cases
 * 
 * 1. **renders the signup form correctly:**
 *    - This test checks whether the `Signup` component renders correctly without crashing.
 *    - It ensures that the signup form, including the email, password, and confirm password fields, as well as the sign-up button, are present in the rendered output.
 * 
 * 2. **displays password strength based on input:**
 *    - This test simulates entering passwords of varying strength in the password field.
 *    - The `zxcvbn` library is used for password strength validation, which scores passwords from 0 (very weak) to 4 (strong).
 *    - It checks whether the correct strength level (e.g., 'Weak', 'Strong') is displayed based on the input password.
 * 
 * 3. **shows an error when passwords do not match:**
 *    - This test checks if the `Signup` component displays the appropriate error message when the passwords entered in the password and confirm password fields do not match.
 *    - It simulates entering mismatched passwords and ensures that the error message "Passwords do not match!" is displayed.
 * 
 * 4. **shows an error when password is too weak:**
 *    - This test simulates entering a weak password in the password field (e.g., a password that is too short or too simple).
 *    - It checks whether the component correctly displays an error message indicating that the password is too weak and a stronger password is required.
 * 
 * 5. **shows an error when email format is invalid:**
 *    - This test simulates entering an invalid email format in the email field.
 *    - It ensures that the appropriate error message "Please enter a valid email address." is displayed if the email format does not match the expected pattern.
 * 
 * 6. **navigates to the login page when "Sign in" is clicked:**
 *    - This test checks if the `Signup` component correctly navigates to the login page when the "Sign in" link is clicked.
 *    - It ensures that the user is redirected to `/login` when clicking the link.
 * 
 * 7. **navigates to the password recovery page when "Forgot Password" is clicked:**
 *    - This test checks if the `Signup` component correctly navigates to the password recovery page when the "Forgot Password" link is clicked.
 *    - It ensures that the user is redirected to `/recover-password` when clicking the link.
 * 
 * 8. **displays "Very Weak" for a short password:**
 *    - This test simulates entering a very short password (e.g., "abc") in the password field.
 *    - It ensures that the component displays "Very Weak" as the password strength message when the password does not meet the length or complexity requirements.
 * 
 * 9. **displays "Strong" for a complex password:**
 *    - This test simulates entering a complex password in the password field.
 *    - It checks whether the component displays "Strong" as the password strength message when the password meets the required complexity (e.g., a mix of characters, numbers, and symbols).
 * 
 */


describe('Signup Component', () => {
  it('renders the signup form correctly', () => {
    act(() => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );
    });

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('displays password strength based on input', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );
    });

    const passwordInput = screen.getByPlaceholderText('Password');

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'weakpass' } });
    });
    expect(screen.getByText(/weak/i)).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'aighaskdfg!>:IUH#@!' } });
    });
    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });

  it('shows an error when passwords do not match', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );
    });

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'StrongPassword123!' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'DifferentPassword!' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Sign up'));
    });

    expect(screen.getByText('Passwords do not match!')).toBeInTheDocument();
  });

  it('shows an error when password is too weak', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );
    });

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123' } }); // Weak password
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '123' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Sign up'));
    });

    expect(screen.getByText('Password is too weak! Please choose a stronger password.')).toBeInTheDocument();
  });

  it('shows an error when email format is invalid', async () => {
    act(() => {
      render(
        <BrowserRouter>
          <Signup />
        </BrowserRouter>
      );
    });

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'StrongPassword123!' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'StrongPassword123!' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Sign up'));
    });

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  }); 

  it('navigates to the login page when "Sign in" is clicked', () => {
    const { getByText } = render(<BrowserRouter><Signup /></BrowserRouter>);
    fireEvent.click(getByText('Sign in'));
    expect(window.location.pathname).toBe('/login');
  });
  
  it('navigates to the password recovery page when "Forgot Password" is clicked', () => {
    const { getByText } = render(<BrowserRouter><Signup /></BrowserRouter>);
    fireEvent.click(getByText('Forgot Password'));
    expect(window.location.pathname).toBe('/recover-password');
  });

  it('displays "Very Weak" for a short password', () => {
    const { getByPlaceholderText, getByText } = render(<BrowserRouter><Signup /></BrowserRouter>);
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'abc' } });
    expect(getByText('Very Weak')).toBeInTheDocument();
  });
  
  it('displays "Strong" for a complex password', () => {
    const { getByPlaceholderText, getByText } = render(<BrowserRouter><Signup /></BrowserRouter>);
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'Co":L"P:LmpleadfgfgsxPass12234!!!3!' } });
    expect(getByText('Strong')).toBeInTheDocument();
  });
  

});
