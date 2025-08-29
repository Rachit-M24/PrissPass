import { useState, useCallback } from 'react';
import { validateField, validateForm } from '../../utils/formValidation';

export const useFormValidation = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate field on change
    const validationResult = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: validationResult.isValid ? '' : validationResult.message
    }));
  }, []);

  const validateFormData = useCallback(() => {
    const { isValid, errors: validationErrors } = validateForm(formData);
    setErrors(validationErrors);
    return isValid;
  }, [formData]);

  return {
    formData,
    setFormData,
    errors,
    handleChange,
    validateFormData
    
  };
};