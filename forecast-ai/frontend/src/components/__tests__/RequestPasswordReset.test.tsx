import { render, fireEvent, screen, act } from '@testing-library/react';
import RequestPasswordReset from '../RequestPasswordReset';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

/**
 * RequestPasswordReset Component Test Cases
 * 
 * 1. **renders the input box and button correctly:**
 *    - This test checks if the email input field and submit button are present in the component when it is rendered.
 * 
 * 2. **updates email state on input change:**
 *    - This test ensures that the email input field updates the component’s state when the user types in it.
 */

describe('RequestPasswordReset Component', () => {

  it('renders the input box and button correctly', () => {
    render(
      <BrowserRouter>
        <RequestPasswordReset />
      </BrowserRouter>
    );

    // Check if input field and button are present
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByText('Send Reset Email')).toBeInTheDocument();
  });

  it('updates email state on input change', () => {
    render(
      <BrowserRouter>
        <RequestPasswordReset />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    
    // Simulate typing an email into the input field
    act(() => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    });

    // Check if the value of the input has been updated
    expect(emailInput).toHaveValue('test@example.com');
  });
});
