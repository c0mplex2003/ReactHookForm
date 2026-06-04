# React Hook Form - Quick Reference Card

## Installation & Setup

```javascript
// Install
npm install react-hook-form

// Import
import { useForm } from 'react-hook-form';

// Initialize
const { register, handleSubmit, formState: { errors }, reset } = useForm();
```

---

## Core Concepts at a Glance

### 1. useForm() Hook

```javascript
const { register, handleSubmit, formState: { errors }, reset } = useForm({
  defaultValues: { name: '', email: '' },
  mode: 'onSubmit'  // 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched'
});
```

**Returns:**
- `register`: Function to connect inputs
- `handleSubmit`: Form submission handler
- `formState.errors`: Validation errors
- `reset`: Reset form to defaults

---

### 2. register() - Connect Inputs

```javascript
<input {...register('fieldName', validationRules)} />
```

**What it does:**
- Connects input to form state
- Tracks changes, blur, focus
- Applies validation rules
- Stores value in form data

---

### 3. Validation Rules

```javascript
register('name', {
  required: 'This field is required',
  minLength: { value: 2, message: '2+ chars' },
  maxLength: { value: 50, message: 'Max 50' },
  pattern: { value: /regex/, message: 'Invalid' },
  validate: {
    isUnique: async (val) => await check(val) || 'Exists',
    custom: (val) => val === 'admin' || 'Not admin'
  }
})
```

**Built-in Rules:**
| Rule | Type | Example |
|------|------|---------|
| `required` | String/Boolean | `true` or message |
| `min` | Number | `18` for age >= 18 |
| `max` | Number | `65` for age <= 65 |
| `minLength` | Object | `{ value: 2, message: '...' }` |
| `maxLength` | Object | `{ value: 50, message: '...' }` |
| `pattern` | Object | `{ value: /regex/, message: '...' }` |
| `validate` | Fn/Object | Custom validation logic |

---

### 4. handleSubmit() - Validation & Submission

```javascript
const onSubmit = (data) => {
  console.log(data); // { name: '...', email: '...', ... }
};

<form onSubmit={handleSubmit(onSubmit)}>
  <!-- form fields -->
</form>
```

**Flow:**
```
User clicks submit
  ↓
handleSubmit() intercepts
  ↓
Validates all fields
  ↓
PASS → Calls onSubmit(validData)
FAIL → Shows errors, doesn't call onSubmit()
```

---

### 5. Display Errors

```javascript
{errors.name && (
  <p role="alert">{errors.name.message}</p>
)}
```

**Error object:**
```javascript
{
  fieldName: {
    message: 'Error message',
    type: 'required' | 'pattern' | 'validate' | etc.
  }
}
```

**Check error type:**
```javascript
{errors.age?.type === 'minAge' && <p>Too young</p>}
{errors.age?.type === 'maxAge' && <p>Too old</p>}
```

---

## Complete Example

```javascript
import { useForm } from 'react-hook-form';

export default function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur'
  });

  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      
      {/* Name field */}
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: '2+ chars' }
          })}
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email'
            }
          })}
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      {/* Submit button */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Testing with React Testing Library

### Basic Test Structure

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

test('form validation', async () => {
  const user = userEvent.setup();
  render(<FormComponent />);
  
  // Query elements (accessible first)
  const nameInput = screen.getByLabelText(/name/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });
  
  // Type text
  await user.type(nameInput, 'Test User');
  
  // Click button
  fireEvent.click(submitButton);
  
  // Wait for async updates
  await waitFor(() => {
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
```

### Query Priority (Most Accessible First)

```javascript
// 1. Query by role (best for accessibility)
screen.getByRole('button', { name: /submit/i })

// 2. Query by label text (good for form fields)
screen.getByLabelText(/email/i)

// 3. Query by placeholder
screen.getByPlaceholderText(/enter email/i)

// 4. Query by text content
screen.getByText('Click me')

// 5. Query by test ID (last resort)
screen.getByTestId('submit-button')
```

### Common Test Patterns

```javascript
// Check element exists
expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

// Check input value
expect(inputElement).toHaveValue('expected value');

// Check element has attribute
expect(inputElement).toHaveAttribute('type', 'email');

// Check error message appears
expect(screen.getByText('Name is required')).toBeInTheDocument();

// Check error message doesn't appear
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// Count alerts
expect(screen.queryAllByRole('alert')).toHaveLength(3);
```

---

## Common Patterns

### Pattern 1: Custom Validation

```javascript
register('age', {
  validate: (value) => {
    if (value < 18) return 'Must be 18+';
    if (value > 65) return 'Must be 65 or under';
    return true; // or undefined for success
  }
})
```

### Pattern 2: Conditional Validation

```javascript
register('phone', {
  validate: (value) => {
    if (needsPhone && !value) return 'Phone required';
    return true;
  }
})
```

### Pattern 3: Cross-field Validation

```javascript
const { watch } = useForm();
const password = watch('password');

register('confirmPassword', {
  validate: (value) => value === password || 'Passwords do not match'
})
```

### Pattern 4: Async Validation

```javascript
register('username', {
  validate: async (value) => {
    const exists = await checkUsername(value);
    return !exists || 'Username already taken';
  }
})
```

### Pattern 5: Display Multiple Errors

```javascript
{errors.email?.message && <p>{errors.email.message}</p>}
{errors.email?.type === 'pattern' && <p>Invalid format</p>}
{errors.email?.type === 'required' && <p>Email required</p>}
```

---

## Validation Rules Comparison

### vs. HTML5 Validation

```javascript
// React Hook Form (preferred)
{...register('age', {
  min: { value: 18, message: 'Must be 18+' }
})}

// vs. HTML5 only
<input type="number" min="18" />
```

**Advantages of React Hook Form:**
- ✅ Consistent error handling
- ✅ Custom error messages
- ✅ Async validation
- ✅ Works in all browsers
- ✅ Cross-browser error messages

---

## Performance Tips

1. **Use uncontrolled components** (automatic with register)
   ```javascript
   ✅ {...register('name')}        // Uncontrolled - minimal re-renders
   ❌ value={name} onChange={...}  // Controlled - more re-renders
   ```

2. **Validate on blur for better UX**
   ```javascript
   mode: 'onBlur'  // Don't distract while typing
   ```

3. **Watch only what you need**
   ```javascript
   const { watch } = useForm();
   const name = watch('name');  // Only re-render if 'name' changes
   ```

4. **Use validation modes wisely**
   ```javascript
   'onChange'   // For quick feedback (like search)
   'onBlur'     // For better UX (standard)
   'onSubmit'   // Validate only on submit (default)
   'onTouched'  // After field touched and blurred
   ```

---

## Common Issues & Solutions

### Issue: Form not submitting
```javascript
// Make sure handleSubmit wrapper is used
<form onSubmit={handleSubmit(onSubmit)}>  ✅
<form onSubmit={onSubmit}>                ❌
```

### Issue: Errors not showing
```javascript
// Make sure to display errors
{errors.name && <p>{errors.name.message}</p>}  ✅
```

### Issue: Values not persisting
```javascript
// Use reset() to preserve values
reset(data);  // Resets to new defaults
reset();      // Resets to original defaults
```

### Issue: Async validation not working
```javascript
// Return promise or async function
validate: async (value) => {
  const result = await checkValue(value);
  return result || 'Error message';
}
```

---

## Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [React Testing Library Docs](https://testing-library.com/)
- [Jest Matchers](https://jestjs.io/docs/expect)
- [Accessible HTML Forms](https://www.w3.org/WAI/tutorials/forms/)

---

## TL;DR - Minimal Working Example

```javascript
import { useForm } from 'react-hook-form';

export default function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('name', { required: true })} />
      {errors.name && <p>Required</p>}
      <button>Submit</button>
    </form>
  );
}
```

That's it! You now understand React Hook Form. 🚀
