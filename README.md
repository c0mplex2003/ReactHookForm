# React Hook Form Practical Exercise

A comprehensive guide to building forms with React Hook Form, including validation, error handling, and unit tests with Jest and React Testing Library.

## 📋 Table of Contents

1. [Project Setup & Dependencies](#project-setup--dependencies)
2. [Part 1: Form Component Explanation](#part-1-form-component-explanation)
3. [Part 2: Unit Testing Guide](#part-2-unit-testing-guide)
4. [How to Run](#how-to-run)
5. [Key Concepts Deep Dive](#key-concepts-deep-dive)

## Unit Testing Guide

### Testing Philosophy

We use **React Testing Library** which follows this principle:

> **"Test the software the way users use it"**

Instead of testing implementation details, we test user behavior:
- ✅ Can users see the form fields?
- ✅ Do validation errors appear when needed?
- ✅ Does the form submit successfully?

---

### Test Organization

The test file is organized into logical sections:

```javascript
describe('FormComponent', () => {
  describe('Form Rendering', () => { /* Tests 1-4 */ })
  describe('Form Validation - Empty Fields', () => { /* Test 5 */ })
  describe('Form Validation - Email Field', () => { /* Tests 6-7 */ })
  describe('Form Validation - Age Field', () => { /* Tests 8-9 */ })
  describe('Form Submission - Success', () => { /* Tests 9-11 */ })
  describe('Form Edge Cases', () => { /* Additional tests */ })
})
```

---

### Test by Test Explanation

#### **TEST 1: Name field is rendered**

```javascript
test('renders the name input field', () => {
  render(<FormComponent />);
  const nameInput = screen.getByLabelText(/name/i);
  
  expect(nameInput).toBeInTheDocument();
  expect(nameInput).toHaveAttribute('type', 'text');
  expect(nameInput).toHaveAttribute('placeholder', /enter your full name/i);
});
```

**What is being tested:**
- Form component renders without crashing
- Name input is visible and accessible
- Input has correct type and placeholder

**Why it's important:**
- Ensures basic component rendering works
- Validates accessibility (label-input association)
- Guarantees users can find the form field
- Foundation for other tests

**Key concepts:**
- `render()`: Renders component in test environment
- `screen.getByLabelText()`: User-centric query (finds by label text)
- `expect().toBeInTheDocument()`: Jest matcher from @testing-library/jest-dom

---

#### **TEST 2 & 3: Email and Age fields**

Similar to Test 1, these verify all form fields render correctly.

**Key difference for age field:**
```javascript
expect(ageInput).toHaveAttribute('type', 'number');
```

This ensures the browser enforces numeric input.

---

#### **TEST 4: Submit button is rendered**

```javascript
test('renders the submit button', () => {
  render(<FormComponent />);
  const submitButton = screen.getByRole('button', { name: /submit form/i });
  
  expect(submitButton).toBeInTheDocument();
  expect(submitButton).toHaveAttribute('type', 'submit');
});
```

**Key concept:**
- `screen.getByRole()`: Finds elements by their accessibility role
- Most accessible query method (accessible tree)

---

#### **TEST 5: Validation errors for empty fields**

```javascript
test('displays validation errors for empty fields on submit', async () => {
  render(<FormComponent />);
  const submitButton = screen.getByRole('button', { name: /submit form/i });
  
  fireEvent.click(submitButton);
  
  await waitFor(() => {
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Age is required')).toBeInTheDocument();
  });
});
```

**What is being tested:**
- Required field validation triggers
- All three error messages appear
- Error messages are accessible (role="alert")

**Why it's important:**
- Critical test for form validation
- Prevents submission of empty forms
- Provides user feedback on required fields

**Key concepts:**
- `fireEvent.click()`: Simulates user click
- `await waitFor()`: Waits for async state updates
- `role="alert"`: Screen reader announces errors

---

#### **TEST 6: Invalid email validation**

```javascript
test('displays error for invalid email format', async () => {
  const user = userEvent.setup();
  render(<FormComponent />);
  
  const emailInput = screen.getByLabelText(/email/i);
  await user.type(emailInput, 'invalid-email');
  fireEvent.blur(emailInput);
  
  await waitFor(() => {
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });
});
```

**What is being tested:**
- Email format validation works
- Error appears on blur (validation mode)
- Specific error message is shown

**Why it's important:**
- Email is commonly mistyped by users
- Validation prevents invalid data submission
- Tests regex pattern validation

**Key concepts:**
- `userEvent.setup()`: Sets up user interaction utilities
- `user.type()`: More realistic typing simulation
- `fireEvent.blur()`: Triggers blur event

**Difference between `userEvent` and `fireEvent`:**
| `fireEvent` | `userEvent` |
|-------------|------------|
| Direct DOM event | Simulates real user actions |
| Faster but less realistic | Slower but more accurate |
| Used for blur/focus | Used for typing/clicking |

---

#### **TEST 7 & 8: Age validation (less than 18, greater than 65)**

```javascript
test('displays error when age is less than 18', async () => {
  const user = userEvent.setup();
  render(<FormComponent />);
  
  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/age/i), '15');
  
  const submitButton = screen.getByRole('button', { name: /submit form/i });
  fireEvent.click(submitButton);
  
  await waitFor(() => {
    expect(screen.getByText('Age must be at least 18')).toBeInTheDocument();
  });
});
```

**What is being tested:**
- Custom age validation works
- Boundary conditions enforced
- Specific error message displayed

**Why it's important:**
- Validates custom validation logic
- Tests business requirements
- Ensures age restrictions are enforced
- Important for compliance

**Key concepts:**
- `validate: { minAge: (value) => ... }`: Custom validation function
- Return error message on validation failure
- Return `true` on validation success

---

#### **TEST 9: Successful submission**

```javascript
test('submits form successfully with valid data', async () => {
  const user = userEvent.setup();
  render(<FormComponent />);
  
  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/age/i), '30');
  
  const submitButton = screen.getByRole('button', { name: /submit form/i });
  fireEvent.click(submitButton);
  
  await waitFor(() => {
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
```

**What is being tested:**
- Form accepts valid data
- No error messages appear
- Form resets after submission

**Why it's important:**
- Tests the "happy path" (successful flow)
- Ensures form works correctly with valid data
- Verifies reset functionality

**Key concepts:**
- `queryByRole()`: Returns null if not found (doesn't throw)
- `.not.toBeInTheDocument()`: Negative assertion
- Use `query*` for non-existent elements

---

#### **TEST 10: Submit handler receives correct data**

```javascript
test('calls submit handler with valid form data', async () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  
  // ... fill form with valid data ...
  
  fireEvent.click(submitButton);
  
  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith(
      'Form submitted successfully!',
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      })
    );
  });
  
  consoleSpy.mockRestore();
});
```

**What is being tested:**
- Submit handler receives all form data
- Data types are correct (age as number)
- Handler is called with expected values

**Why it's important:**
- Verifies data integrity
- Tests integration with handlers
- Ensures proper data typing for API calls

**Key concepts:**
- `jest.spyOn()`: Spies on function calls
- `mockImplementation()`: Replaces function temporarily
- `expect.objectContaining()`: Partial object matching
- `mockRestore()`: Removes spy after test

---

#### **TEST 11: No errors with valid data**

```javascript
test('displays no validation errors for valid form submission', async () => {
  // ... fill with valid data and submit ...
  
  await waitFor(() => {
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
  });
});
```

**Verification:**
- Ensures validation doesn't show false errors
- Confirms valid data passes all checks
- Tests validation accuracy

---

### Running the Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-run on file changes)
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test FormComponent.test.js
```

**Test Output:**
```
PASS  src/components/__tests__/FormComponent.test.js
  FormComponent
    Form Rendering
      ✓ renders the name input field (25ms)
      ✓ renders the email input field (18ms)
      ✓ renders the age input field (15ms)
      ✓ renders the submit button (12ms)
    Form Validation - Empty Fields
      ✓ displays validation errors for empty fields (45ms)
    ...
    
Tests: 11 passed, 11 total
```

---

## Key Concepts Deep Dive

### Controlled vs. Uncontrolled Components

**Controlled Component (Traditional React):**
```javascript
const [name, setName] = useState('');

<input 
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```
- ❌ Re-renders on every keystroke
- ❌ Verbose boilerplate
- ✅ Fine-grained control

**Uncontrolled Component (React Hook Form):**
```javascript
<input {...register('name')} />
```
- ✅ Minimal re-renders
- ✅ Clean, concise code
- ✅ Better performance

### Validation Modes Explained

```javascript
useForm({
  mode: 'onChange'  // Validates on every keystroke
  // Good for: Real-time feedback
  
  mode: 'onBlur'    // Validates when field loses focus
  // Good for: Less distraction while typing
  
  mode: 'onSubmit'  // Validates only on form submission
  // Good for: Better UX, avoid errors while typing (default)
  
  mode: 'onTouched' // Validates after field is touched and blurred
  // Good for: Combines best of both
})
```

### Testing Best Practices

1. **Use user-centric queries:**
   ```javascript
   ✅ screen.getByRole('button', { name: /submit/i })
   ✅ screen.getByLabelText(/name/i)
   ❌ screen.getByTestId('name-input')
   ❌ screen.getByClassName('form-input')
   ```

2. **Simulate real user interactions:**
   ```javascript
   ✅ userEvent.type(input, 'text')
   ✅ fireEvent.click(button)
   ❌ input.value = 'text'
   ```

3. **Wait for async updates:**
   ```javascript
   ✅ await waitFor(() => { expect(...) })
   ❌ expect(...)  // Might fail for async code
   ```

4. **Test behavior, not implementation:**
   ```javascript
   ✅ Is the error message visible?
   ✅ Does form submit with valid data?
   ❌ Is the state variable set?
   ❌ Was this function called?
   ```

---

## How to Run

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm start
```

Runs on `http://localhost:3000`

### 3. Run Tests

```bash
npm test
```

### 4. Build for Production

```bash
npm run build
```

---

## Summary: Key Takeaways

### React Hook Form Best Practices:
✅ Use uncontrolled components for better performance  
✅ Define validation rules in reusable objects  
✅ Use `handleSubmit()` wrapper for validation  
✅ Display errors from `formState.errors`  
✅ Use appropriate validation modes  

### Testing Best Practices:
✅ Test from user perspective  
✅ Use accessible queries (`getByRole`, `getByLabelText`)  
✅ Simulate real user interactions (`userEvent`)  
✅ Wait for async updates (`waitFor`)  
✅ Test behavior, not implementation  

### Form Validation Strategy:
✅ Required field validation  
✅ Format validation (email regex)  
✅ Range validation (min/max)  
✅ Custom validation logic  
✅ Clear error messages  

---

## Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Web Accessibility (a11y)](https://www.w3.org/WAI/fundamentals/)

---

**Happy coding! 🚀**
