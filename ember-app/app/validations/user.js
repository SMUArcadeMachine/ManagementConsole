import {
    validatePresence,
    validateLength,
    validateConfirmation,
    validateFormat
} from 'ember-changeset-validations/validators';

export default {
    username: [
        validateFormat({ type: 'email' }),
        validatePresence(true)
    ],
    username2: [
        validateConfirmation({ on: 'username' }),
        validatePresence(true)
    ],
    password: [
        validateLength({ min: 3 }),
        validatePresence(true)
    ],
    password2: [
        validateConfirmation({ on: 'password' }),
        validatePresence(true)
    ]
};