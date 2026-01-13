/**
 * ContactManager handles the management of user contacts.
 * It interacts with the existing user data structure in localStorage.
 */
class ContactManager {
    constructor() {
        this.STORAGE_KEY_USERS = "users";
    }

    /**
     * Retrieves the list of contacts for a specific user.
     * @param {string} userEmail - The email of the user (owner of contacts).
     * @returns {Array} List of contacts { name, email }.
     */
    getContacts(userEmail) {
        const users = this._getAllUsers();
        const user = users.find(u => u.email === userEmail);
        return user && user.contacts ? user.contacts : [];
    }

    /**
     * Adds a new contact for a specific user.
     * @param {string} userEmail - The email of the user (owner).
     * @param {string} contactName - Name of the new contact.
     * @param {string} contactEmail - Email of the new contact.
     * @returns {Object} Result { success, message, contact }.
     */
    addContact(userEmail, contactName, contactEmail) {
        if (!contactName || !contactEmail) {
            return { success: false, message: "Nombre y correo son obligatorios." };
        }

        const users = this._getAllUsers();
        const userIndex = users.findIndex(u => u.email === userEmail);

        if (userIndex === -1) {
            return { success: false, message: "Usuario principal no encontrado." };
        }

        const user = users[userIndex];
        if (!user.contacts) {
            user.contacts = [];
        }

        // Check for duplicate
        const exists = user.contacts.some(c => c.email === contactEmail);
        if (exists) {
            return { success: false, message: "El contacto ya existe." };
        }

        const newContact = { name: contactName, email: contactEmail };
        user.contacts.push(newContact);

        // Save
        users[userIndex] = user;
        this._saveAllUsers(users);

        return { success: true, message: "Contacto agregado exitosamente.", contact: newContact };
    }

    // Helper: Get all users from storage
    _getAllUsers() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY_USERS)) || [];
    }

    // Helper: Save all users to storage
    _saveAllUsers(users) {
        localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
    }
}

// Export instance
const contactManager = new ContactManager();
