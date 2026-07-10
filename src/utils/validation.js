export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

export const checkPasswordStrength = (password) => {
  let score = 0;
  const feedback = [];

  if (!password) {
    return { score, label: 'Empty', color: 'bg-neutral-300', feedback };
  }

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Must be at least 8 characters long.');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one uppercase letter.');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one lowercase letter.');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one number.');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one special character.');
  }

  let label = 'Very Weak';
  let color = 'bg-red-500';

  switch (score) {
    case 0:
    case 1:
      label = 'Very Weak';
      color = 'bg-red-500';
      break;
    case 2:
      label = 'Weak';
      color = 'bg-orange-500';
      break;
    case 3:
      label = 'Fair';
      color = 'bg-yellow-500';
      break;
    case 4:
      label = 'Strong';
      color = 'bg-green-400';
      break;
    case 5:
      label = 'Excellent';
      color = 'bg-emerald-500';
      break;
    default:
      break;
  }

  return { score, label, color, feedback };
};

export const formatProfileName = (name) => {
  if (!name) return '';
  // Split names that are concatenated without proper spacing (e.g. AditiSenJaneDoe or Aditi SenJane Doe)
  return name
    .replace(/([A-Z][a-z]+)/g, ' $1')
    .replace(/\s+/g, ' ')
    .trim();
};
