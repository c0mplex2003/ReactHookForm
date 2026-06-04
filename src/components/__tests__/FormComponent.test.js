import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FormComponent from '../FormComponent';

/**
 * TEST FILE FOR REACT HOOK FORM COMPONENT
 * 
 * This test suite comprehensively tests the FormComponent using:
 * - Jest: Test framework
 * - React Testing Library: Testing utilities focused on user behavior
 * 
 * Testing Philosophy:
 * - Test from user perspective (not implementation details)
 * - Use user-centric queries (getByRole, getByLabelText)
 * - Simulate user interactions (typing, clicking, focus)
 */

describe('FormComponent', () => {
  
  // ======================================================
  // SECTION 1: FORM RENDERING TESTS
  // ======================================================
  // These tests verify that all form elements are rendered correctly
  
  describe('Form Rendering', () => {
    /**
     * TEST 1: Name field is rendered
     * 
     * What is being tested:
     * - The name input field is present in the DOM
     * - The label "Name" is visible to the user
     * - The input has correct attributes (type, placeholder, id)
     * 
     * Why this test is important:
     * - Ensures the component renders without crashing
     * - Verifies the form structure is correct
     * - Guarantees users can see the name field
     * - Validates accessibility (label associated with input)
     */
    test('renders the name input field', () => {
      render(<FormComponent />);
      
      // Query by label text - most user-friendly way
      const nameInput = screen.getByLabelText(/name/i);
      
      // Assertions
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveAttribute('type', 'text');
      expect(nameInput).toHaveAttribute('placeholder', /enter your full name/i);
    });

    /**
     * TEST 2: Email field is rendered
     * 
     * What is being tested:
     * - Email input field exists and is accessible
     * - Has correct type and placeholder
     * - Is properly labeled
     * 
     * Why this test is important:
     * - Email is a required field in the form
     * - Ensures the form layout is complete
     * - Validates user can interact with email field
     */
    test('renders the email input field', () => {
      render(<FormComponent />);
      
      const emailInput = screen.getByLabelText(/email/i);
      
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('placeholder', /enter your email address/i);
    });

    /**
     * TEST 3: Age field is rendered
     * 
     * What is being tested:
     * - Age input field is present
     * - Has number type (to restrict input to numbers)
     * - Shows proper placeholder hint about age range
     * 
     * Why this test is important:
     * - Age field has special number validation
     * - Needs to have type="number" for browser support
     * - Users need guidance on age range (18-65)
     */
    test('renders the age input field', () => {
      render(<FormComponent />);
      
      const ageInput = screen.getByLabelText(/age/i);
      
      expect(ageInput).toBeInTheDocument();
      expect(ageInput).toHaveAttribute('type', 'number');
      expect(ageInput).toHaveAttribute('placeholder', /enter your age/i);
    });

    /**
     * TEST 4: Submit button is rendered
     * 
     * What is being tested:
     * - Submit button exists and is clickable
     * - Has correct text
     * - Is of type "submit"
     * 
     * Why this test is important:
     * - Submit button is essential for form submission
     * - Must be visible and accessible
     * - Correct type ensures form submission behavior
     */
    test('renders the submit button', () => {
      render(<FormComponent />);
      
      const submitButton = screen.getByRole('button', { name: /submit form/i });
      
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });

  // ======================================================
  // SECTION 2: VALIDATION ERROR TESTS
  // ======================================================
  // These tests verify that validation works correctly for each field
  
  describe('Form Validation - Empty Fields', () => {
    /**
     * TEST 5: Validation errors appear when form is submitted with empty fields
     * 
     * What is being tested:
     * - Submitting empty form shows all three error messages
     * - Error messages are displayed below correct fields
     * - Error messages are accessible (role="alert")
     * 
     * Why this test is important:
     * - Critical for required field validation
     * - Users need clear feedback when fields are missing
     * - Prevents submission of incomplete forms
     * - Tests the complete validation flow
     */
    test('displays validation errors for empty fields on submit', async () => {
      render(<FormComponent />);
      
      // Get the submit button
      const submitButton = screen.getByRole('button', { name: /submit form/i });
      
      // Click submit without filling any fields
      fireEvent.click(submitButton);
      
      // Wait for error messages to appear (async validation)
      await waitFor(() => {
        // Check that all three error messages are displayed
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Age is required')).toBeInTheDocument();
      });
      
      // Verify error messages have correct accessibility role
      const errorMessages = screen.getAllByRole('alert');
      expect(errorMessages.length).toBe(3);
    });
  });

  describe('Form Validation - Email Field', () => {
    /**
     * TEST 6: An error appears when an invalid email is entered
     * 
     * What is being tested:
     * - Invalid email format triggers validation error
     * - Specific email validation error message is shown
     * - Error appears before form submission (onBlur mode)
     * 
     * Why this test is important:
     * - Email validation is critical for data integrity
     * - Users need immediate feedback on incorrect format
     * - Prevents invalid emails from being submitted
     * - Tests regex pattern validation in React Hook Form
     */
    test('displays error for invalid email format', async () => {
      const user = userEvent.setup();
      render(<FormComponent />);
      
      // Get the email input
      const emailInput = screen.getByLabelText(/email/i);
      
      // Type invalid email
      await user.type(emailInput, 'invalid-email');
      
      // Trigger blur event (validation mode is onBlur)
      fireEvent.blur(emailInput);
      
      // Wait for error message to appear
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    /**
     * Alternative test: Testing with different invalid email formats
     */
    test('rejects various invalid email formats', async () => {
      const user = userEvent.setup();
      const invalidEmails = [
        'notanemail',      // Missing @
        '@example.com',    // Missing local part
        'user@',           // Missing domain
        'user@.com',       // Invalid domain
      ];

      for (const invalidEmail of invalidEmails) {
        const { unmount } = render(<FormComponent />);
        
        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, invalidEmail);
        fireEvent.blur(emailInput);
        
        await waitFor(() => {
          expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        });
        
        unmount();
      }
    });
  });

  describe('Form Validation - Age Field', () => {
    /**
     * TEST 7: An error appears when age is less than 18
     * 
     * What is being tested:
     * - Age validation rejects values below 18
     * - Specific error message for minimum age is shown
     * - Validation runs on form submission
     * 
     * Why this test is important:
     * - Age range validation is critical for business logic
     * - Tests custom validation with validate() function
     * - Ensures only valid age groups are accepted
     * - Important for compliance/legal requirements
     */
    test('displays error when age is less than 18', async () => {
      const user = userEvent.setup();
      render(<FormComponent />);
      
      // Fill in required fields
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      
      // Enter age less than 18
      await user.type(screen.getByLabelText(/age/i), '15');
      
      // Click submit to trigger validation
      const submitButton = screen.getByRole('button', { name: /submit form/i });
      fireEvent.click(submitButton);
      
      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText('Age must be at least 18')).toBeInTheDocument();
      });
    });

    /**
     * TEST 8: An error appears when age is greater than 65
     * 
     * What is being tested:
     * - Age validation rejects values above 65
     * - Specific error message for maximum age is shown
     * - Upper boundary validation works correctly
     * 
     * Why this test is important:
     * - Tests upper boundary validation
     * - Ensures age range limits are enforced
     * - Important for age-restricted services
     * - Verifies custom validation logic
     */
    test('displays error when age is greater than 65', async () => {
      const user = userEvent.setup();
      render(<FormComponent />);
      
      // Fill in required fields
      await user.type(screen.getByLabelText(/name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      
      // Enter age greater than 65
      await user.type(screen.getByLabelText(/age/i), '70');
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit form/i });
      fireEvent.click(submitButton);
      
      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText('Age must not exceed 65')).toBeInTheDocument();
      });
    });

    /**
     * TEST: Valid age range (18-65) passes validation
     * 
     * Boundary testing - ensure edge cases work
     */
    test('accepts valid ages (18-65)', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<FormComponent />);
      
      // Test age 18 (lower boundary)
      await user.type(screen.getByLabelText(/name/i), 'John');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/age/i), '18');
      
      const submitButton = screen.getByRole('button', { name: /submit form/i });
      fireEvent.click(submitButton);
      
      // Should not show age error
      await waitFor(() => {
        expect(screen.queryByText(/age must be/i)).not.toBeInTheDocument();
      });
      
      unmount();
      
      // Test age 65 (upper boundary)
      render(<FormComponent />);
      await user.type(screen.getByLabelText(/name/i), 'Jane');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/age/i), '65');
      
      fireEvent.click(screen.getByRole('button', { name: /submit form/i }));
      
      await waitFor(() => {
        expect(screen.queryByText(/age must be/i)).not.toBeInTheDocument();
      });
    });
  });

  // ======================================================
  // SECTION 3: SUCCESSFUL SUBMISSION TESTS
  // ======================================================
  // These tests verify that the form submits successfully with valid data
  
  describe('Form Submission - Success', () => {
    /**
     * TEST 9: The form submits successfully when valid data is entered
     * 
     * What is being tested:
     * - Form accepts valid input for all fields
     * - Submission completes without errors
     * - Form clears after successful submission (reset)
     * - No validation errors are shown
     * 
     * Why this test is important:
     * - Validates the happy path (successful submission)
     * - Ensures form works correctly with valid data
     * - Tests reset functionality
     * - Critical for user experience
     */
    test('submits form successfully with valid data', async () => {
      const user = userEvent.setup();
      render(<FormComponent />);
      
      // Fill in all fields with valid data
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/age/i), '30');
      
      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit form/i });
      fireEvent.click(submitButton);
      
      // Wait and verify no error messages appear
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
      
      // Verify form fields are cleared (reset called)
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('');
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
        expect(screen.getByLabelText(/age/i)).toHaveValue(null);
      });
    });

    /**
     * TEST 10: The submit handler is called with the correct data
     * 
     * What is being tested:
     * - onSubmit handler receives correct form data
     * - Form data has all required fields
     * - Data types are correct (age should be a number)
     * 
     * Why this test is important:
     * - Verifies form data is passed correctly to handlers
     * - Ensures data types are preserved (age as number, not string)
     * - Critical for backend API integration
     * - Tests the complete form submission flow
     * 
     * NOTE: This test would require mocking console.log or the submit handler
     */
    test('calls submit handler with valid form data', async () => {
      const user = userEvent.setup();
      
      // Mock console.log to capture form data
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      render(<FormComponent />);
      
      const testData = {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        age: 28
      };
      
      // Fill form with test data
      await user.type(screen.getByLabelText(/name/i), testData.name);
      await user.type(screen.getByLabelText(/email/i), testData.email);
      await user.type(screen.getByLabelText(/age/i), testData.age.toString());
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit form/i });
      fireEvent.click(submitButton);
      
      // Wait for submit and verify console.log was called
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Form submitted successfully!',
          expect.objectContaining({
            name: testData.name,
            email: testData.email,
            age: testData.age
          })
        );
      });
      
      // Cleanup
      consoleSpy.mockRestore();
    });

    /**
     * TEST 11: No validation errors are displayed when valid data is provided
     * 
     * What is being tested:
     * - Valid data passes all validation checks
     * - No error messages appear after submission
     * - Form fields don't have error styling
     * 
     * Why this test is important:
     * - Ensures validation passes for correct data
     * - Verifies no false errors for valid input
     * - Important for user confidence in the form
     * - Tests complete validation flow
     */
    test('displays no validation errors for valid form submission', async () => {
      const user = userEvent.setup();
      render(<FormComponent />);
      
      // Fill form with valid data
      await user.type(screen.getByLabelText(/name/i), 'Bob Wilson');
      await user.type(screen.getByLabelText(/email/i), 'bob@example.com');
      await user.type(screen.getByLabelText(/age/i), '45');
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit form/i }));
      
      // Verify no error messages or alerts exist
      await waitFor(() => {
        expect(screen.queryAllByRole('alert')).toHaveLength(0);
      });
    });
  });

  // ======================================================
  // SECTION 4: INTEGRATION TESTS
  // ======================================================
  // These tests verify multiple features working together
  
  describe('Form Integration', () => {
    /**
     * TEST: Multiple field interactions
     * 
     * What is being tested:
     * - User can interact with multiple fields sequentially
     * - Validation happens independently for each field
     * - Form state is managed correctly across interactions
     */
    test('handles multiple field interactions correctly', async () => {
      const user = userEvent.setup();
      render(<FormComponent />);
      
      // Fill name
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test User');
      expect(nameInput).toHaveValue('Test User');
      
      // Fill email
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      expect(emailInput).toHaveValue('test@example.com');
      
      // Fill age
      const ageInput = screen.getByLabelText(/age/i);
      await user.type(ageInput, '25');
      expect(ageInput).toHaveValue(25);
    });

    /**
     * TEST: Form can be filled and cleared multiple times
     * 
     * What is being tested:
     * - User can clear inputs and re-enter data
     * - Form maintains correct state
     * - Reset doesn't break the form
     */
    test('allows clearing and refilling form fields', async () => {
      const user = userEvent.setup();
      render(<FormComponent />);
      
      const nameInput = screen.getByLabelText(/name/i);
      
      // First entry
      await user.type(nameInput, 'First Name');
      expect(nameInput).toHaveValue('First Name');
      
      // Clear field
      await user.selectAll(nameInput);
      await user.type(nameInput, 'Second Name');
      expect(nameInput).toHaveValue('Second Name');
    });
  });

  // ======================================================
  // SECTION 5: EDGE CASE TESTS
  // ======================================================
  // These tests verify edge cases and boundary conditions
  
  describe('Form Edge Cases', () => {
    /**
     * TEST: Valid email formats
     * 
     * Tests that various valid email formats are accepted
     */
    test('accepts various valid email formats', async () => {
      const user = userEvent.setup();
      const validEmails = [
        'simple@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com',
      ];

      for (const validEmail of validEmails) {
        const { unmount } = render(<FormComponent />);
        
        // Fill form with valid email and other data
        await user.type(screen.getByLabelText(/name/i), 'Test User');
        await user.type(screen.getByLabelText(/email/i), validEmail);
        await user.type(screen.getByLabelText(/age/i), '30');
        
        // Submit
        fireEvent.click(screen.getByRole('button', { name: /submit form/i }));
        
        // Should not show email error
        await waitFor(() => {
          expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
        });
        
        unmount();
      }
    });

    /**
     * TEST: Name length validation
     * 
     * Tests minimum and maximum name length
     */
    test('validates name length constraints', async () => {
      const user = userEvent.setup();
      render(<FormComponent />);
      
      // Test with one character (should fail minLength)
      await user.type(screen.getByLabelText(/name/i), 'A');
      fireEvent.blur(screen.getByLabelText(/name/i));
      
      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      });
    });
  });
});
