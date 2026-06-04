import React from 'react';
import { useForm } from 'react-hook-form';
import './FormComponent.css';

/**
 * FormComponent - A React Hook Form example demonstrating best practices
 * 
 * Key Concepts:
 * 1. useForm() - Initializes the form with validation and state management
 * 2. register() - Connects input fields to React Hook Form
 * 3. handleSubmit() - Validates form and handles submission
 * 4. formState.errors - Displays validation error messages
 */
function FormComponent() {
  // ========================================
  // 1. INITIALIZE FORM WITH useForm HOOK
  // ========================================
  // useForm returns an object with methods and state:
  // - register: Function to register inputs
  // - handleSubmit: Function to handle form submission
  // - formState: Object containing form state (errors, isDirty, isValid, etc.)
  // - watch: Function to watch specific fields
  // - reset: Function to reset form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    // Default values for form fields
    defaultValues: {
      name: '',
      email: '',
      age: ''
    },
    // Validation mode: 'onChange', 'onBlur', 'onSubmit', etc.
    mode: 'onBlur'
  });

  // ========================================
  // 2. VALIDATION RULES OBJECT
  // ========================================
  // Each field has its own validation configuration
  // React Hook Form uses these rules to validate input
  const validationRules = {
    name: {
      // required: true means this field must not be empty
      required: 'Name is required',
      // minLength validates minimum character length
      minLength: {
        value: 2,
        message: 'Name must be at least 2 characters'
      },
      // maxLength validates maximum character length
      maxLength: {
        value: 50,
        message: 'Name must not exceed 50 characters'
      }
    },

    email: {
      required: 'Email is required',
      // pattern validates email format using regex
      pattern: {
        // Standard email regex pattern
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Please enter a valid email address'
      }
    },

    age: {
      required: 'Age is required',
      // Validate that input is a number
      valueAsNumber: true,
      // Custom validation using validate function
      validate: {
        // First check: age must be >= 18
        minAge: (value) => {
          if (isNaN(value)) return 'Age must be a number';
          return value >= 18 || 'Age must be at least 18';
        },
        // Second check: age must be <= 65
        maxAge: (value) => {
          if (isNaN(value)) return 'Age must be a number';
          return value <= 65 || 'Age must not exceed 65';
        }
      }
    }
  };

  // ========================================
  // 3. HANDLE FORM SUBMISSION
  // ========================================
  // onSubmit is called by handleSubmit only if validation passes
  // It receives the validated form data as a parameter
  const onSubmit = (data) => {
    // Log form data to console (as per requirements)
    console.log('Form submitted successfully!', data);
    
    // Additional submission logic can go here:
    // - API calls
    // - Data processing
    // - Navigation
    
    // Show success message (optional)
    alert(`Form submitted!\n\nName: ${data.name}\nEmail: ${data.email}\nAge: ${data.age}`);
    
    // Reset form after successful submission (optional)
    reset();
  };

  // ========================================
  // 4. HANDLE VALIDATION ERRORS
  // ========================================
  // formState.errors is an object containing error messages
  // Structure: { fieldName: { message: "error message", type: "error type" } }
  // - errors.name contains name field errors
  // - errors.email contains email field errors
  // - errors.age contains age field errors
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container" noValidate>
      {/* ========================== */}
      {/* NAME FIELD */}
      {/* ========================== */}
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        
        {/* 
          register() connects this input to React Hook Form.
          It returns an object with: name, ref, onChange, onBlur, onFocus
          These properties are spread into the input for automatic tracking
          
          register parameters:
          1. Field name: 'name'
          2. Validation rules: validationRules.name
        */}
        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          {...register('name', validationRules.name)}
          className={`form-input ${errors.name ? 'input-error' : ''}`}
        />
        
        {/* Display error message if validation failed */}
        {errors.name && (
          <p className="error-message" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* ========================== */}
      {/* EMAIL FIELD */}
      {/* ========================== */}
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        
        <input
          id="email"
          type="email"
          placeholder="Enter your email address"
          {...register('email', validationRules.email)}
          className={`form-input ${errors.email ? 'input-error' : ''}`}
        />
        
        {/* Email error message */}
        {errors.email && (
          <p className="error-message" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* ========================== */}
      {/* AGE FIELD */}
      {/* ========================== */}
      <div className="form-group">
        <label htmlFor="age">Age *</label>
        
        <input
          id="age"
          type="number"
          placeholder="Enter your age (18-65)"
          {...register('age', validationRules.age)}
          className={`form-input ${errors.age ? 'input-error' : ''}`}
        />
        
        {/* Age error message */}
        {errors.age && (
          <p className="error-message" role="alert">
            {errors.age.message}
          </p>
        )}
      </div>

      {/* ========================== */}
      {/* SUBMIT BUTTON */}
      {/* ========================== */}
      <button type="submit" className="submit-button">
        Submit Form
      </button>
    </form>
  );
}

export default FormComponent;
