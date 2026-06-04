# React Hook Form Exercise - Complete Setup

## Project Overview

This is a comprehensive React Hook Form practical exercise with:
- ✅ Complete form component with validation
- ✅ Full Jest + React Testing Library test suite (11+ tests)
- ✅ Detailed explanations and best practices
- ✅ Production-ready code

## Quick Start

### 1. View the Form Component
Open: [src/components/FormComponent.js](src/components/FormComponent.js)

### 2. Run the Application
```bash
npm start
```
Opens on http://localhost:3000

### 3. Run the Tests
```bash
npm test
```

## Project Structure

```
src/
├── components/
│   ├── FormComponent.js          # Main form with React Hook Form
│   ├── FormComponent.css          # Component styling
│   └── __tests__/
│       └── FormComponent.test.js  # Jest + RTL tests (11+ tests)
├── App.js                        # Root component
├── App.css                       # App styling
├── index.js                      # Entry point
└── index.css                     # Global styles
```

## What You'll Learn

### Part 1: Form Component (FormComponent.js)
1. **useForm Hook** - Initialize form with validation and state
2. **register()** - Connect inputs to React Hook Form
3. **Validation Rules** - Configure required, pattern, custom validation
4. **handleSubmit()** - Wrap submission with validation
5. **formState.errors** - Display validation error messages

### Part 2: Unit Tests (FormComponent.test.js)
Tests cover:
- ✅ Form rendering (name, email, age fields + button)
- ✅ Empty field validation
- ✅ Email format validation
- ✅ Age range validation (18-65)
- ✅ Successful submission
- ✅ Submit handler verification
- ✅ Error message display
- ✅ Edge cases and boundaries

## Running Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Start dev server (http://localhost:3000) |
| `npm test` | Run Jest tests |
| `npm test -- --watch` | Run tests in watch mode |
| `npm test -- --coverage` | Generate coverage report |
| `npm build` | Build for production |

## Key Files to Study

1. **[README.md](../../README.md)** - Complete guide with detailed explanations
2. **[FormComponent.js](src/components/FormComponent.js)** - Form with inline comments explaining each concept
3. **[FormComponent.test.js](src/components/__tests__/FormComponent.test.js)** - 11+ commented tests with detailed explanations

## Validation Features

### Name Field
- ✅ Required
- ✅ Min length: 2 characters
- ✅ Max length: 50 characters

### Email Field
- ✅ Required
- ✅ Valid email format (regex pattern)

### Age Field
- ✅ Required
- ✅ Must be a number
- ✅ Min value: 18
- ✅ Max value: 65
- ✅ Custom validation with multiple checks

## Test Coverage

The test suite includes:
- **Form Rendering Tests** (4 tests)
  - Name field rendered
  - Email field rendered
  - Age field rendered
  - Submit button rendered

- **Validation Tests** (6+ tests)
  - Empty field validation
  - Invalid email format
  - Age < 18 validation
  - Age > 65 validation
  - Valid age range

- **Submission Tests** (3 tests)
  - Successful submission
  - Handler receives correct data
  - No errors with valid data

- **Integration Tests**
  - Multiple field interactions
  - Form reset and refill

- **Edge Cases**
  - Various email formats
  - Name length constraints

## Best Practices Demonstrated

✅ **React Hook Form**
- Uncontrolled components for performance
- Reusable validation rules object
- Minimal re-renders
- Built-in error handling

✅ **Testing with Jest + React Testing Library**
- User-centric testing (accessibility-first)
- Query by label and role (not test IDs)
- Simulate real user interactions
- Wait for async updates
- Test behavior, not implementation

✅ **Form Validation**
- Required field checks
- Format validation (email regex)
- Range validation (min/max)
- Custom validation logic
- Clear error messages

## Next Steps

1. **Study the form component**
   - Understand useForm hook
   - Learn validation rules
   - See how errors are displayed

2. **Run the tests**
   - npm test
   - See all 11+ tests pass
   - Study each test's purpose

3. **Modify and experiment**
   - Change validation rules
   - Add new fields
   - Create new tests

4. **Deep dive**
   - Read README.md for comprehensive explanations
   - Study inline comments in FormComponent.js
   - Review test descriptions

## Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [React Testing Library Docs](https://testing-library.com/)
- [Jest Docs](https://jestjs.io/)
- [Web Accessibility](https://www.w3.org/WAI/fundamentals/)

## Troubleshooting

**Tests not running?**
```bash
npm install --save-dev jest @testing-library/react
```

**Port 3000 already in use?**
```bash
npm start -- --port 3001
```

**Need to clear cache?**
```bash
npm test -- --clearCache
```

---

All code is production-ready and follows React best practices. Happy learning! 🚀
