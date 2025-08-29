export const validateField = (name, value) => {
  const validations = {
    email: {
      isValid: (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val);
      },
      message: "Please enter a valid email address",
    },
    username: {
      isValid: (val) => val.length >= 3 && val.length <= 50,
      message: "Username must be between 3 and 50 characters",
    },
    password: {
      isValid: (val) => {
        // Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(val);
      },
      message:
        "Password must have at least 8 characters, including uppercase, lowercase, number, and special character",
    },
    siteName: {
      isValid: (val) => val.length >= 2,
      message: "Site name must be at least 2 characters long",
    },
    url: {
      isValid: (val) => {
        if (!val) return true; // URL is optional
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      message: "Please enter a valid URL",
    },
  };

  if (!validations[name]) return { isValid: true, message: "" };

  const validation = validations[name];
  const isValid = validation.isValid(value);
  return {
    isValid,
    message: isValid ? "" : validation.message,
  };
};

export const validateForm = (formData) => {
  const errors = {};
  let isValid = true;

  Object.keys(formData).forEach((fieldName) => {
    const validationResult = validateField(fieldName, formData[fieldName]);
    if (!validationResult.isValid) {
      errors[fieldName] = validationResult.message;
      isValid = false;
    }
  });

  return { isValid, errors };
};
