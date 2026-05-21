import { useState, useCallback } from 'react';

export function useFormValidation(rules) {
  const [errors, setErrors] = useState({});
  const validate = useCallback((data) => {
    const errs = {};
    Object.entries(rules).forEach(([field, rule]) => {
      const val = data[field];
      if (rule.required && (!val || !val.toString().trim())) {
        errs[field] = rule.message || 'This field is required';
      } else if (rule.minLength && val && val.length < rule.minLength) {
        errs[field] = rule.message || `Minimum ${rule.minLength} characters`;
      } else if (rule.pattern && val && !rule.pattern.test(val)) {
        errs[field] = rule.message || 'Invalid format';
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [rules]);
  const clearError = useCallback(field => {
    setErrors(e => { const n={...e}; delete n[field]; return n; });
  }, []);
  return { errors, validate, clearError, setErrors };
}

