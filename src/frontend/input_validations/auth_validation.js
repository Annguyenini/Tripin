// ─── Regex ────────────────────────────────────────────────────────────────────
const RE = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    username: /^[a-zA-Z][a-zA-Z0-9_]{2,14}$/,          // starts with letter, 3-15 total
    displayName: /^[a-zA-Z][a-zA-Z0-9 ]{1,9}$/,           // starts with letter, 5-10, no specials
    hasUpper: /[A-Z]/,
    hasDigit: /\d/,
    hasSpecial: /[!@#$%^&*]/,
    startsLetter: /^[a-zA-Z]/,
};

// ─── Field validators — return true if valid ──────────────────────────────────
export const validate = {
    email: (v = '') =>
        RE.email.test(v.trim()),

    username: (v = '') => {
        const s = v.trim();
        return s.length >= 3 && s.length <= 15 && RE.username.test(s);
    },

    // OAuth-only: just needs 3-24 chars, letters/numbers/underscores, starts with letter
    oauthUsername: (v = '') => {
        const s = v.trim();
        return s.length >= 3 && s.length <= 24 && /^[a-zA-Z][a-zA-Z0-9_]{2,23}$/.test(s);
    },

    password: (v = '') => {
        const s = v.trim();
        return (
            s.length >= 8 && s.length <= 15 &&
            RE.startsLetter.test(s) &&
            RE.hasUpper.test(s) &&
            RE.hasDigit.test(s) &&
            RE.hasSpecial.test(s)
        );
    },

    displayName: (v = '') => {
        const s = v.trim();
        return s.length >= 5 && s.length <= 10 && RE.displayName.test(s) && RE.hasUpper.test(s);
    },

    // OAuth display name: relaxed — just 2-32 chars, no special characters
    oauthDisplayName: (v = '') => {
        const s = v.trim();
        return s.length >= 2 && s.length <= 32 && /^[\p{L}\p{N}][\p{L}\p{N}\s]{1,31}$/u.test(s);
    },
    verifyCode: (v = '') =>
        /^\d{6}$/.test(v.trim()),

    passwordsMatch: (a = '', b = '') =>
        a === b,
};

// ─── Human-readable error messages ────────────────────────────────────────────
export const MESSAGES = {
    email: 'Enter a valid email address.',
    username: 'Username must be 3–15 characters, start with a letter, and contain only letters, numbers, or underscores.',
    oauthUsername: 'Username must be 3–24 characters, start with a letter, letters, numbers, and underscores only.',
    password: 'Password must be 8–15 characters, start with a letter, and include 1 uppercase, 1 number, and 1 special character (!@#$%^&*).',
    displayName: 'Display name must be 5–10 characters, start with a letter, contain 1 uppercase, and no special characters.',
    oauthDisplayName: 'Display name must be 2–32 characters, letters and numbers only.',
    passwordsMatch: 'Passwords do not match.',
    verifyCode: 'Enter the 6-digit code sent to your email.',
    required: 'Please fill out all required fields.',
};

// ─── Form-level validators — return array of error strings (empty = valid) ────
export function validateSignup({ email, username, displayName, password, confirmPassword }) {
    const errors = [];
    if (!validate.email(email)) errors.push(MESSAGES.email);
    if (!validate.username(username)) errors.push(MESSAGES.username);
    if (!validate.displayName(displayName)) errors.push(MESSAGES.displayName);
    if (!validate.password(password)) errors.push(MESSAGES.password);
    if (!validate.passwordsMatch(password, confirmPassword)) errors.push(MESSAGES.passwordsMatch);
    return errors;
}

export function validateLogin({ username, password }) {
    const errors = [];
    if (!username?.trim() || !password?.trim()) errors.push(MESSAGES.required);
    return errors;
}

export function validateOAuthComplete({ username, displayName, password, confirmPassword }) {
    const errors = [];
    if (!validate.oauthUsername(username)) errors.push(MESSAGES.oauthUsername);
    if (!validate.oauthDisplayName(displayName)) errors.push(MESSAGES.oauthDisplayName);
    if (!validate.password(password)) errors.push(MESSAGES.password)
    if (!validate.passwordsMatch(password, confirmPassword)) errors.push(MESSAGES.passwordsMatch);

    return errors;
}

export function validateVerification({ verifyCode }) {
    const errors = [];
    if (!validate.verifyCode(verifyCode)) errors.push(MESSAGES.verifyCode);
    return errors;
}