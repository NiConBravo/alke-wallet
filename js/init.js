/**
 * Alke Wallet Bootloader
 * Ensures core managers are initialized and available for UI scripts.
 */

(function initApp() {
    console.log("Alke Wallet: Initializing...");

    // 1. Check Dependencies
    if (typeof transactionManager === 'undefined') {
        console.error("CRITICAL: transactionManager is not defined. usage of <script> tags might be incorrect.");
        window.transactionManager = null; // Prevent crash, but functionality is broken
    } else {
        console.log("TransactionManager: OK");
        window.transactionManager = transactionManager; // Ensure window access
    }

    if (typeof contactManager === 'undefined') {
        console.error("CRITICAL: contactManager is not defined.");
        window.contactManager = null;
    } else {
        console.log("ContactManager: OK");
        window.contactManager = contactManager; // Ensure window access
    }

    // 2. Data Integrity Check
    try {
        const users = localStorage.getItem("users");
        if (users) {
            JSON.parse(users); // Try parsing
        }
    } catch (e) {
        console.error("Data Corruption Detected! Resetting database...");
        localStorage.removeItem("users");
        location.reload();
    }

    // 3. Debug Utility
    window.alkeDebug = {
        resetData: function () {
            if (confirm("Are you sure you want to clear ALL data? This cannot be undone.")) {
                localStorage.clear();
                console.log("Local Storage cleared.");
                location.reload();
            }
        },
        dumpData: function () {
            console.log("Users:", JSON.parse(localStorage.getItem("users")));
            console.log("Current Session:", JSON.parse(sessionStorage.getItem("loggedInUser")));
        }
    };

    console.log("Alke Wallet: Ready. Use 'alkeDebug.resetData()' to wipe.");

})();
