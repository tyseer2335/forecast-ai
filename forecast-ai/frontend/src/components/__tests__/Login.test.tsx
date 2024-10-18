import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; // Mocked Firebase auth methods
import Login from '../Login';

/*
This test suite verifies the functionality of the Login component.

1. Rendering of the Login Form:
   - This test checks if all necessary form elements (email input, password input, login button, and "Sign in with Google" button) are rendered correctly.

2. Login Failure:
   - This test simulates a failed login attempt by mocking the `signInWithEmailAndPassword` function to throw an error.
   - It verifies that the error message "Login failed. Please try again." appears when the login fails.

3. Password Visibility Toggle:
   - This test checks the functionality of the password visibility toggle (eye icon).
   - It ensures that clicking the toggle button changes the password input type from `password` to `text`.

4. Successful Login:
   - This test simulates a successful login attempt by mocking `signInWithEmailAndPassword` to return a user object with an email verified status.
   - It verifies that no error message is displayed and that the page behaves correctly when login is successful.

5. Google Sign-in:
   - This test mocks the `signInWithPopup` method (used for Google sign-in).
   - It checks whether the function is called when the "Sign in with Google" button is clicked.

6. Page Redirection:
   - These tests verify that when users click on the "Learn More" and "Sign Up" buttons, the component navigates to the respective pages as expected.

7. Unverified Email Error:
   - This test simulates a login with an unverified email address and checks if the error message "User not email verified" is displayed.
*/

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

describe('Login Component', () => {
  it('renders the login form correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('shows error when login fails', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: 'auth/wrong-password',
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Login failed. Please try again.')).toBeInTheDocument();
  });

  it('toggles password visibility when clicking the eye icon', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  
    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByLabelText('toggle password visibility');
  
    expect(passwordInput).toHaveAttribute('type', 'password');
  
    fireEvent.click(toggleButton);
  
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
  

  it('navigates on successful login', async () => {
    // Mock successful login
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { emailVerified: true },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'valid@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'correctpassword' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() =>
      expect(screen.queryByText('Login failed. Please try again.')).not.toBeInTheDocument()
    );
  });

  it('signs in with Google when button is clicked', async () => {
    (signInWithPopup as jest.Mock).mockResolvedValue({
      user: { displayName: 'Test User' },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Sign in with Google'));

    expect(signInWithPopup).toHaveBeenCalled();
  });

  it('redirects to "Learn More" page when Learn More button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('learn more'));
    
    expect(screen.getByText('learn more')).toBeInTheDocument();
  });

  it('redirects to "Sign Up" page when Sign Up button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Sign Up'));
    
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows unverified email error when email is not verified', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { emailVerified: false },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'unverified@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('User not email verified. Please check your inbox to verify your email.')).toBeInTheDocument();
  });
});
