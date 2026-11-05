export interface ContactFields { user_name: string; user_email: string; message: string }
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;
export const contactLimits = { user_name: 80, user_email: 254, message: 2000 };
export function validateContact(fields: ContactFields): ContactErrors {
    const errors: ContactErrors = {};
    const name = fields.user_name.trim(), email = fields.user_email.trim(), message = fields.message.trim();
    if (!name) errors.user_name = 'Please enter your name.';
    else if (name.length > contactLimits.user_name) errors.user_name = 'Use 80 characters or fewer for your name.';
    if (!email) errors.user_email = 'Please enter your email address.';
    else if (email.length > contactLimits.user_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.user_email = 'Enter a valid email address, such as name@example.com.';
    if (!message) errors.message = 'Please write a message; spaces alone are not enough.';
    else if (message.length > contactLimits.message) errors.message = 'Keep your message within 2,000 characters.';
    return errors;
}
