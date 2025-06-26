// --- Firebase Variables (Global, will be assigned from window in DOMContentLoaded) ---
let db;
let auth;
let appId;
let userId; // Will store the current authenticated user's UID or a random ID for anonymous users

// --- Data Variables ---
// `products` will store product information. Now will load from Firebase.
let products = [];
// `currentTransactionItems` stores items in the current cart.
let currentTransactionItems = [];
// `transactionHistory` stores all completed transactions for financial reporting.
let transactionHistory = [];
// `expenses` stores all recorded expenses.
let expenses = [];
// `users` stores all registered users for login and management.
let users = []; // New: Array to store users
// `loggedInUser` stores the currently logged-in user object.
let loggedInUser = null; // New: Stores the currently logged-in user
// `currentTransactionMode` tracks if we are in 'registered' or 'custom' product input mode.
let currentTransactionMode = 'registered';

// New variables for daily revenue tracking
let dailyRevenue = 0;
let lastRecordedDate = ''; // Format:YYYY-MM-DD
let isRevenueVisible = true; // New: State for revenue visibility
let isDarkMode = false; // New: State for dark mode

// New variables for monthly financial tracking
let monthlyNetProfit = 0;
let monthlyExpenses = 0;
let lastRecordedMonth = ''; // Format:YYYY-MM

// Bluetooth Printer variables
let bluetoothPrinterDevice = null; // Stores the connected BluetoothDevice object
let printerCharacteristic = null; // Stores the BluetoothGATTCharacteristic for writing data

// --- DOM Elements (Declared here, assigned on DOMContentLoaded) ---
// Main App Containers
let loginScreen;
let mainAppContainer;

// Login Screen Elements
let loginScreenUsernameInput;
let loginScreenPasswordInput;
let loginScreenBtn;
let loginScreenMessage;

let itemList;
let totalAmountInput;
let discountAmountInput;
let paymentAmountInput;
let paymentMethodSelect; // NEW: Payment method dropdown
let changeAmountHeader; // New span in header for change amount
let statusElement;
let newTransactionButton;
let printReceiptButton;
let processOnlyPaymentButton;
let noItemsMessage;
let headerDateTime;
let headerDailyRevenue; // The span that displays the actual number
let headerDailyRevenueAmountContainer; // The container for the revenue amount and its "Rp" prefix
let toggleDailyRevenueVisibilityButton; // New: Button to toggle visibility
let eyeIcon; // New: Eye icon for visible state
let eyeSlashIcon; // New: Eye slash icon for hidden state
let cashierDisplay;
let cashierRole;
let logoutButton; // New: Logout button in header
let darkModeToggle; // New: Dark mode toggle button

// Monthly Financial Bar elements
let monthlyFinancialBarContainer;
let monthlyProfitBar;
let monthlyExpenseBar;


// Registered product input elements
let productCodeInput;
let productNameInput;
let priceInput;
let quantityInput;
let addRegisteredItemButton;

// Custom product input elements
let customProductCodeInput;
let customProductNameInput;
let customProductPriceInput;
let customProductQtyInput;
let addCustomItemButton;

let showRegisteredProductsButton;
let showCustomProductsButton;
let customProductSection;
let registeredProductSection;

// Admin menu elements
let adminMenuButton;
let adminMenuDropdown;
let openStoreProductsModalBtn;
let openAddProductModalBtn;
let openFinancialReportModalBtn;
let openExpensesModalBtn;
let openUserSettingsModalBtn; // New: Open User Settings Modal Button
let openPriceCalculatorModalBtn; // NEW: Open Price Calculator Modal Button
let exportProductsBtn;
let importProductsFileInput;
let importProductsBtn;
let exportDataBtn;
let importFileInput;
let importDataBtn;
let resetAllDataBtn;

// Store Products Modal elements
let storeProductsModal;
let closeStoreProductsModalBtn;
let storeProductsTableBody;
let searchStoreProductsInput;
let storeProductsTableContainer;
let editProductForm;
let editProductIdInput;
let editProductNameInput;
let editProductCostInput;
let editProductPriceInput;
let editProductStockInput;
let saveProductEditBtn;
let cancelProductEditBtn;

// Add Product Modal elements
let addProductModal;
let closeAddProductModalBtn;
let addProductCodeInput;
let addProductNameInput;
let addProductCostInput;
let addProductPriceInput;
let addProductProfitInput;
let addProductStockInput;
let saveNewProductBtn;
let cancelAddProductBtn;

// Expenses Modal elements
let expensesModal;
let closeExpensesModalBtn;
let expenseDateInput;
let expenseDescriptionInput;
let expenseAmountInput;
let addExpenseBtn;
let expensesListBody;
let emptyExpensesMessage;
let expenseStatusMessage;
let expenseSearchInput;
let expenseFilterStartDate;
let expenseFilterEndDate;
let applyExpenseFilterBtn;
let clearExpenseFilterBtn;
let totalExpensesDisplayModal;


// Financial Report Modal elements
let financialReportModal;
let closeFinancialReportModalBtn;
let reportStartDateInput;
let reportEndDateInput;
let applyFinancialFilterBtn;
let clearFinancialFilterBtn;
let totalRevenueDisplay;
let totalExpensesDisplay;
let grossProfitDisplay;
let netProfitDisplay;
let financialChartCanvas;
let financialReportMessageBox;

// Transaction History Modal elements
let openTransactionHistoryBtn;
let transactionHistoryModal;
let closeTransactionHistoryModalBtn;
let transactionHistoryTableBody;
let historyStartDateInput;
let historyEndDateInput;
let applyHistoryFilterBtn;
let clearHistoryFilterBtn;
let transactionHistoryMessageBox;
let transactionDetailSection;
let detailTransactionId;
let detailTransactionDate;
let detailCashier;
let detailSubtotal;
let detailDiscount;
let detailTotalAmount;
let detailPaymentAmount;
let detailChangeAmount;
let detailItemList;
let closeTransactionDetailBtn;
let reprintReceiptBtn; // New: Reprint receipt button in detail section
let historyFilterControls;
let totalTransactionsAmount;

// Confirmation Modal elements
let confirmationModal;
let confirmationMessage;
let confirmOkBtn;
let confirmCancelBtn;
let confirmPromiseResolve;

// User Settings Modal (New)
let userSettingsModal;
let closeUserSettingsModalBtn;
let userSettingsLoginSection; // Renamed to avoid clash with main login
let userSettingsLoginUsernameInput; // Renamed
let userSettingsLoginPasswordInput; // Renamed
let userSettingsLoginButton; // Renamed
let userSettingsLoginStatusMessage; // Renamed
let userManagementSection;
let newUserNameInput;
let newUserPasswordInput;
let newUserRoleSelect;
let addUserButton;
let addUserStatusMessage;
let userListBody;
let emptyUserMessage;

// Printer Settings Modal (New)
let openPrinterSettingsBtn;
let printerSettingsModal;
let closePrinterSettingsModalBtn;
let printerStatus;
let connectPrinterBtn;
let disconnectPrinterBtn;
let testPrintBtn;

// Price Calculator Modal (NEW)
let priceCalculatorModal;
let closePriceCalculatorModalBtn;
let priceCalcProductCodeInput;
let copyProductCodeBtn;
let priceCalcProductNameInput;
let priceCalcModalInput;
let priceCalcMarginPercentInput;
let priceCalcTaxPercentInput;
let priceCalcDiscountPercentInput;
let calculatePriceBtn;
let priceCalcSellingPriceInput;
let copySellingPriceBtn;
let priceCalcProfitInput;
let priceCalcStatusMessage;

// Nominal Quick Pay Buttons (NEW)
let nominalButtonsContainer; // Container for quick pay buttons
let nominalButtons; // Collection of quick pay buttons

// New: Audio element for coin sound
let coinSoundAudio;

// New: Reset data modal elements
let resetDataModal;
let resetPasswordInput;
let resetDataConfirmBtn;
let resetDataCancelBtn;
let resetDataMessage;


// --- Hardcoded password for reset (as per user request) ---
const RESET_PASSWORD = "alfajrihanif24@gmail.com";


// --- Firebase Firestore Functions ---

// Helper function to get the correct collection path based on userId
function getCollectionPath(collectionName) {
    // For now, all data is stored under the user's ID.
    // If you want public data, change the path here.
    return `artifacts/${appId}/users/${userId}/${collectionName}`;
}

// Loads products from Firestore.
async function loadProductsFromFirestore() {
    console.log("Loading products from Firestore...");
    try {
        const productsColRef = collection(db, getCollectionPath('products'));
        const productsSnapshot = await getDocs(productsColRef);
        products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // If no products found, add default products
        if (products.length === 0) {
            console.log("No products found in Firestore. Adding default products...");
            const defaultProducts = [
                { id: 'prod001', name: "Kopi Hitam", price: 15000, cost: 10000, stock: 100 },
                { id: 'prod002', name: "Kopi Susu", price: 18000, cost: 12000, stock: 80 },
                { id: 'prod003', name: "Teh Manis", price: 10000, cost: 6000, stock: 150 },
                { id: 'prod004', name: "Es Jeruk", price: 12000, cost: 7000, stock: 90 },
                { id: 'prod005', name: "Roti Bakar Keju", price: 25000, cost: 18000, stock: 50 },
                { id: 'prod006', name: "Mie Ayam", price: 22000, cost: 15000, stock: 70 },
                { id: 'prod007', name: "Nasi Goreng", price: 28000, cost: 20000, stock: 60 },
                { id: 'prod008', name: "Air Mineral", price: 5000, cost: 2000, stock: 200 },
            ];
            for (const product of defaultProducts) {
                await setDoc(doc(db, getCollectionPath('products'), product.id), product);
            }
            products = defaultProducts; // Update local array with default products
            console.log("Default products added to Firestore and loaded.");
        }
        console.log("Products loaded:", products);
    } catch (e) {
        console.error("Error loading products from Firestore:", e);
        displayStatus("Error: Gagal memuat produk dari database.", "error");
        products = []; // Fallback to empty if Firestore fails
    }
}

// Saves (updates or creates) a product document in Firestore.
async function saveProductToFirestore(product) {
    try {
        await setDoc(doc(db, getCollectionPath('products'), product.id), product);
        console.log("Product saved to Firestore:", product.id);
    } catch (e) {
        console.error("Error saving product to Firestore:", e);
        displayStatus("Error: Gagal menyimpan produk ke database.", "error");
    }
}

// Adds a new product to Firestore.
async function addProductToFirestore(product) {
    try {
        // Use the provided product.id as the document ID
        await setDoc(doc(db, getCollectionPath('products'), product.id), product);
        console.log("New product added to Firestore:", product.id);
    } catch (e) {
        console.error("Error adding new product to Firestore:", e);
        displayStatus("Error: Gagal menambah produk baru ke database.", "error");
    }
}

// Deletes a product document from Firestore.
async function deleteProductFromFirestore(productId) {
    try {
        await deleteDoc(doc(db, getCollectionPath('products'), productId));
        console.log("Product deleted from Firestore:", productId);
    } catch (e) {
        console.error("Error deleting product from Firestore:", e);
        displayStatus("Error: Gagal menghapus produk dari database.", "error");
    }
}

// Loads transaction history from Firestore.
async function loadTransactionsFromFirestore() {
    console.log("Loading transactions from Firestore...");
    try {
        const transactionsColRef = collection(db, getCollectionPath('transactions'));
        const transactionsSnapshot = await getDocs(transactionsColRef);
        transactionHistory = transactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Ensure items array is parsed if it was stringified (e.g., if coming from export/import)
        transactionHistory.forEach(t => {
            if (typeof t.items === 'string') {
                t.items = JSON.parse(t.items);
            }
        });
        console.log("Transactions loaded:", transactionHistory);
    } catch (e) {
        console.error("Error loading transactions from Firestore:", e);
        displayStatus("Error: Gagal memuat riwayat transaksi dari database.", "error");
        transactionHistory = [];
    }
}

// Adds a new transaction to Firestore.
async function addTransactionToFirestore(transactionRecord) {
    try {
        // Use the transactionRecord.id as the document ID
        await setDoc(doc(db, getCollectionPath('transactions'), transactionRecord.id), transactionRecord);
        console.log("Transaction added to Firestore:", transactionRecord.id);
    } catch (e) {
        console.error("Error adding transaction to Firestore:", e);
        displayStatus("Error: Gagal menyimpan transaksi ke database.", "error");
    }
}

// Deletes a transaction from Firestore.
async function deleteTransactionFromFirestore(transactionId) {
    try {
        await deleteDoc(doc(db, getCollectionPath('transactions'), transactionId));
        console.log("Transaction deleted from Firestore:", transactionId);
    } catch (e) {
        console.error("Error deleting transaction from Firestore:", e);
        displayStatus("Error: Gagal menghapus transaksi dari database.", "error");
    }
}


// Loads expenses from Firestore.
async function loadExpensesFromFirestore() {
    console.log("Loading expenses from Firestore...");
    try {
        const expensesColRef = collection(db, getCollectionPath('expenses'));
        const expensesSnapshot = await getDocs(expensesColRef);
        expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Expenses loaded:", expenses);
    } catch (e) {
        console.error("Error loading expenses from Firestore:", e);
        displayStatus("Error: Gagal memuat pengeluaran dari database.", "error");
        expenses = [];
    }
}

// Adds a new expense to Firestore.
async function addExpenseToFirestore(expense) {
    try {
        // Firestore will auto-generate an ID, or you can use expense.id if it's unique
        await setDoc(doc(db, getCollectionPath('expenses'), expense.id), expense);
        console.log("Expense added to Firestore:", expense.id);
    } catch (e) {
        console.error("Error adding expense to Firestore:", e);
        displayStatus("Error: Gagal menambah pengeluaran ke database.", "error");
    }
}

// Deletes an expense from Firestore.
async function deleteExpenseFromFirestore(expenseId) {
    try {
        await deleteDoc(doc(db, getCollectionPath('expenses'), expenseId));
        console.log("Expense deleted from Firestore:", expenseId);
    } catch (e) {
        console.error("Error deleting expense from Firestore:", e);
        displayStatus("Error: Gagal menghapus pengeluaran dari database.", "error");
    }
}

// Loads users from Firestore.
async function loadUsersFromFirestore() {
    console.log("Loading users from Firestore...");
    try {
        const usersColRef = collection(db, getCollectionPath('users'));
        const usersSnapshot = await getDocs(usersColRef);
        users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // If no users found, add default admin user
        if (users.length === 0) {
            console.log("No users found in Firestore. Adding default admin user...");
            const defaultAdmin = { username: 'admin', password: 'admin', role: 'admin' };
            await setDoc(doc(db, getCollectionPath('users'), defaultAdmin.username), defaultAdmin); // Use username as ID
            users = [defaultAdmin]; // Update local array with default admin
            console.log("Default admin user added to Firestore and loaded.");
        }
        console.log("Users loaded:", users);

        // Load loggedInUser (should still be handled by session for temporary login)
        const storedLoggedInUser = sessionStorage.getItem('pos_logged_in_user_session');
        loggedInUser = storedLoggedInUser ? JSON.parse(storedLoggedInUser) : null;

    } catch (e) {
        console.error("Error loading users from Firestore:", e);
        displayStatus("Error: Gagal memuat pengguna dari database.", "error");
        users = [{ username: 'admin', password: 'admin', role: 'admin' }]; // Fallback to default admin
        loggedInUser = null;
    }
}

// Saves (updates or creates) a user document in Firestore.
async function saveUserToFirestore(user) {
    try {
        await setDoc(doc(db, getCollectionPath('users'), user.username), user); // Use username as ID
        console.log("User saved to Firestore:", user.username);
    } catch (e) {
        console.error("Error saving user to Firestore:", e);
        displayStatus("Error: Gagal menyimpan pengguna ke database.", "error");
    }
}

// Deletes a user document from Firestore.
async function deleteUserFromFirestore(username) {
    try {
        await deleteDoc(doc(db, getCollectionPath('users'), username));
        console.log("User deleted from Firestore:", username);
    } catch (e) {
        console.error("Error deleting user from Firestore:", e);
        displayStatus("Error: Gagal menghapus pengguna dari database.", "error");
    }
}

// Loads application settings from Firestore (daily revenue, dark mode, etc.).
async function loadAppSettingsFromFirestore() {
    console.log("Loading app settings from Firestore...");
    try {
        const settingsDocRef = doc(db, getCollectionPath('settings'), 'appSettings');
        const settingsDoc = await getDoc(settingsDocRef);

        if (settingsDoc.exists()) {
            const settings = settingsDoc.data();
            dailyRevenue = settings.dailyRevenue || 0;
            lastRecordedDate = settings.lastRecordedDate || '';
            isRevenueVisible = typeof settings.isRevenueVisible !== 'undefined' ? settings.isRevenueVisible : true;
            isDarkMode = typeof settings.isDarkMode !== 'undefined' ? settings.isDarkMode : false;
            monthlyNetProfit = settings.monthlyNetProfit || 0;
            monthlyExpenses = settings.monthlyExpenses || 0;
            lastRecordedMonth = settings.lastRecordedMonth || '';
            // Load printer ID from settings, not local storage
            const storedPrinterId = settings.lastConnectedPrinterId || null;
            if (storedPrinterId) {
                // For now, we put it back in local storage for the printer reconnect logic.
                // In a full Firebase app, printer ID might also be stored per user or globally.
                localStorage.setItem('pos_bluetooth_printer_id', storedPrinterId);
            } else {
                localStorage.removeItem('pos_bluetooth_printer_id');
            }

            console.log("App settings loaded:", settings);
        } else {
            console.log("No app settings found in Firestore. Using default values.");
            // Set initial defaults and save them
            dailyRevenue = 0;
            lastRecordedDate = '';
            isRevenueVisible = true;
            isDarkMode = false;
            monthlyNetProfit = 0;
            monthlyExpenses = 0;
            lastRecordedMonth = '';
            // No printer ID saved by default

            await saveAppSettingsToFirestore(); // Save initial settings to Firestore
        }
    } catch (e) {
        console.error("Error loading app settings from Firestore:", e);
        displayStatus("Error: Gagal memuat pengaturan aplikasi dari database.", "error");
        // Fallback to defaults on error
        dailyRevenue = 0;
        lastRecordedDate = '';
        isRevenueVisible = true;
        isDarkMode = false;
        monthlyNetProfit = 0;
        monthlyExpenses = 0;
        lastRecordedMonth = '';
        localStorage.removeItem('pos_bluetooth_printer_id');
    }
}

// Saves application settings to Firestore.
async function saveAppSettingsToFirestore() {
    console.log("Saving app settings to Firestore...");
    try {
        const settingsDocRef = doc(db, getCollectionPath('settings'), 'appSettings');
        const settings = {
            dailyRevenue: dailyRevenue,
            lastRecordedDate: lastRecordedDate,
            isRevenueVisible: isRevenueVisible,
            isDarkMode: isDarkMode,
            monthlyNetProfit: monthlyNetProfit,
            monthlyExpenses: monthlyExpenses,
            lastRecordedMonth: lastRecordedMonth,
            // Save printer ID from localStorage (where it's temporarily stored) to settings
            lastConnectedPrinterId: localStorage.getItem('pos_bluetooth_printer_id') || null
        };
        await setDoc(settingsDocRef, settings);
        console.log("App settings saved.");
    } catch (e) {
        console.error("Error saving app settings to Firestore:", e);
        displayStatus("Error: Gagal menyimpan pengaturan aplikasi ke database.", "error");
    }
}

// --- Old Local Storage Functions (Removed or Modified) ---
// These functions are now replaced by their Firestore counterparts.
// Keeping them commented out for reference during migration.

/*
function loadProducts() { ... }
function saveProducts() { ... }
function loadTransactionHistory() { ... }
function saveTransactionHistory() { ... }
function loadExpenses() { ... }
function saveExpenses() { ... }
function loadUsers() { ... } // Replaced by loadUsersFromFirestore
function saveUsers() { ... } // Replaced by saveUserToFirestore/addUserToFirestore
function loadDailyRevenue() { ... } // Replaced by loadAppSettingsFromFirestore
function saveDailyRevenue() { ... } // Replaced by saveAppSettingsToFirestore
function loadRevenueVisibility() { ... } // Replaced by loadAppSettingsFromFirestore
function saveRevenueVisibility() { ... } // Replaced by saveAppSettingsToFirestore
function loadDarkModeState() { ... } // Replaced by loadAppSettingsFromFirestore
function saveDarkModeState() { ... } // Replaced by saveAppSettingsToFirestore
function loadMonthlyFinancialData() { ... } // Replaced by loadAppSettingsFromFirestore
function saveMonthlyFinancialData() { ... } // Replaced by saveAppSettingsToFirestore
*/

// --- General Utility Functions ---
// Displays a status message to the user.
function displayStatus(message, type, element = statusElement) { // Added optional element parameter
    if (!element) return;
    element.textContent = message;
    // Using Tailwind classes dynamically based on theme for status messages
    let bgColorClass, textColorClass;
    if (isDarkMode) {
        bgColorClass = type === 'success' ? 'bg-green-700' :
                       type === 'error' ? 'bg-red-700' :
                       'bg-blue-700'; // Default for info/loading
        textColorClass = type === 'success' ? 'text-green-200' :
                         type === 'error' ? 'text-red-200' :
                         'text-blue-200'; // Default for info/loading
    } else {
        bgColorClass = type === 'success' ? 'bg-green-100' :
                       type === 'error' ? 'bg-red-100' :
                       'bg-blue-100'; // Default for info/loading
        textColorClass = type === 'success' ? 'text-green-800' :
                         type === 'error' ? 'text-red-700' :
                         'text-blue-800'; // Default for info/loading
    }
    element.className = `mt-4 p-3 text-center rounded-md text-sm ${bgColorClass} ${textColorClass}`;
    element.classList.remove('hidden'); // Ensure message box is visible
}

// Updates the daily revenue display in the header based on visibility.
function updateHeaderDailyRevenue() {
    if (headerDailyRevenue) {
        headerDailyRevenue.textContent = dailyRevenue.toLocaleString('id-ID');
    }
    // Update visibility of the container and toggle icons
    if (headerDailyRevenueAmountContainer) {
        headerDailyRevenueAmountContainer.style.visibility = isRevenueVisible ? 'visible' : 'hidden';
    }
    if (eyeIcon && eyeSlashIcon) {
        eyeIcon.classList.toggle('hidden', !isRevenueVisible);
        eyeSlashIcon.classList.toggle('hidden', isRevenueVisible);
    }
}

// Checks if the date has changed and resets daily revenue if so.
// Also checks if the month has changed and resets monthly financial data.
async function checkAndResetDailyRevenue() { // Made async
    const today = new Date().toISOString().slice(0, 10); //YYYY-MM-DD
    const thisMonth = new Date().toISOString().slice(0, 7); //YYYY-MM

    if (lastRecordedDate !== today) {
        console.log(`Date changed from ${lastRecordedDate} to ${today}. Resetting daily revenue.`);
        dailyRevenue = 0;
        lastRecordedDate = today;
        await saveAppSettingsToFirestore(); // Save the reset revenue and new date
        displayStatus("Pendapatan harian direset untuk hari baru.", "info");
    }
    updateHeaderDailyRevenue(); // Always update header with current daily revenue

    if (lastRecordedMonth !== thisMonth) {
        console.log(`Month changed from ${lastRecordedMonth} to ${thisMonth}. Resetting monthly financial data.`);
        monthlyNetProfit = 0;
        monthlyExpenses = 0;
        lastRecordedMonth = thisMonth;
        await saveAppSettingsToFirestore(); // Save the reset monthly data and new month
    }
    renderMonthlyFinancialBar(); // Always update the monthly bar
}

// New: Renders the monthly financial profit/expense bar in the header.
function renderMonthlyFinancialBar() {
    if (!monthlyProfitBar || !monthlyExpenseBar || !monthlyFinancialBarContainer) return;

    const total = monthlyNetProfit + monthlyExpenses; // Use the sum of profit and expenses as the base
    let profitWidth = 0;
    let expenseWidth = 0;

    if (total > 0) {
        // If profit is higher, scale profit to 100% and expenses relative to profit
        if (monthlyNetProfit >= monthlyExpenses) {
            profitWidth = 100;
            expenseWidth = (monthlyExpenses / monthlyNetProfit) * 100;
        } else { // If expenses are higher, scale expenses to 100% and profit relative to expenses
            expenseWidth = 100;
            profitWidth = (monthlyNetProfit / monthlyExpenses) * 100;
        }
    }

    // Adjust to ensure they always add up to 100% of the bar, proportionally
    // If both are 0, both widths should be 0.
    if (monthlyNetProfit === 0 && monthlyExpenses === 0) {
        profitWidth = 0;
        expenseWidth = 0;
    } else if (monthlyNetProfit > 0 && monthlyExpenses === 0) {
        profitWidth = 100;
        expenseWidth = 0;
    } else if (monthlyNetProfit === 0 && monthlyExpenses > 0) {
        profitWidth = 0;
        expenseWidth = 100;
    } else {
        const combinedTotal = monthlyNetProfit + monthlyExpenses;
        profitWidth = (monthlyNetProfit / combinedTotal) * 100;
        expenseWidth = (monthlyExpenses / combinedTotal) * 100;
    }


    monthlyProfitBar.style.width = `${profitWidth}%`;
    monthlyExpenseBar.style.width = `${expenseWidth}%`;

    // Apply rounded corners based on which side is present
    monthlyProfitBar.classList.remove('rounded-l-full', 'rounded-r-full');
    monthlyExpenseBar.classList.remove('rounded-l-full', 'rounded-r-full');

    if (profitWidth > 0 && expenseWidth > 0) {
        monthlyProfitBar.classList.add('rounded-l-full');
        monthlyExpenseBar.classList.add('rounded-r-full');
    } else if (profitWidth > 0) {
        monthlyProfitBar.classList.add('rounded-full');
    } else if (expenseWidth > 0) {
        monthlyExpenseBar.classList.add('rounded-full');
    }

    // Set the container background if both are zero
    if (profitWidth === 0 && expenseWidth === 0) {
        monthlyFinancialBarContainer.style.backgroundColor = '#ccc'; // Default gray
    } else {
        monthlyFinancialBarContainer.style.backgroundColor = 'transparent'; // Transparent if bars are visible
    }
}

// Function to copy text to clipboard
function copyTextToClipboard(text, successMessageElement) {
    if (!navigator.clipboard) {
        // Fallback for older browsers or if clipboard API is not available (e.g., in some iframes)
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";  // Avoid scrolling to bottom
        textArea.style.opacity = "0";       // Hide
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            displayStatus("Berhasil disalin!", "success", successMessageElement);
        } catch (err) {
            console.error('Gagal menyalin: ', err);
            displayStatus("Gagal menyalin teks.", "error", successMessageElement);
        }
        document.body.removeChild(textArea);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        displayStatus("Berhasil disalin!", "success", successMessageElement);
    }).catch(function(err) {
        console.error('Gagal menyalin: ', err);
        displayStatus("Gagal menyalin teks.", "error", successMessageElement);
    });
}

// New: Function to play coin sound
function playCoinSound() {
    if (coinSoundAudio) {
        coinSoundAudio.play().catch(e => console.error("Error playing sound:", e));
    }
}


// --- Core Application Logic ---

// Adds a product to the transaction list.
function addProductToTransaction(id, name, price, qty, isCustom = false) {
    // For custom products, we give them a unique ID. Registered products use their original ID.
    const finalId = isCustom ? 'custom-' + Date.now() : id;

    // Check if product already exists in the cart (only for registered products)
    // Custom products are always added as new lines, even if they have the same name/price.
    const existingItemIndex = currentTransactionItems.findIndex(item => item.productId === finalId && !isCustom);

    // Find the product in the global products array to get its cost and current stock
    // For custom products, productData will be undefined as they don't exist in the 'products' array.
    const productData = products.find(p => p.id === id);

    // Check stock for registered products before adding/updating quantity
    if (!isCustom && productData && productData.stock !== undefined) {
        const currentQtyInCart = existingItemIndex > -1 ? currentTransactionItems[existingItemIndex].qty : 0;
        const newTotalQty = currentQtyInCart + qty;

        if (productData.stock < newTotalQty) {
            displayStatus(`Error: Stok ${productData.name} tidak cukup. Stok tersedia: ${productData.stock}`, "error");
            return;
        }
    }

    if (existingItemIndex > -1) {
        // If it's a registered product and already in the list, just update quantity
        currentTransactionItems[existingItemIndex].qty += qty;
    } else {
        // Add new product to list
        currentTransactionItems.push({
            productId: finalId,
            name: name,
            qty: qty,
            price: price,
            // Store cost for financial report
            // For registered products: use actual cost
            // For custom products: calculate cost as 80% of price (20% margin)
            cost: isCustom ? (price * 0.8) : (productData?.cost || 0),
            isCustom: isCustom // Add a flag to identify custom products
        });
    }
    renderTransactionItems();
}

// Renders items in the transaction list and updates totals.
function renderTransactionItems() {
    if (!itemList || !noItemsMessage || !totalAmountInput) return; // Ensure elements exist

    itemList.innerHTML = ''; // Clear existing items
    let subtotal = 0; // Changed from total to subtotal

    if (currentTransactionItems.length === 0) {
        noItemsMessage.classList.remove('hidden'); // Show "No items" message
        itemList.appendChild(noItemsMessage); // Ensure it's in the list
    } else {
        noItemsMessage.classList.add('hidden'); // Hide "No items" message
        currentTransactionItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            // Adjust classes for dark mode dynamically
            const itemBgClass = isDarkMode ? 'bg-gray-700' : 'bg-white';
            const itemBorderClass = isDarkMode ? 'border-gray-600' : 'border-gray-200';
            const itemTextClass = isDarkMode ? 'text-gray-200' : 'text-gray-800';
            const itemQtyInputBg = isDarkMode ? 'bg-gray-600' : 'bg-white';
            const itemQtyInputBorder = isDarkMode ? 'border-gray-500' : 'border-gray-300';
            const itemQtyInputText = isDarkMode ? 'text-gray-200' : 'text-gray-900';
            const itemPriceText = isDarkMode ? 'text-gray-300' : 'text-gray-700';
            const itemTotalText = isDarkMode ? 'text-gray-100' : 'text-gray-900';


            itemDiv.className = `flex flex-col sm:flex-row items-center gap-2 mb-3 p-3 rounded-md shadow-sm border ${itemBgClass} ${itemBorderClass}`;
            itemDiv.innerHTML = `
                <span class="flex-1 font-medium ${itemTextClass}">${item.name}</span>
                <input type="number" value="${item.qty}" data-item-index="${index}" class="item-qty-input px-2 py-1 border rounded-md text-center focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${itemQtyInputBg} ${itemQtyInputBorder} ${itemQtyInputText}">
                <span class="font-semibold w-24 text-right ${itemPriceText}">Rp ${item.price.toLocaleString('id-ID')}</span>
                <span class="font-bold w-28 text-right ${itemTotalText}">Rp ${(item.qty * item.price).toLocaleString('id-ID')}</span>
                <button class="removeItem bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md shadow-sm transition duration-300 ease-in-out text-sm" data-item-index="${index}">Hapus</button>
            `;
            itemList.appendChild(itemDiv);
            subtotal += item.qty * item.price;
        });
    }

    // Apply discount to the total displayed
    const discount = parseFloat(discountAmountInput.value) || 0;
    const finalTotal = subtotal - discount;
    totalAmountInput.value = `Rp ${finalTotal.toLocaleString('id-ID')}`; // Update to show final total after discount
    calculateChange();
    updateHeaderDateTime(); // Update date/time on item render or init
    updateCashierDisplay();
}

// Calculates and displays the change.
function calculateChange() {
    if (!totalAmountInput || !paymentAmountInput || !changeAmountHeader) return; // Ensure elements exist
    const total = parseFloat(totalAmountInput.value.replace(/[^0-9,-]+/g, "").replace(",", ".")) || 0; // Clean 'Rp' and commas
    const payment = parseFloat(paymentAmountInput.value) || 0;
    const change = payment - total;

    // Update the change amount in the header
    changeAmountHeader.textContent = `Rp ${(change > 0 ? change : 0).toLocaleString('id-ID')}`;
}

// Updates the current date and time display in the header.
function updateHeaderDateTime() {
    if (!headerDateTime) return; // Ensure element exists
    const now = new Date();
    const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false // Use 24-hour format
    };
    headerDateTime.textContent = now.toLocaleDateString('id-ID', options);
}

// Updates cashier display in header and controls admin menu visibility.
function updateCashierDisplay() {
    if (!cashierDisplay || !cashierRole || !adminMenuButton) return; // Ensure elements exist
    if (loggedInUser) {
        cashierDisplay.textContent = loggedInUser.username;
        cashierRole.textContent = loggedInUser.role;
        // Show admin menu only if logged in user is admin
        if (loggedInUser.role === 'admin') {
            adminMenuButton.classList.remove('hidden');
        } else {
            adminMenuButton.classList.add('hidden');
            adminMenuDropdown.classList.add('hidden'); // Ensure dropdown is hidden for non-admins
        }
    } else {
        cashierDisplay.textContent = 'Tidak Login';
        cashierRole.textContent = '';
        adminMenuButton.classList.add('hidden'); // Hide admin menu if not logged in
        adminMenuDropdown.classList.add('hidden'); // Ensure dropdown is hidden
    }
}

// Resets the transaction for a new one.
function startNewTransaction() {
    currentTransactionItems = [];
    // Ensure payment and change inputs are reset BEFORE rendering items
    if (paymentAmountInput) paymentAmountInput.value = '0';
    if (discountAmountInput) discountAmountInput.value = '0'; // Reset discount
    if (changeAmountHeader) changeAmountHeader.textContent = 'Rp 0'; // Explicitly set to 0
    if (paymentMethodSelect) paymentMethodSelect.value = "Tunai"; // Reset payment method

    renderTransactionItems(); // This will now calculate change based on the reset payment input and empty cart.

    if (document.getElementById('transactionNumber')) document.getElementById('transactionNumber').value = 'TRX-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    displayStatus("", ""); // Clear status
    updateHeaderDateTime();
    updateCashierDisplay();
    updateHeaderDailyRevenue(); // Update daily revenue display on new transaction start
    renderMonthlyFinancialBar(); // Update monthly financial bar
    // Clear registered product inputs
    if (productCodeInput) productCodeInput.value = '';
    if (productNameInput) productNameInput.value = '';
    if (priceInput) priceInput.value = '0';
    if (quantityInput) quantityInput.value = '1';

    // Clear custom product inputs
    if (customProductCodeInput) customProductCodeInput.value = '';
    if (customProductNameInput) customProductNameInput.value = '';
    if (customProductPriceInput) customProductPriceInput.value = '0';
    if (customProductQtyInput) customProductQtyInput.value = '1';

    // Set default view to Registered Products
    showSection('registered');
}

// Function to toggle sections (Registered/Custom Products).
function showSection(mode) {
    currentTransactionMode = mode;
    if (mode === 'registered') {
        registeredProductSection.classList.remove('hidden');
        customProductSection.classList.add('hidden');
        showRegisteredProductsButton.classList.add('bg-green-500', 'hover:bg-green-600');
        showRegisteredProductsButton.classList.remove('bg-gray-400', 'hover:bg-gray-500');
        showCustomProductsButton.classList.add('bg-gray-400', 'hover:bg-gray-500');
        showCustomProductsButton.classList.remove('bg-green-500', 'hover:bg-green-600');
    } else { // mode === 'custom'
        registeredProductSection.classList.add('hidden');
        customProductSection.classList.remove('hidden');
        showRegisteredProductsButton.classList.add('bg-gray-400', 'hover:bg-gray-500');
        showRegisteredProductsButton.classList.remove('bg-green-500', 'hover:bg-green-600');
        showCustomProductsButton.classList.add('bg-green-500', 'hover:bg-green-600');
        showCustomProductsButton.classList.remove('bg-green-500', 'hover:bg-green-600');
    }
}

// NEW: Function to prepare transaction object and decrement stock
async function createTransactionObjectAndDecrementStock() { // Made async
    const total = parseFloat(totalAmountInput.value.replace(/[^0-9,-]+/g, "").replace(",", ".")) || 0; // Final total after discount
    const payment = parseFloat(paymentAmountInput.value) || 0;
    const discount = parseFloat(discountAmountInput.value) || 0; // Get current discount value
    const paymentMethod = paymentMethodSelect.value; // Get selected payment method

    if (payment < total) {
        displayStatus("Error: Jumlah pembayaran kurang dari total!", "error");
        return null;
    }

    if (currentTransactionItems.length === 0) {
        displayStatus("Error: Tambahkan setidaknya satu item untuk memproses transaksi!", "error");
        return null;
    }

    // Calculate profit for the current transaction
    let transactionGrossProfit = 0;
    currentTransactionItems.forEach(item => {
        const itemTotal = item.qty * item.price;
        const itemCost = item.qty * item.cost;
        transactionGrossProfit += (itemTotal - itemCost);
    });
    const transactionNetProfit = transactionGrossProfit - discount; // Simple net profit for the transaction

    // Decrement stock for all products (registered only)
    for (const item of currentTransactionItems) {
        if (!item.productId.startsWith('custom-')) {
            const product = products.find(p => p.id === item.productId);
            if (product && product.stock !== undefined) {
                product.stock -= item.qty;
                if (product.stock < 0) product.stock = 0; // Prevent negative stock
                await saveProductToFirestore(product); // Save updated stock to Firestore
            }
        }
    }

    const transactionRecord = {
        id: 'TRX-' + Date.now(), // Unique transaction ID
        date: new Date().toISOString(),
        items: currentTransactionItems.map(item => ({...item})), // Deep copy items
        subtotalAmount: currentTransactionItems.reduce((sum, item) => sum + (item.qty * item.price), 0),
        discountAmount: discount,
        totalAmount: total,
        paymentAmount: payment,
        changeAmount: payment - total,
        cashier: loggedInUser ? loggedInUser.username : 'Unknown',
        transactionNetProfit: transactionNetProfit,
        paymentMethod: paymentMethod // Store payment method
    };

    return transactionRecord;
}

// NEW: Function to revert stock decrement (if print fails or transaction not committed)
async function revertStockDecrement(items) { // Made async
    for (const item of items) {
        if (!item.productId.startsWith('custom-')) {
            const product = products.find(p => p.id === item.productId);
            if (product && product.stock !== undefined) {
                product.stock += item.qty; // Add back the original quantity
                await saveProductToFirestore(product); // Save reverted stock to Firestore
            }
        }
    }
    console.log("Stock reverted due to transaction not committed.");
}

// NEW: Function to commit transaction data (add to history, update revenue)
async function commitTransactionData(transactionRecord) { // Made async
    await addTransactionToFirestore(transactionRecord); // Add to Firestore

    dailyRevenue += transactionRecord.totalAmount;
    monthlyNetProfit += transactionRecord.transactionNetProfit;
    await saveAppSettingsToFirestore(); // Save updated daily and monthly financials to Firestore

    updateHeaderDailyRevenue(); // Update the header display
    renderMonthlyFinancialBar(); // Update the monthly bar

    displayStatus("Transaksi berhasil diproses!", "success");
    playCoinSound(); // Play coin sound on successful transaction
    startNewTransaction(); // Clear and start new transaction
}

// NEW: Function to generate and send receipt content to printer
async function printReceiptContent(transactionRecord) {
    if (!bluetoothPrinterDevice || !printerCharacteristic) {
        displayStatus("Printer belum terhubung. Silakan hubungkan printer melalui Pengaturan Printer.", "error");
        printerSettingsModal.classList.remove('hidden');
        return false; // Indicate print failure
    }

    displayStatus("Mengirim struk ke printer...", "info");

    const companyName = "UNIX FASHION";
    const companyAddress = "cilebut-bogor";
    const companyPhone = "0851-7210-7731";

    // Use the provided transactionRecord for printing
    const transactionNumber = transactionRecord.id;
    const cashier = transactionRecord.cashier;
    const paymentMethod = transactionRecord.paymentMethod; // Use actual payment method

    const total = transactionRecord.totalAmount;
    const payment = transactionRecord.paymentAmount;
    const change = transactionRecord.changeAmount;
    const discount = transactionRecord.discountAmount;
    const subtotalBeforeDiscount = transactionRecord.subtotalAmount;

    const now = new Date(transactionRecord.date); // Use transaction date for receipt
    const dateTimeFormatted = now.toLocaleString('id-ID', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });

    try {
        const encoder = new TextEncoder();
        let printText = "";

        // Header
        printText += centerText(companyName.toUpperCase()) + "\n";
        printText += centerText(companyAddress) + "\n";
        printText += centerText(companyPhone) + "\n";
        printText += "\n"; // Line break

        // Transaction Info
        printText += `No.Transaksi: ${transactionNumber}\n`;
        printText += `Kasir: ${cashier}\n`;
        printText += `Waktu: ${dateTimeFormatted}\n`;
        printText += "--------------------------------\n"; // Separator

        // Items
        for (let item of transactionRecord.items) {
            if (item.name && item.qty > 0) {
                printText += `${item.name}\n`;
                const itemSubtotal = item.qty * item.price;
                printText += `  ${item.qty} pcs x ${item.price.toLocaleString('id-ID')}    Rp ${itemSubtotal.toLocaleString('id-ID')}\n`;
            }
        }
        printText += "--------------------------------\n"; // Separator

        // Totals and Payment
        printText += `Subtotal :     Rp ${subtotalBeforeDiscount.toLocaleString('id-ID')}\n`;
        if (discount > 0) {
            printText += `Diskon   :     Rp ${discount.toLocaleString('id-ID')}\n`;
        }
        printText += `Total    :     Rp ${total.toLocaleString('id-ID')}\n`;
        printText += `Bayar    :     Rp ${payment.toLocaleString('id-ID')}\n`;
        printText += `Kembali  :     Rp ${change.toLocaleString('id-ID')}\n`;
        printText += `Metode   :     ${paymentMethod}\n`; // Include payment method
        printText += "\n"; // Line break

        // Footer
        printText += centerText("Terimakasih sudah berbelanja") + "\n";
        printText += centerText("UNIX FASHION") + "\n";
        printText += "\n\n\n"; // Extra line breaks for cutting

        await printerCharacteristic.writeValue(encoder.encode(printText));
        displayStatus("Struk berhasil dicetak!", "success");
        return true; // Indicate print success

    } catch (error) {
        displayStatus(`Error saat mencetak: ${error.message}.`, "error");
        console.error("Printing error:", error);
        return false; // Indicate print failure
    }
}

// Function to handle printing a NEW receipt (processes transaction, decrements stock, then prints)
async function processAndPrintTransaction() {
    const transactionRecord = await createTransactionObjectAndDecrementStock(); // Validate and decrement stock
    if (!transactionRecord) {
        return; // Validation failed, message already displayed by createTransactionObjectAndDecrementStock
    }

    const printSuccess = await printReceiptContent(transactionRecord);

    if (printSuccess) {
        await commitTransactionData(transactionRecord); // Commit ONLY if print was successful
    } else {
        await revertStockDecrement(transactionRecord.items); // Revert stock if printing fails
    }
}

// NEW: Function to handle reprinting an existing receipt from history (does not affect stock/history)
async function reprintTransactionReceipt(transactionId) {
    const transactionToReprint = transactionHistory.find(t => t.id === transactionId);
    if (!transactionToReprint) { // Corrected variable name from transactionToRepulated to transactionToReprint
        displayStatus("Error: Transaksi tidak ditemukan untuk dicetak ulang.", "error");
        return;
    }

    displayStatus("Mencetak ulang struk...", "info");
    await printReceiptContent(transactionToReprint);
}


// Helper function to center text for receipt printing
function centerText(text, width = 32) { // Assuming 32 characters per line for 58mm printer
    const padding = Math.max(0, width - text.length);
    const leftPadding = Math.floor(padding / 2);
    const rightPadding = padding - leftPadding;
    return " ".repeat(leftPadding) + text + " ".repeat(rightPadding);
}


// --- Store Products Functions ---

// Renders the list of products in the store products modal, with optional search filter.
function renderStoreProducts(searchTerm = '') {
    if (!storeProductsTableBody) return;
    storeProductsTableBody.innerHTML = ''; // Clear existing rows

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Filter products based on search term
    const filteredProducts = products.filter(product => {
        const productName = product.name ? product.name.toLowerCase() : '';
        const productId = product.id ? product.id.toLowerCase() : '';
        return productName.includes(lowerCaseSearchTerm) || productId.includes(lowerCaseSearchTerm);
    });

    if (filteredProducts.length === 0 && searchTerm) {
        const noResultsRow = document.createElement('tr');
        const textClass = isDarkMode ? 'text-gray-400' : 'text-gray-500';
        noResultsRow.innerHTML = `<td colspan="5" class="py-4 text-center ${textClass}">Tidak ada produk ditemukan untuk '${searchTerm}'</td>`;
        storeProductsTableBody.appendChild(noResultsRow);
        return;
    } else if (filteredProducts.length === 0 && !searchTerm) {
        const noProductsRow = document.createElement('tr');
        const textClass = isDarkMode ? 'text-gray-400' : 'text-gray-500';
        noProductsRow.innerHTML = `<td colspan="5" class="py-4 text-center ${textClass}">Tidak ada produk terdaftar.</td>`;
        storeProductsTableBody.appendChild(noProductsRow);
        return;
    }

    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
        const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
        const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-200';

        row.className = hoverClass;
        row.innerHTML = `
            <td class="py-2 px-4 border-b ${borderColor} ${textClass}">${product.id}</td>
            <td class="py-2 px-4 border-b ${borderColor} ${textClass}">${product.name}</td>
            <td class="py-2 px-4 border-b ${borderColor} text-right ${textClass}">Rp ${product.price.toLocaleString('id-ID')}</td>
            <td class="py-2 px-4 border-b ${borderColor} text-right ${textClass}">${product.stock !== undefined ? product.stock : 'N/A'}</td> <!-- Display stock -->
            <td class="py-2 px-4 border-b ${borderColor} text-center">
                <button class="edit-product-btn text-blue-500 hover:text-blue-700 mr-2" data-product-id="${product.id}" title="Edit Produk">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z" />
                    </svg>
                </button>
                <button class="delete-product-btn text-red-500 hover:text-red-700" data-product-id="${product.id}" title="Hapus Produk">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </td>
        `;
        storeProductsTableBody.appendChild(row);
    });
    // No saveProducts() here, changes are saved via saveProductEdit and deleteProduct
}

// Opens the edit form with product data.
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        editProductIdInput.value = product.id;
        editProductNameInput.value = product.name;
        editProductCostInput.value = product.cost !== undefined ? product.cost : 0; // Populate cost
        editProductPriceInput.value = product.price;
        editProductStockInput.value = product.stock !== undefined ? product.stock : 0; // Populate stock
        editProductForm.classList.remove('hidden'); // Show the form
        storeProductsTableContainer.classList.add('hidden'); // Hide the product list
        searchStoreProductsInput.classList.add('hidden'); // Hide search input
    } else {
        console.error("Produk tidak ditemukan untuk diedit:", productId);
    }
}

// Saves changes from the edit form.
async function saveProductEdit() { // Made async
    const id = editProductIdInput.value;
    const name = editProductNameInput.value.trim();
    const cost = parseFloat(editProductCostInput.value);
    const price = parseFloat(editProductPriceInput.value);
    const stock = parseInt(editProductStockInput.value);

    if (!name || isNaN(cost) || cost < 0 || isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
        displayStatus("Error: Nama produk, modal, harga, dan stok harus valid!", "error");
        return;
    }

    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex > -1) {
        products[productIndex].name = name;
        products[productIndex].cost = cost; // Save cost
        products[productIndex].price = price;
        products[productIndex].stock = stock; // Save stock
        await saveProductToFirestore(products[productIndex]); // Save changes to Firestore
        renderStoreProducts(searchStoreProductsInput.value); // Re-render the list with current search term
        editProductForm.classList.add('hidden'); // Hide the form
        storeProductsTableContainer.classList.remove('hidden'); // Show the product list
        searchStoreProductsInput.classList.remove('hidden'); // Show search input
        displayStatus("Produk berhasil diperbarui!", "success");
    } else {
        console.error("Produk tidak ditemukan saat menyimpan:", id);
    }
}

// Deletes a product from the list.
async function deleteProduct(productId) { // Made async
    const confirmed = await confirmAction("Apakah Anda yakin ingin menghapus produk ini?");
    if (confirmed) {
        await deleteProductFromFirestore(productId); // Delete from Firestore
        products = products.filter(p => p.id !== productId); // Update local array
        renderStoreProducts(searchStoreProductsInput.value); // Re-render the list with current search term
        displayStatus("Produk berhasil dihapus!", "success");
    }
}

// Custom confirmation modal function.
function confirmAction(message) {
    return new Promise(resolve => {
        confirmationMessage.textContent = message;
        confirmationModal.classList.remove('hidden');
        confirmPromiseResolve = resolve;
    });
}

// Closes the store products modal.
function closeStoreProductsModal() {
    storeProductsModal.classList.add('hidden');
    editProductForm.classList.add('hidden'); // Hide edit form when closing modal
    searchStoreProductsInput.value = ''; // Clear search input
    storeProductsTableContainer.classList.remove('hidden'); // Ensure product list is visible when modal is closed
    searchStoreProductsInput.classList.remove('hidden'); // Ensure search input is visible
    displayStatus("", ""); // Clear status message
}

// --- Add New Product Functions ---
// Calculates and updates the profit field.
function calculateProfit() {
    const cost = parseFloat(addProductCostInput.value) || 0;
    const price = parseFloat(addProductPriceInput.value) || 0;
    const profit = price - cost;
    addProductProfitInput.value = `Rp ${profit.toLocaleString('id-ID')}`;
    if (profit < 0) {
        addProductProfitInput.style.color = 'red';
    } else {
        addProductProfitInput.style.color = ''; // Reset to default
    }
}

// Adds a new product to the `products` array.
async function addNewProduct() { // Made async
    const id = addProductCodeInput.value.trim();
    const name = addProductNameInput.value.trim();
    const cost = parseFloat(addProductCostInput.value);
    const price = parseFloat(addProductPriceInput.value);
    const stock = parseInt(addProductStockInput.value); // Get stock value

    if (!id || !name || isNaN(cost) || cost < 0 || isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
        displayStatus("Error: Pastikan semua kolom wajib diisi dengan nilai yang valid!", "error");
        return;
    }

    // Check for duplicate product ID locally before attempting Firestore write
    if (products.some(p => p.id.toLowerCase() === id.toLowerCase())) {
        displayStatus("Error: Kode Barang sudah ada. Gunakan kode lain atau edit produk yang sudah ada.", "error");
        return;
    }

    const newProduct = { id: id, name: name, price: price, cost: cost, stock: stock };
    await addProductToFirestore(newProduct); // Add to Firestore
    products.push(newProduct); // Add to local array after successful Firestore write

    // Clear form
    addProductCodeInput.value = '';
    addProductNameInput.value = '';
    addProductCostInput.value = '0';
    addProductPriceInput.value = '0';
    addProductStockInput.value = '0'; // Clear stock input
    calculateProfit(); // Reset profit display

    closeAddProductModal(); // Close the modal
    displayStatus("Produk baru berhasil ditambahkan!", "success");
}

// Closes the add product modal.
function closeAddProductModal() {
    addProductModal.classList.add('hidden');
    displayStatus("", ""); // Clear status message
}

// --- Expenses Functions (New) ---
// Adds a new expense.
async function addExpense() { // Made async
    const date = expenseDateInput.value;
    const description = expenseDescriptionInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);

    if (!date || !description || isNaN(amount) || amount <= 0) {
        displayStatus("Error: Tanggal, deskripsi, dan jumlah pengeluaran harus valid!", "error", expenseStatusMessage);
        return;
    }

    const newExpense = { id: 'EXP-' + Date.now(), date: date, description: description, amount: amount };
    await addExpenseToFirestore(newExpense); // Add to Firestore
    expenses.push(newExpense); // Add to local array

    renderExpenses(); // Re-render with new expense
    displayStatus("Pengeluaran berhasil ditambahkan!", "success", expenseStatusMessage);
    // Update monthly expenses and save
    monthlyExpenses += amount;
    await saveAppSettingsToFirestore(); // Save updated monthly expenses to Firestore
    renderMonthlyFinancialBar(); // Update the monthly bar
    // Clear form
    expenseDateInput.value = new Date().toISOString().slice(0, 10);
    expenseDescriptionInput.value = '';
    expenseAmountInput.value = '0';
}

// Renders the list of expenses with search and date filters.
function renderExpenses() {
    if (!expensesListBody || !totalExpensesDisplayModal) return;
    expensesListBody.innerHTML = ''; // Clear existing rows

    const searchTerm = expenseSearchInput.value.toLowerCase();
    const startDateStr = expenseFilterStartDate.value;
    const endDateStr = expenseFilterEndDate.value;

    let filteredExpenses = expenses;

    // Apply search filter
    if (searchTerm) {
        filteredExpenses = filteredExpenses.filter(expense =>
            expense.description.toLowerCase().includes(searchTerm)
        );
    }

    // Apply date filter
    if (startDateStr && endDateStr) {
        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999);

        filteredExpenses = filteredExpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
        });
    } else if (startDateStr) {
        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0);
        filteredExpenses = filteredExpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate;
        });
    } else if (endDateStr) {
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999);
        filteredExpenses = filteredExpenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate <= endDate;
        });
    }

    let totalFilteredExpenses = 0;

    if (filteredExpenses.length === 0) {
        emptyExpensesMessage.classList.remove('hidden');
    } else {
        emptyExpensesMessage.classList.add('hidden');
        // Sort expenses by date, newest first
        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredExpenses.forEach(expense => {
            const row = document.createElement('tr');
            const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
            const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
            const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-200';
            // These head classes are for thead, not tbody rows, safe to remove
            // const headBgClass = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
            // const headTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-500';

            row.className = hoverClass;
            const expenseDate = new Date(expense.date).toLocaleDateString('id-ID');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${textClass} ${borderColor}">${expenseDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${textClass} ${borderColor}">${expense.description}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${textClass} text-right ${borderColor}">Rp ${expense.amount.toLocaleString('id-ID')}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${borderColor}">
                    <button class="delete-expense-btn text-red-600 hover:text-red-900" data-expense-id="${expense.id}" title="Hapus Pengeluaran">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </td>
            `;
            expensesListBody.appendChild(row);
            totalFilteredExpenses += expense.amount; // Accumulate total
        });
    }
    totalExpensesDisplayModal.textContent = `Rp ${totalFilteredExpenses.toLocaleString('id-ID')}`;
}

// Deletes an expense.
async function deleteExpense(expenseId) { // Made async
    const confirmed = await confirmAction("Apakah Anda yakin ingin menghapus pengeluaran ini?");
    if (confirmed) {
        const deletedExpense = expenses.find(e => e.id === expenseId);
        if (deletedExpense) {
            await deleteExpenseFromFirestore(expenseId); // Delete from Firestore
            expenses = expenses.filter(e => e.id !== expenseId); // Update local array
            renderExpenses(); // Re-render to update total and list

            // Update monthly expenses if the deleted expense was from the current month
            const thisMonth = new Date().toISOString().slice(0, 7);
            const expenseMonth = new Date(deletedExpense.date).toISOString().slice(0, 7);
            if (expenseMonth === thisMonth) {
                monthlyExpenses -= deletedExpense.amount;
                if (monthlyExpenses < 0) monthlyExpenses = 0;
                await saveAppSettingsToFirestore(); // Save updated monthly expenses to Firestore
                renderMonthlyFinancialBar(); // Update the monthly bar
            }
            displayStatus("Pengeluaran berhasil dihapus!", "success", expenseStatusMessage);
        } else {
            displayStatus("Error: Pengeluaran tidak ditemukan.", "error", expenseStatusMessage);
        }
    } else {
        displayStatus("Penghapusan pengeluaran dibatalkan.", "info", expenseStatusMessage);
    }
}

// Closes the expenses modal.
function closeExpensesModal() {
    expensesModal.classList.add('hidden');
    displayStatus("", "", expenseStatusMessage); // Clear status message inside modal
    displayStatus("", ""); // Clear main status message
    expenseSearchInput.value = ''; // Clear search input on close
    expenseFilterStartDate.value = ''; // Clear date filters on close
    expenseFilterEndDate.value = ''; // Clear date filters on close
}

// --- Financial Report Functions ---
function calculateFinancialReport() {
    const startDateStr = reportStartDateInput.value;
    const endDateStr = reportEndDateInput.value;
    let filteredTransactions = transactionHistory;
    let filteredExpenses = expenses; // Use new expenses array

    if (startDateStr && endDateStr) {
        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0); // Start of the day
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999); // End of the day

        filteredTransactions = transactionHistory.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
        filteredExpenses = expenses.filter(expense => { // Filter expenses by date
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
        });

    } else if (startDateStr) {
        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0);
        filteredTransactions = transactionHistory.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate;
        });
        filteredExpenses = expenses.filter(expense => { // Filter expenses by date
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate;
        });
    } else if (endDateStr) {
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999);
        filteredTransactions = transactionHistory.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate <= endDate;
        });
        filteredExpenses = expenses.filter(expense => { // Filter expenses by date
            const expenseDate = new Date(expense.date);
            return expenseDate <= endDate;
        });
    }

    let totalRevenue = 0;
    let totalCostOfGoodsSold = 0; // COGS
    let totalExpenses = 0;

    filteredTransactions.forEach(transaction => {
        totalRevenue += transaction.totalAmount; // This total is already after discount
        transaction.items.forEach(item => {
            // Calculate cost of goods sold based on product type
            // For registered products, cost is `item.cost` (from product's cost field)
            // For custom products, cost is 80% of `item.price` (as per 20% margin rule)
            if (item.isCustom) {
                totalCostOfGoodsSold += (item.price * 0.8) * item.qty;
            } else {
                totalCostOfGoodsSold += item.cost * item.qty;
            }
        });
    });

    // Calculate total expenses from the filtered list
    filteredExpenses.forEach(expense => {
        totalExpenses += expense.amount;
    });

    const grossProfit = totalRevenue - totalCostOfGoodsSold;
    const netProfit = grossProfit - totalExpenses; // Net profit now accounts for expenses

    totalRevenueDisplay.textContent = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
    totalExpensesDisplay.textContent = `Rp ${totalExpenses.toLocaleString('id-ID')}`;
    grossProfitDisplay.textContent = `Rp ${grossProfit.toLocaleString('id-ID')}`;
    netProfitDisplay.textContent = `Rp ${netProfit.toLocaleString('id-ID')}`;

    if (financialReportMessageBox) {
        if (filteredTransactions.length === 0 && filteredExpenses.length === 0) {
            financialReportMessageBox.classList.remove('hidden');
            financialReportMessageBox.textContent = "Tidak ada data transaksi atau pengeluaran untuk rentang tanggal yang dipilih.";
        } else {
            financialReportMessageBox.classList.add('hidden');
            financialReportMessageBox.textContent = '';
        }
    }

    // Prepare data for chart
    const chartData = [totalRevenue, totalExpenses, grossProfit, netProfit];
    renderFinancialReportChart(chartData);
}

// Renders the financial report chart using Chart.js.
function renderFinancialReportChart(data) {
    const ctx = financialChartCanvas.getContext('2d');
    if (window.myFinancialChart) {
        window.myFinancialChart.destroy();
    }

    // Define colors based on dark mode state
    const textColor = isDarkMode ? '#e2e8f0' : '#1a202c'; // Light text for dark mode, dark for light
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'; // Light grid for dark mode

    window.myFinancialChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pendapatan', 'Pengeluaran', 'Laba Kotor', 'Laba Bersih'],
            datasets: [{
                label: 'Jumlah (Rp)',
                data: data,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Ringkasan Keuangan',
                    color: textColor // Apply text color to title
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor // Apply text color to y-axis ticks
                    },
                    grid: {
                        color: gridColor // Apply grid color
                    }
                },
                x: {
                    ticks: {
                        color: textColor // Apply text color to x-axis ticks
                    },
                    grid: {
                        color: gridColor // Apply grid color
                    }
                }
            }
        }
    });
}

// --- Data Import/Export Functions ---
// Exports all products to a JSON file.
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pos_products_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    displayStatus("Data produk berhasil diekspor!", "success");
}

// Imports products from a JSON file.
async function importProducts(event) { // Made async
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const importedProducts = JSON.parse(e.target.result);
            if (!Array.isArray(importedProducts) || !importedProducts.every(p => p.id && p.name && typeof p.price === 'number')) {
                displayStatus("Error: Format file produk tidak valid.", "error");
                return;
            }

            const confirmed = await confirmAction("Ini akan menimpa data produk yang ada. Lanjutkan?");
            if (confirmed) {
                // Clear existing products in Firestore
                const productsColRef = collection(db, getCollectionPath('products'));
                const existingProductsSnapshot = await getDocs(productsColRef);
                for (const docSnapshot of existingProductsSnapshot.docs) {
                    await deleteDoc(docSnapshot.ref);
                }

                // Add imported products to Firestore
                for (const product of importedProducts) {
                    await addProductToFirestore(product);
                }
                products = importedProducts; // Update local array
                renderStoreProducts(); // Re-render store products after import
                displayStatus("Data produk berhasil diimpor!", "success");
            } else {
                displayStatus("Impor produk dibatalkan.", "info");
            }

        } catch (error) {
            displayStatus("Error memproses file produk: " + error.message + " Pastikan file JSON valid.", "error");
            console.error("Error importing products:", error);
        }
    };
    reader.readAsText(file);
}

// Exports all application data (products and transactions) to a JSON file.
function exportAllData() {
    const appData = {
        products: products,
        transactions: transactionHistory,
        expenses: expenses,
        users: users.map(u => ({ username: u.username, role: u.role })), // Exclude password for export
        dailyRevenue: dailyRevenue,
        lastRecordedDate: lastRecordedDate,
        isRevenueVisible: isRevenueVisible,
        isDarkMode: isDarkMode, // New: Include dark mode state in export
        monthlyNetProfit: monthlyNetProfit, // New: Include monthly net profit
        monthlyExpenses: monthlyExpenses,   // New: Include monthly expenses
        lastRecordedMonth: lastRecordedMonth, // New: Include last recorded month
        // Store the last connected printer's device ID
        lastConnectedPrinterId: localStorage.getItem('pos_bluetooth_printer_id') || null // Get from local storage (where it's temporarily stored)
    };
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pos_app_data_full_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    displayStatus("Data aplikasi lengkap berhasil diekspor!", "success");
}

// Imports all application data (products and transactions) from a JSON file.
async function importAllData(event) { // Made async
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            // expenses and users are optional as they're newer additions
            if (!importedData.products || !importedData.transactions) {
                displayStatus("Error: Format file data aplikasi tidak valid. Pastikan berisi 'products' dan 'transactions'.", "error");
                return;
            }

            const confirmed = await confirmAction("Ini akan menimpa SEMUA data aplikasi yang ada (produk, transaksi, pengeluaran, pengguna). Lanjutkan?");
            if (confirmed) {
                // Clear all existing data in Firestore for the current user
                const collectionsToClear = ['products', 'transactions', 'expenses', 'users', 'settings'];
                for (const collectionName of collectionsToClear) {
                    const colRef = collection(db, getCollectionPath(collectionName));
                    const snapshot = await getDocs(colRef);
                    for (const docSnapshot of snapshot.docs) {
                        await deleteDoc(docSnapshot.ref);
                    }
                }

                // Import products
                products = importedData.products;
                for (const product of products) {
                    await addProductToFirestore(product);
                }

                // Import transactions
                transactionHistory = importedData.transactions;
                for (const transaction of transactionHistory) {
                    // Ensure items array is not stringified before saving to Firestore
                    if (typeof transaction.items === 'string') {
                        transaction.items = JSON.parse(transaction.items);
                    }
                    await addTransactionToFirestore(transaction);
                }

                // Import expenses
                expenses = importedData.expenses || [];
                for (const expense of expenses) {
                    await addExpenseToFirestore(expense);
                }

                // Import users (re-add password for default admin if not present in imported data)
                users = importedData.users || [];
                if (users.length === 0) { // If imported data had no users, re-add default admin
                    users.push({ username: 'admin', password: 'admin', role: 'admin' });
                }
                // Ensure default admin always has a password, even if not exported
                const adminUser = users.find(u => u.username === 'admin');
                if (adminUser && !adminUser.password) {
                    adminUser.password = 'admin'; // Re-set default password if missing
                }
                for (const user of users) {
                    await saveUserToFirestore(user);
                }


                // Import app settings
                dailyRevenue = importedData.dailyRevenue || 0;
                lastRecordedDate = importedData.lastRecordedDate || '';
                isRevenueVisible = typeof importedData.isRevenueVisible !== 'undefined' ? importedData.isRevenueVisible : true;
                isDarkMode = typeof importedData.isDarkMode !== 'undefined' ? importedData.isDarkMode : false;
                monthlyNetProfit = importedData.monthlyNetProfit || 0;
                monthlyExpenses = importedData.monthlyExpenses || 0;
                lastRecordedMonth = importedData.lastRecordedMonth || '';

                // Store the last connected printer ID (will be saved to settings later)
                const importedPrinterId = importedData.lastConnectedPrinterId || null;
                if (importedPrinterId) {
                    localStorage.setItem('pos_bluetooth_printer_id', importedPrinterId); // Temporarily store
                } else {
                    localStorage.removeItem('pos_bluetooth_printer_id');
                }

                await saveAppSettingsToFirestore(); // Save all imported app settings to Firestore

                // Clear loggedInUser, as user needs to re-login after full data import
                loggedInUser = null;
                sessionStorage.removeItem('pos_logged_in_user_session'); // Explicitly clear session storage

                // Re-render all necessary components and reset UI state
                renderStoreProducts();
                updateHeaderDailyRevenue();
                updateCashierDisplay(); // Update cashier display to reflect no logged in user initially
                applyDarkMode(); // Apply imported dark mode state
                renderMonthlyFinancialBar(); // Render the monthly bar after import
                updatePrinterConnectionStatus("Silahkan sambungkan printer"); // Reset printer status
                displayStatus("Data aplikasi lengkap berhasil diimpor!", "success");

                // Attempt to reconnect to the printer after import
                loadSavedPrinter();

                // Redirect to login screen after successful import and state reset
                loginScreen.classList.remove('hidden');
                mainAppContainer.classList.add('hidden');
            } else {
                displayStatus("Impor data aplikasi dibatalkan.", "info");
            }

        } catch (error) {
            displayStatus("Error memproses file data aplikasi: " + error.message + " Pastikan file JSON valid.", "error");
            console.error("Error importing all data:", error);
        }
    };
    reader.readAsText(file);
}

// Function to perform the actual data reset
async function performResetAllData() { // Made async
    // Clear all data from Firestore for the current user
    const collectionsToClear = ['products', 'transactions', 'expenses', 'users', 'settings'];
    for (const collectionName of collectionsToClear) {
        const colRef = collection(db, getCollectionPath(collectionName));
        const snapshot = await getDocs(colRef);
        for (const docSnapshot of snapshot.docs) {
            await deleteDoc(docSnapshot.ref);
        }
    }

    // Reset local data variables to initial states
    products = [];
    transactionHistory = [];
    expenses = [];
    users = [{ username: 'admin', password: 'admin', role: 'admin' }]; // Reset to default admin user
    loggedInUser = null; // Clear logged-in user
    dailyRevenue = 0;
    lastRecordedDate = '';
    isRevenueVisible = true;
    isDarkMode = false; // Reset dark mode to default (light)
    monthlyNetProfit = 0; // Reset monthly financial data
    monthlyExpenses = 0;
    lastRecordedMonth = '';
    bluetoothPrinterDevice = null; // Clear printer connection
    printerCharacteristic = null;

    // Re-add default admin and products to Firestore
    await saveUserToFirestore(users[0]);
    const defaultProducts = [
        { id: 'prod001', name: "Kopi Hitam", price: 15000, cost: 10000, stock: 100 },
        { id: 'prod002', name: "Kopi Susu", price: 18000, cost: 12000, stock: 80 },
        { id: 'prod003', name: "Teh Manis", price: 10000, cost: 6000, stock: 150 },
        { id: 'prod004', name: "Es Jeruk", price: 12000, cost: 7000, stock: 90 },
        { id: 'prod005', name: "Roti Bakar Keju", price: 25000, cost: 18000, stock: 50 },
        { id: 'prod006', name: "Mie Ayam", price: 22000, cost: 15000, stock: 70 },
        { id: 'prod007', name: "Nasi Goreng", price: 28000, cost: 20000, stock: 60 },
        { id: 'prod008', name: "Air Mineral", price: 5000, cost: 2000, stock: 200 },
    ];
    for (const product of defaultProducts) {
        await setDoc(doc(db, getCollectionPath('products'), product.id), product);
    }
    products = defaultProducts; // Update local products after adding to Firestore

    await saveAppSettingsToFirestore(); // Save initial settings to Firestore

    // Clear all relevant local and session storage items for completeness, although Firestore is primary now
    localStorage.clear();
    sessionStorage.clear();

    startNewTransaction();
    renderStoreProducts();
    updateHeaderDailyRevenue();
    updateCashierDisplay(); // Update cashier display after reset
    applyDarkMode(); // Apply default dark mode state
    renderMonthlyFinancialBar(); // Render the monthly bar
    updatePrinterConnectionStatus("Silahkan sambungkan printer"); // Reset printer status
    displayStatus("Semua data aplikasi telah direset!", "success");

    // Redirect to login screen after successful reset
    loginScreen.classList.remove('hidden');
    mainAppContainer.classList.add('hidden');
}

// Function to open the reset data confirmation modal
function openResetDataConfirmation() {
    resetDataModal.classList.remove('hidden');
    resetPasswordInput.value = ''; // Clear input field
    resetDataMessage.classList.add('hidden'); // Hide any previous messages
}


// --- Transaction History Functions ---
// Renders the list of transactions in the history modal, with optional date filter.
function renderTransactionHistory(startDateStr = '', endDateStr = '') {
    if (!transactionHistoryTableBody || !totalTransactionsAmount) return;
    transactionHistoryTableBody.innerHTML = ''; // Clear existing rows

    let filteredHistory = transactionHistory;

    if (startDateStr && endDateStr) {
        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0); // Start of the day
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999); // End of the day

        filteredHistory = transactionHistory.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    } else if (startDateStr) {
        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0);
        filteredHistory = transactionHistory.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate;
        });
    } else if (endDateStr) {
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999);
        filteredHistory = filteredHistory.filter(transaction => { // Corrected: use filteredHistory here
            const transactionDate = new Date(transaction.date);
            return transactionDate <= endDate;
        });
    }

    let totalAmountFilteredTransactions = 0;

    if (filteredHistory.length === 0) {
        transactionHistoryMessageBox.classList.remove('hidden');
        transactionHistoryMessageBox.textContent = "Tidak ada transaksi dalam riwayat." + (startDateStr || endDateStr ? " untuk rentang tanggal yang dipilih." : "");
        totalAmountFilteredTransactions = 0; // Reset total if no transactions
    } else {
        transactionHistoryMessageBox.classList.add('hidden');
    }

    filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent first

    filteredHistory.forEach(transaction => {
        const row = document.createElement('tr');
        const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
        const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
        const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-200';
        // These head classes are for thead, not tbody rows, safe to remove
        // const headBgClass = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
        // const headTextClass = isDarkMode ? 'text-gray-300' : 'text-gray-500';

        row.className = hoverClass;
        const transactionDate = new Date(transaction.date).toLocaleString('id-ID', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        row.innerHTML = `
            <td class="py-2 px-4 border-b ${borderColor} ${textClass}">${transaction.id}</td>
            <td class="py-2 px-4 border-b ${borderColor} ${textClass}">${transactionDate}</td>
            <td class="py-2 px-4 border-b ${borderColor} ${textClass}">${transaction.cashier || 'N/A'}</td>
            <td class="py-2 px-4 border-b ${borderColor} text-right ${textClass}">Rp ${transaction.totalAmount.toLocaleString('id-ID')}</td>
            <td class="py-2 px-4 border-b ${borderColor} text-center">
                <button class="view-detail-btn text-blue-500 hover:text-blue-700 mr-2" data-transaction-id="${transaction.id}" title="Lihat Detail">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
                <button class="delete-transaction-btn text-red-500 hover:text-red-700" data-transaction-id="${transaction.id}" title="Hapus Transaksi">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                </button>
            </td>
        `;
        transactionHistoryTableBody.appendChild(row);
        totalAmountFilteredTransactions += transaction.totalAmount; // Accumulate total
    });
    totalTransactionsAmount.textContent = `Rp ${totalAmountFilteredTransactions.toLocaleString('id-ID')}`;
}

// Displays detailed information for a specific transaction.
function viewTransactionDetails(transactionId) {
    const transaction = transactionHistory.find(t => t.id === transactionId);
    if (!transaction) {
        displayStatus("Error: Transaksi tidak ditemukan.", "error");
        return;
    }

    // Hide main history list and show detail section
    document.getElementById('transaction-history-table-body').parentElement.classList.add('hidden');
    document.getElementById('transaction-history-message-box').classList.add('hidden');
    historyFilterControls.classList.add('hidden'); // Hide filter controls
    totalTransactionsAmount.parentElement.classList.add('hidden'); // Hide total transactions amount
    transactionDetailSection.classList.remove('hidden');

    // Store the transaction ID on the reprint button
    reprintReceiptBtn.dataset.transactionId = transaction.id;

    // Populate detail fields
    detailTransactionId.textContent = transaction.id;
    detailTransactionDate.textContent = new Date(transaction.date).toLocaleString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    detailCashier.textContent = transaction.cashier || 'N/A';
    detailSubtotal.textContent = `Rp ${transaction.subtotalAmount.toLocaleString('id-ID')}`;
    detailDiscount.textContent = `Rp ${transaction.discountAmount.toLocaleString('id-ID')}`;
    detailTotalAmount.textContent = `Rp ${transaction.totalAmount.toLocaleString('id-ID')}`;
    detailPaymentAmount.textContent = `Rp ${transaction.paymentAmount.toLocaleString('id-ID')}`;
    detailChangeAmount.textContent = `Rp ${transaction.changeAmount.toLocaleString('id-ID')}`;

    // Populate item list for details
    detailItemList.innerHTML = '';
    if (transaction.items && transaction.items.length > 0) {
        transaction.items.forEach(item => {
            const row = document.createElement('tr');
            const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
            const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-200';
            row.innerHTML = `
                <td class="py-2 px-4 border-b ${borderColor} ${textClass}">${item.name}</td>
                <td class="py-2 px-4 border-b ${borderColor} text-right ${textClass}">${item.qty}</td>
                <td class="py-2 px-4 border-b ${borderColor} text-right ${textClass}">Rp ${item.price.toLocaleString('id-ID')}</td>
                <td class="py-2 px-4 border-b ${borderColor} text-right ${textClass}">Rp ${(item.qty * item.price).toLocaleString('id-ID')}</td>
            `;
            detailItemList.appendChild(row);
        });
    } else {
        const textClass = isDarkMode ? 'text-gray-400' : 'text-gray-500';
        detailItemList.innerHTML = `<tr><td colspan="4" class="py-4 text-center ${textClass}">Tidak ada item dalam transaksi ini.</td></tr>`;
    }
}

// Hides the transaction detail section and shows the history list.
function closeTransactionDetails() {
    transactionDetailSection.classList.add('hidden');
    document.getElementById('transaction-history-table-body').parentElement.classList.remove('hidden');
    historyFilterControls.classList.remove('hidden'); // Show filter controls
    totalTransactionsAmount.parentElement.classList.remove('hidden'); // Show total transactions amount
    renderTransactionHistory(historyStartDateInput.value, historyEndDateInput.value); // Re-render history list
}

// Deletes a transaction and returns stock for registered products.
async function deleteTransaction(transactionId) { // Made async
    const confirmed = await confirmAction("Apakah Anda yakin ingin menghapus transaksi ini? Stok produk terdaftar akan dikembalikan.");
    if (!confirmed) return;

    const transactionIndex = transactionHistory.findIndex(t => t.id === transactionId);
    if (transactionIndex > -1) {
        const transactionToDelete = transactionHistory[transactionIndex];

        // Return stock for all products, only if it's a registered product
        for (const item of transactionToDelete.items) {
            if (!item.productId.startsWith('custom-')) { // Check if it's NOT a custom product
                const product = products.find(p => p.id === item.productId);
                if (product && product.stock !== undefined) {
                    product.stock += item.qty;
                    await saveProductToFirestore(product); // Save updated stock to Firestore
                }
            }
        }

        await deleteTransactionFromFirestore(transactionId); // Delete from Firestore
        transactionHistory.splice(transactionIndex, 1); // Remove transaction from local array

        // Recalculate daily revenue if the deleted transaction was from the current day
        const today = new Date().toISOString().slice(0, 10);
        const transactionDate = new Date(transactionToDelete.date).toISOString().slice(0, 10);
        if (transactionDate === today) {
            dailyRevenue -= transactionToDelete.totalAmount;
            if (dailyRevenue < 0) dailyRevenue = 0; // Prevent negative revenue
        }

        // Recalculate monthly net profit if the deleted transaction was from the current month
        const thisMonth = new Date().toISOString().slice(0, 7);
        const transactionMonth = new Date(transactionToDelete.date).toISOString().slice(0, 7);
        if (transactionMonth === thisMonth && transactionToDelete.transactionNetProfit !== undefined) {
            monthlyNetProfit -= transactionToDelete.transactionNetProfit;
        }
        await saveAppSettingsToFirestore(); // Save updated daily and monthly financials to Firestore

        renderTransactionHistory(historyStartDateInput.value, historyEndDateInput.value); // Re-render the list
        displayStatus("Transaksi berhasil dihapus dan stok dikembalikan!", "success");
    } else {
        displayStatus("Error: Transaksi tidak ditemukan untuk dihapus.", "error");
    }
}

// --- User Management Functions (New) ---

// Main login function for the initial login screen.
async function loginUser() { // Made async
    const username = loginScreenUsernameInput.value.trim();
    const password = loginScreenPasswordInput.value.trim();

    // Directly query Firestore for the user
    const userDocRef = doc(db, getCollectionPath('users'), username);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().password === password) {
        loggedInUser = { id: userDoc.id, ...userDoc.data() };
        sessionStorage.setItem('pos_logged_in_user_session', JSON.stringify(loggedInUser)); // Save to session storage
        updateCashierDisplay(); // Update display in header
        displayStatus(`Selamat datang, ${loggedInUser.username}! Anda login sebagai ${loggedInUser.role}.`, "success", loginScreenMessage);

        // Hide login screen, show main app
        loginScreen.classList.add('hidden');
        mainAppContainer.classList.remove('hidden');
        startNewTransaction(); // Start a new transaction after login
        // Clear login fields
        loginScreenUsernameInput.value = '';
        loginScreenPasswordInput.value = '';
        displayStatus("", "", loginScreenMessage); // Clear message
    } else {
        displayStatus("Username atau password salah!", "error", loginScreenMessage);
    }
}

// Handles user login *within the user settings modal*.
async function userSettingsLogin() { // Made async
    const username = userSettingsLoginUsernameInput.value.trim();
    const password = userSettingsLoginPasswordInput.value.trim();

    // Directly query Firestore for the user
    const userDocRef = doc(db, getCollectionPath('users'), username);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data().password === password) {
        loggedInUser = { id: userDoc.id, ...userDoc.data() };
        sessionStorage.setItem('pos_logged_in_user_session', JSON.stringify(loggedInUser)); // Save to session storage
        updateCashierDisplay(); // Update display in header
        displayStatus(`Selamat datang, ${loggedInUser.username}! Anda login sebagai ${loggedInUser.role}.`, "success", userSettingsLoginStatusMessage);
        showUserManagementSection(); // Re-evaluate and show/hide sections
    } else {
        displayStatus("Username atau password salah!", "error", userSettingsLoginStatusMessage);
    }
}

// Handles user logout.
function logoutUser() {
    const confirmed = confirm("Apakah Anda yakin ingin logout?");
    if (!confirmed) return;

    // Firebase Auth signOut (optional, for explicit session management)
    // auth.signOut().then(() => {
    //     console.log("Firebase user signed out.");
    // }).catch((error) => {
    //     console.error("Error signing out:", error);
    // });

    loggedInUser = null;
    sessionStorage.removeItem('pos_logged_in_user_session'); // Clear logged-in user state from session storage
    updateCashierDisplay(); // Update display in header
    displayStatus("Anda telah logout.", "info");

    // Show the main login screen and hide the main app
    loginScreen.classList.remove('hidden');
    mainAppContainer.classList.add('hidden');
    startNewTransaction(); // Reset transaction state

    // If user settings modal is open, ensure it shows the login section
    if (!userSettingsModal.classList.contains('hidden')) {
        showUserManagementSection(); // This will show login if no user is logged in
    }
}

// Adds a new user (cashier or admin).
async function addNewUser() { // Made async
    const username = newUserNameInput.value.trim();
    const password = newUserPasswordInput.value.trim();
    const role = newUserRoleSelect.value;

    if (!username || !password) {
        displayStatus("Username dan password wajib diisi!", "error", addUserStatusMessage);
        return;
    }

    // Check for duplicate username in Firestore before adding
    const userDocRef = doc(db, getCollectionPath('users'), username);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        displayStatus("Username sudah ada. Pilih username lain.", "error", addUserStatusMessage);
        return;
    }

    const newUser = { username, password, role };
    await saveUserToFirestore(newUser); // Add to Firestore
    users.push(newUser); // Add to local array
    renderUserList(); // Update the displayed user list
    displayStatus("Pengguna baru berhasil ditambahkan!", "success", addUserStatusMessage);
    newUserNameInput.value = '';
    newUserPasswordInput.value = '';
    newUserRoleSelect.value = 'cashier'; // Reset to default
}

// Renders the list of users in the user management section.
function renderUserList() {
    if (!userListBody || !emptyUserMessage) return;
    userListBody.innerHTML = '';

    if (users.length === 0) {
        emptyUserMessage.classList.remove('hidden');
    } else {
        emptyUserMessage.classList.add('hidden');
        users.forEach(user => {
            const row = document.createElement('tr');
            const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
            const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
            const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-200';

            row.className = hoverClass;
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${textClass} ${borderColor}">${user.username}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${textClass} ${borderColor}">${user.role}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${borderColor}">
                    ${(loggedInUser && loggedInUser.username === user.username) ? '' : ` <!-- Prevent deleting the currently logged-in user -->
                    ${user.username.toLowerCase() !== 'admin' ? ` <!-- Prevent deleting default admin -->
                    <button class="delete-user-btn text-red-600 hover:text-red-900" data-username="${user.username}" title="Hapus Pengguna">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    ` : ''}
                    `}
                </td>
            `;
            userListBody.appendChild(row);
        });
    }
}

// Deletes a user.
async function deleteUser(username) { // Made async
    if (username.toLowerCase() === 'admin') { // Prevent deleting default admin
        displayStatus("Tidak dapat menghapus pengguna 'admin' default.", "error", addUserStatusMessage);
        return;
    }
    if (loggedInUser && loggedInUser.username.toLowerCase() === username.toLowerCase()) { // Prevent deleting currently logged-in user
        displayStatus("Tidak dapat menghapus pengguna yang sedang login.", "error", addUserStatusMessage);
        return;
    }

    const confirmed = await confirmAction(`Apakah Anda yakin ingin menghapus pengguna '${username}'?`);
    if (confirmed) {
        await deleteUserFromFirestore(username); // Delete from Firestore
        users = users.filter(u => u.username.toLowerCase() !== username.toLowerCase()); // Update local array
        renderUserList();
        displayStatus("Pengguna berhasil dihapus!", "success", addUserStatusMessage);
    } else {
        displayStatus("Penghapusan pengguna dibatalkan.", "info", addUserStatusMessage);
    }
}

// Shows/hides sections within the User Settings modal based on login status and role.
function showUserManagementSection() {
    if (loggedInUser && loggedInUser.role === 'admin') {
        userSettingsLoginSection.classList.add('hidden');
        userManagementSection.classList.remove('hidden');
        renderUserList(); // Render user list when admin section is shown
    } else {
        userSettingsLoginSection.classList.remove('hidden');
        userManagementSection.classList.add('hidden');
        // Clear login fields and messages when showing login section
        userSettingsLoginUsernameInput.value = '';
        userSettingsLoginPasswordInput.value = '';
        displayStatus("", "", userSettingsLoginStatusMessage);
    }
}

// Opens the user settings modal.
function openUserSettingsModal() {
    userSettingsModal.classList.remove('hidden');
    adminMenuDropdown.classList.add('hidden');
    showUserManagementSection(); // Determine which section to show
}

// Closes the user settings modal.
function closeUserSettingsModal() {
    userSettingsModal.classList.add('hidden');
    displayStatus("", "", userSettingsLoginStatusMessage); // Clear status messages
    displayStatus("", "", addUserStatusMessage);
}

// --- Bluetooth Printer Functions (New) ---

// Updates the printer connection status in the modal and button states.
function updatePrinterConnectionStatus(message, isConnected = false) {
    if (printerStatus) printerStatus.textContent = `Status: ${message}`;
    if (connectPrinterBtn) connectPrinterBtn.disabled = isConnected;
    if (disconnectPrinterBtn) disconnectPrinterBtn.disabled = !isConnected;
    if (testPrintBtn) testPrintBtn.disabled = !isConnected;
}

// Stores the connected printer's ID in Firestore (as part of app settings).
async function savePrinterAddress(deviceId) { // Made async
    try {
        localStorage.setItem('pos_bluetooth_printer_id', deviceId); // Temporarily store in local storage
        await saveAppSettingsToFirestore(); // Save to Firestore via app settings
        console.log("Printer ID saved to Firestore via app settings:", deviceId);
    } catch (e) {
        console.error("Gagal menyimpan ID printer ke Firestore:", e);
    }
}

// Clears the stored printer ID from Firestore (as part of app settings).
async function clearSavedPrinter() { // Made async
    try {
        localStorage.removeItem('pos_bluetooth_printer_id'); // Clear from local storage
        await saveAppSettingsToFirestore(); // Save null to Firestore via app settings
        console.log("Printer ID dihapus dari Firestore.");
    } catch (e) {
        console.error("Gagal menghapus ID printer dari Firestore:", e);
    }
}

// Attempts to connect to a Bluetooth printer.
async function connectPrinter() {
    try {
        updatePrinterConnectionStatus("Mencari printer...", false);
        // Request any Bluetooth device, specifying the common service for printers
        bluetoothPrinterDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true, // Allow all devices to be shown
            optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'] // Common Bluetooth SPP service for printers (Bluetooth Serial Port Profile)
        });

        if (!bluetoothPrinterDevice) {
            updatePrinterConnectionStatus("Pencarian printer dibatalkan.");
            return;
        }

        updatePrinterConnectionStatus("Menghubungkan ke printer...", false);
        const server = await bluetoothPrinterDevice.gatt.connect();

        // Add listener for GATT server disconnected event
        bluetoothPrinterDevice.addEventListener('gattserverdisconnected', onPrinterDisconnected);

        // Get the primary service and characteristic
        const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
        printerCharacteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb'); // Printer output characteristic

        updatePrinterConnectionStatus(`Printer terhubung: ${bluetoothPrinterDevice.name || bluetoothPrinterDevice.id}`, true);
        await savePrinterAddress(bluetoothPrinterDevice.id); // Save device ID to Firestore

    } catch (error) {
        console.error("Koneksi printer error:", error);
        updatePrinterConnectionStatus(`Error: ${error.message}`);
        bluetoothPrinterDevice = null;
        printerCharacteristic = null;
        await clearSavedPrinter(); // Clear saved printer on connection failure
    }
}

// Disconnects from the Bluetooth printer.
async function disconnectPrinter() { // Made async
    if (bluetoothPrinterDevice && bluetoothPrinterDevice.gatt.connected) {
        try {
            bluetoothPrinterDevice.gatt.disconnect();
            // onPrinterDisconnected will handle status update
        } catch (error) {
            console.error("Gagal memutuskan printer:", error);
            updatePrinterConnectionStatus(`Gagal memutuskan: ${error.message}`);
        }
    } else {
        updatePrinterConnectionStatus("Printer tidak terhubung.");
    }
    bluetoothPrinterDevice = null;
    printerCharacteristic = null;
    await clearSavedPrinter(); // Clear saved printer on explicit disconnect
}

// Handler for printer disconnection event.
async function onPrinterDisconnected(event) { // Made async
    const device = event.target;
    console.log(`Printer ${device.name || device.id} telah terputus.`);
    updatePrinterConnectionStatus("Printer terputus.");
    bluetoothPrinterDevice = null;
    printerCharacteristic = null;
    await clearSavedPrinter(); // Clear saved printer on unexpected disconnect
}

// Sends a test print.
async function testPrint() {
    if (!bluetoothPrinterDevice || !printerCharacteristic) {
        updatePrinterConnectionStatus("Printer belum terhubung.");
        return;
    }

    updatePrinterConnectionStatus("Mengirim test print...", true);

    try {
        const text = "=== TEST PRINT ===\n" +
                     "Aplikasi Kasir POS\n" +
                     "Tanggal: " + new Date().toLocaleString() + "\n" +
                     "------------------\n" +
                     "Cetak Berhasil!\n\n\n"; // Added extra line breaks for paper cutting

        const encoder = new TextEncoder();
        await printerCharacteristic.writeValue(encoder.encode(text));

        updatePrinterConnectionStatus("Test print berhasil!", true);
    } catch (error) {
        console.error("Test print error:", error);
        updatePrinterConnectionStatus(`Test print error: ${error.message}`);
    }
}

// Attempts to load and reconnect to a previously saved printer.
async function loadSavedPrinter() {
    // Printer ID is now part of app settings, loaded by loadAppSettingsFromFirestore
    const savedPrinterId = localStorage.getItem('pos_bluetooth_printer_id'); // Temporary retrieval from local storage

    if (savedPrinterId) {
        updatePrinterConnectionStatus("Mencoba menghubungkan kembali ke printer terakhir...", false);
        try {
            // Reconnect to the known device by its ID
            const devices = await navigator.bluetooth.getDevices();
            const foundDevice = devices.find(d => d.id === savedPrinterId);

            if (foundDevice) {
                bluetoothPrinterDevice = foundDevice;
                bluetoothPrinterDevice.addEventListener('gattserverdisconnected', onPrinterDisconnected);

                const server = await bluetoothPrinterDevice.gatt.connect();
                const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
                printerCharacteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

                updatePrinterConnectionStatus(`Printer terhubung kembali: ${bluetoothPrinterDevice.name || bluetoothPrinterDevice.id}`, true);
            } else {
                updatePrinterConnectionStatus("Printer tersimpan tidak ditemukan. Silahkan hubungkan secara manual.");
                await clearSavedPrinter(); // Clear invalid saved ID from Firestore
            }
        } catch (error) {
            console.error("Gagal menghubungkan kembali ke printer tersimpan:", error);
            updatePrinterConnectionStatus(`Gagal menghubungkan kembali: ${error.message}`);
            bluetoothPrinterDevice = null;
            printerCharacteristic = null;
            await clearSavedPrinter(); // Clear saved printer on reconnection failure
        }
    } else {
        updatePrinterConnectionStatus("Silahkan sambungkan printer");
    }
}

// --- Price Calculator Functions (NEW) ---
function openPriceCalculatorModal() {
    priceCalculatorModal.classList.remove('hidden');
    adminMenuDropdown.classList.add('hidden'); // Close admin menu
    // Reset inputs
    priceCalcProductCodeInput.value = '';
    priceCalcProductNameInput.value = '';
    priceCalcModalInput.value = '0';
    priceCalcMarginPercentInput.value = '0';
    priceCalcTaxPercentInput.value = '0';
    priceCalcDiscountPercentInput.value = '0';
    priceCalcSellingPriceInput.value = 'Rp 0';
    priceCalcProfitInput.value = 'Rp 0';
    priceCalcStatusMessage.classList.add('hidden'); // Clear status message
}

function closePriceCalculatorModal() {
    priceCalculatorModal.classList.add('hidden');
    priceCalcStatusMessage.classList.add('hidden'); // Clear status message on close
}

function calculateSellingPriceAndProfit() {
    const modal = parseFloat(priceCalcModalInput.value) || 0;
    const marginPercent = parseFloat(priceCalcMarginPercentInput.value) || 0;
    const taxPercent = parseFloat(priceCalcTaxPercentInput.value) || 0;
    const discountPercent = parseFloat(priceCalcDiscountPercentInput.value) || 0;
    const productCode = priceCalcProductCodeInput.value.trim();

    priceCalcStatusMessage.classList.add('hidden'); // Hide previous messages

    if (isNaN(modal) || modal < 0 || isNaN(marginPercent) || marginPercent < 0 ||
        isNaN(taxPercent) || taxPercent < 0 || isNaN(discountPercent) || discountPercent < 0) {
        displayStatus("Error: Semua input angka harus valid dan tidak negatif.", "error", priceCalcStatusMessage);
        priceCalcSellingPriceInput.value = 'Rp 0';
        priceCalcProfitInput.value = 'Rp 0';
        return;
    }

    // Check for duplicate product code if provided
    if (productCode) {
        const isCodeRegistered = products.some(p => p.id.toLowerCase() === productCode.toLowerCase());
        if (isCodeRegistered) {
            displayStatus(`Peringatan: Kode Barang '${productCode}' sudah terdaftar pada produk yang ada.`, "warning", priceCalcStatusMessage);
        }
    }

    // Calculate Harga Jual
    const sellingPrice = modal * (1 + marginPercent / 100);

    // Calculate Laba based on the user's specific formula: (margin - discount - pajak) * modal
    const marginAmount = modal * (marginPercent / 100);
    const taxAmountOnModal = modal * (taxPercent / 100);
    const discountAmountOnModal = modal * (discountPercent / 100);

    const profit = marginAmount - taxAmountOnModal - discountAmountOnModal;

    priceCalcSellingPriceInput.value = `Rp ${sellingPrice.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    priceCalcProfitInput.value = `Rp ${profit.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}


// --- Event Listeners (Moved inside DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', async (event) => { // Made async

    // Assign Firebase and other global variables from window
    db = window.db;
    auth = window.auth;
    appId = window.appId;

    // Authenticate user with custom token or anonymously
    if (window.initialAuthToken) {
        try {
            const userCredential = await signInWithCustomToken(auth, window.initialAuthToken);
            userId = userCredential.user.uid;
            console.log("Signed in with custom token:", userId);
        } catch (error) {
            console.error("Error signing in with custom token:", error);
            // Fallback to anonymous sign-in if custom token fails
            try {
                const userCredential = await signInAnonymously(auth);
                userId = userCredential.user.uid;
                console.log("Signed in anonymously:", userId);
            } catch (anonError) {
                console.error("Error signing in anonymously:", anonError);
                // If even anonymous sign-in fails, use a random ID but functionality will be limited
                userId = crypto.randomUUID();
                console.warn("Could not sign in to Firebase. Using a random user ID. Data persistence may not work.");
            }
        }
    } else {
        // Sign in anonymously if no custom token is provided (e.g., local development)
        try {
            const userCredential = await signInAnonymously(auth);
            userId = userCredential.user.uid;
            console.log("Signed in anonymously (no initial token):", userId);
        } catch (anonError) {
            console.error("Error signing in anonymously:", anonError);
            userId = crypto.randomUUID(); // Fallback to random UUID if anonymous sign-in fails
            console.warn("Could not sign in to Firebase. Using a random user ID. Data persistence may not work.");
        }
    }

    // Assign DOM elements once the DOM is ready
    loginScreen = document.getElementById('login-screen');
    mainAppContainer = document.getElementById('main-app-container');

    loginScreenUsernameInput = document.getElementById('login-username-input');
    loginScreenPasswordInput = document.getElementById('login-password-input');
    loginScreenBtn = document.getElementById('login-screen-btn');
    loginScreenMessage = document.getElementById('login-screen-message');


    itemList = document.getElementById('itemList');
    totalAmountInput = document.getElementById('totalAmount');
    discountAmountInput = document.getElementById('discountAmount');
    paymentAmountInput = document.getElementById('paymentAmount');
    paymentMethodSelect = document.getElementById('paymentMethod'); // NEW
    changeAmountHeader = document.getElementById('changeAmountHeader'); // New element
    statusElement = document.getElementById('status');
    newTransactionButton = document.getElementById('newTransaction');
    printReceiptButton = document.getElementById('printReceipt');
    processOnlyPaymentButton = document.getElementById('processOnlyPayment');
    noItemsMessage = document.getElementById('noItemsMessage');
    headerDateTime = document.getElementById('headerDateTime');
    headerDailyRevenue = document.getElementById('headerDailyRevenue');
    headerDailyRevenueAmountContainer = document.getElementById('headerDailyRevenueAmountContainer');
    toggleDailyRevenueVisibilityButton = document.getElementById('toggleDailyRevenueVisibility');
    eyeIcon = document.getElementById('eyeIcon');
    eyeSlashIcon = document.getElementById('eyeSlashIcon');
    cashierDisplay = document.getElementById('cashierDisplay');
    cashierRole = document.getElementById('cashierRole');
    logoutButton = document.getElementById('logoutButton');
    darkModeToggle = document.getElementById('darkModeToggle'); // Get dark mode toggle button

    // Monthly Financial Bar elements
    monthlyFinancialBarContainer = document.getElementById('monthly-financial-bar-container');
    monthlyProfitBar = document.getElementById('monthly-profit-bar');
    monthlyExpenseBar = document.getElementById('monthly-expense-bar');


    // Registered product input elements
    productCodeInput = document.getElementById('product-code');
    productNameInput = document.getElementById('product-name');
    priceInput = document.getElementById('price');
    quantityInput = document.getElementById('quantity');
    addRegisteredItemButton = document.getElementById('add-to-cart-btn-registered');

    // Custom product input elements
    customProductCodeInput = document.getElementById('custom-product-code');
    customProductNameInput = document.getElementById('custom-product-name');
    customProductPriceInput = document.getElementById('custom-price');
    customProductQtyInput = document.getElementById('custom-quantity');
    addCustomItemButton = document.getElementById('add-to-cart-btn-custom');

    showRegisteredProductsButton = document.getElementById('showRegisteredProducts');
    showCustomProductsButton = document.getElementById('showCustomProducts');
    customProductSection = document.getElementById('customProductSection');
    registeredProductSection = document.getElementById('registeredProductSection');

    // Admin menu elements
    adminMenuButton = document.getElementById('adminMenuButton');
    adminMenuDropdown = document.getElementById('admin-menu-dropdown');
    openStoreProductsModalBtn = document.getElementById('open-store-products-modal-btn');
    openAddProductModalBtn = document.getElementById('open-add-product-modal-btn');
    openFinancialReportModalBtn = document.getElementById('open-financial-report-modal-btn');
    openExpensesModalBtn = document.getElementById('open-expenses-modal-btn');
    openUserSettingsModalBtn = document.getElementById('open-user-settings-modal-btn');
    openPriceCalculatorModalBtn = document.getElementById('open-price-calculator-modal-btn'); // NEW
    exportProductsBtn = document.getElementById('export-products-btn');
    importProductsFileInput = document.getElementById('import-products-file-input');
    importProductsBtn = document.getElementById('import-products-btn');
    exportDataBtn = document.getElementById('export-data-btn');
    importFileInput = document.getElementById('import-file-input');
    importDataBtn = document.getElementById('import-data-btn');
    resetAllDataBtn = document.getElementById('reset-all-data-btn');

    // Store Products Modal elements
    storeProductsModal = document.getElementById('store-products-modal');
    closeStoreProductsModalBtn = document.getElementById('close-store-products-modal');
    storeProductsTableBody = document.getElementById('store-products-table-body');
    searchStoreProductsInput = document.getElementById('search-store-products-input');
    storeProductsTableContainer = document.getElementById('store-products-table-container');
    editProductForm = document.getElementById('edit-product-form');
    editProductIdInput = document.getElementById('edit-product-id-input');
    editProductNameInput = document.getElementById('edit-product-name-input');
    editProductCostInput = document.getElementById('edit-product-cost-input');
    editProductPriceInput = document.getElementById('edit-product-price-input');
    editProductStockInput = document.getElementById('edit-product-stock-input');
    saveProductEditBtn = document.getElementById('save-product-edit-btn');
    cancelProductEditBtn = document.getElementById('cancel-product-edit-btn');

    // Add Product Modal elements
    addProductModal = document.getElementById('add-product-modal');
    closeAddProductModalBtn = document.getElementById('close-add-product-modal');
    addProductCodeInput = document.getElementById('add-product-code');
    addProductNameInput = document.getElementById('add-product-name');
    addProductCostInput = document.getElementById('add-product-cost');
    addProductPriceInput = document.getElementById('add-product-price');
    addProductProfitInput = document.getElementById('add-product-profit');
    addProductStockInput = document.getElementById('add-product-stock');
    saveNewProductBtn = document.getElementById('save-new-product-btn');
    cancelAddProductBtn = document.getElementById('cancel-add-product-btn');

    // Expenses Modal elements
    expensesModal = document.getElementById('expenses-modal');
    closeExpensesModalBtn = document.getElementById('close-expenses-modal');
    expenseDateInput = document.getElementById('expense-date');
    expenseDescriptionInput = document.getElementById('expense-description');
    expenseAmountInput = document.getElementById('expense-amount');
    addExpenseBtn = document.getElementById('add-expense-btn');
    expensesListBody = document.getElementById('expenses-list-body');
    emptyExpensesMessage = document.getElementById('empty-expenses-message');
    expenseStatusMessage = document.getElementById('expense-status-message');
    expenseSearchInput = document.getElementById('expense-search-input');
    expenseFilterStartDate = document.getElementById('expense-filter-start-date');
    expenseFilterEndDate = document.getElementById('expense-filter-end-date');
    applyExpenseFilterBtn = document.getElementById('apply-expense-filter-btn');
    clearExpenseFilterBtn = document.getElementById('clear-expense-filter-btn');
    totalExpensesDisplayModal = document.getElementById('total-expenses-display-modal');


    // Financial Report Modal elements
    financialReportModal = document.getElementById('financial-report-modal');
    closeFinancialReportModalBtn = document.getElementById('close-financial-report-modal-btn');
    reportStartDateInput = document.getElementById('report-start-date');
    reportEndDateInput = document.getElementById('report-end-date');
    applyFinancialFilterBtn = document.getElementById('apply-financial-filter-btn');
    clearFinancialFilterBtn = document.getElementById('clear-financial-filter-btn');
    totalRevenueDisplay = document.getElementById('total-revenue-display');
    totalExpensesDisplay = document.getElementById('total-expenses-display');
    grossProfitDisplay = document.getElementById('gross-profit-display');
    netProfitDisplay = document.getElementById('net-profit-display');
    financialChartCanvas = document.getElementById('financial-chart');
    financialReportMessageBox = document.getElementById('financial-report-message-box');

    // Transaction History Modal elements
    openTransactionHistoryBtn = document.getElementById('open-transaction-history-btn');
    transactionHistoryModal = document.getElementById('transaction-history-modal');
    closeTransactionHistoryModalBtn = document.getElementById('close-transaction-history-modal');
    transactionHistoryTableBody = document.getElementById('transaction-history-table-body');
    historyStartDateInput = document.getElementById('history-start-date');
    historyEndDateInput = document.getElementById('history-end-date');
    applyHistoryFilterBtn = document.getElementById('apply-history-filter-btn');
    clearHistoryFilterBtn = document.getElementById('clear-history-filter-btn');
    transactionHistoryMessageBox = document.getElementById('transaction-history-message-box');
    transactionDetailSection = document.getElementById('transaction-detail-section');
    detailTransactionId = document.getElementById('detail-transaction-id');
    detailTransactionDate = document.getElementById('detail-transaction-date');
    detailCashier = document.getElementById('detail-cashier');
    detailSubtotal = document.getElementById('detail-subtotal');
    detailDiscount = document.getElementById('detail-discount');
    detailTotalAmount = document.getElementById('detail-total-amount');
    detailPaymentAmount = document.getElementById('detail-payment-amount');
    detailChangeAmount = document.getElementById('detail-change-amount');
    detailItemList = document.getElementById('detail-item-list');
    closeTransactionDetailBtn = document.getElementById('close-transaction-detail-btn');
    reprintReceiptBtn = document.getElementById('reprint-receipt-btn'); // Get the new reprint button
    historyFilterControls = document.getElementById('history-filter-controls');
    totalTransactionsAmount = document.getElementById('total-transactions-amount');


    // Confirmation Modal elements
    confirmationModal = document.getElementById('confirmation-modal');
    confirmationMessage = document.getElementById('confirmation-message');
    confirmOkBtn = document.getElementById('confirm-ok-btn');
    confirmCancelBtn = document.getElementById('confirm-cancel-btn');

    // User Settings Modal (New)
    userSettingsModal = document.getElementById('user-settings-modal');
    closeUserSettingsModalBtn = document.getElementById('close-user-settings-modal');
    userSettingsLoginSection = document.getElementById('user-settings-login-section');
    userSettingsLoginUsernameInput = document.getElementById('user-settings-login-username');
    userSettingsLoginPasswordInput = document.getElementById('user-settings-login-password');
    userSettingsLoginButton = document.getElementById('user-settings-login-btn');
    userSettingsLoginStatusMessage = document.getElementById('user-settings-login-status-message');
    userManagementSection = document.getElementById('user-management-section');
    newUserNameInput = document.getElementById('new-user-username');
    newUserPasswordInput = document.getElementById('new-user-password');
    newUserRoleSelect = document.getElementById('new-user-role');
    addUserButton = document.getElementById('add-user-btn');
    addUserStatusMessage = document.getElementById('add-user-status-message');
    userListBody = document.getElementById('user-list-body');
    emptyUserMessage = document.getElementById('empty-user-message');

    // Printer Settings Modal (New)
    openPrinterSettingsBtn = document.getElementById('open-printer-settings-btn');
    printerSettingsModal = document.getElementById('printer-settings-modal');
    closePrinterSettingsModalBtn = document.getElementById('close-printer-settings-modal');
    printerStatus = document.getElementById('printer-status');
    connectPrinterBtn = document.getElementById('connect-printer-btn');
    disconnectPrinterBtn = document.getElementById('disconnect-printer-btn');
    testPrintBtn = document.getElementById('test-print-btn');

    // Price Calculator Modal (NEW)
    priceCalculatorModal = document.getElementById('price-calculator-modal');
    closePriceCalculatorModalBtn = document.getElementById('close-price-calculator-modal');
    priceCalcProductCodeInput = document.getElementById('price-calc-product-code');
    copyProductCodeBtn = document.getElementById('copy-product-code-btn');
    priceCalcProductNameInput = document.getElementById('price-calc-product-name');
    priceCalcModalInput = document.getElementById('price-calc-modal');
    priceCalcMarginPercentInput = document.getElementById('price-calc-margin-percent');
    priceCalcTaxPercentInput = document.getElementById('price-calc-tax-percent');
    priceCalcDiscountPercentInput = document.getElementById('price-calc-discount-percent');
    calculatePriceBtn = document.getElementById('calculate-price-btn');
    priceCalcSellingPriceInput = document.getElementById('price-calc-selling-price');
    copySellingPriceBtn = document.getElementById('copy-selling-price-btn');
    priceCalcProfitInput = document.getElementById('price-calc-profit');
    priceCalcStatusMessage = document.getElementById('price-calc-status-message');

    // Nominal Quick Pay Buttons (NEW)
    nominalButtonsContainer = document.getElementById('nominal-buttons-container');
    nominalButtons = document.querySelectorAll('.nominal-btn');

    // New: Audio element for coin sound
    coinSoundAudio = document.getElementById('coinSound');

    // New: Reset data modal elements
    resetDataModal = document.getElementById('reset-data-modal');
    resetPasswordInput = document.getElementById('reset-password-input');
    resetDataConfirmBtn = document.getElementById('reset-data-confirm-btn');
    resetDataCancelBtn = document.getElementById('reset-data-cancel-btn');
    resetDataMessage = document.getElementById('reset-data-message');


    // --- Chart.js library (for financial chart placeholder) ---
    // It's good practice to load external libraries after your DOM is ready
    const chartJsScript = document.createElement('script');
    chartJsScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    chartJsScript.onload = () => {
        // Initialise chart when Chart.js is loaded
        renderFinancialReportChart([]);
    };
    document.head.appendChild(chartJsScript);

    // --- Load Data from Firestore on App Start ---
    // Ensure all data is loaded from Firestore
    await loadUsersFromFirestore(); // Load users first to determine loggedInUser state
    await loadProductsFromFirestore();
    await loadTransactionsFromFirestore();
    await loadExpensesFromFirestore();
    await loadAppSettingsFromFirestore(); // Load all app settings including daily revenue, dark mode, etc.

    applyDarkMode(); // Apply dark mode based on loaded state
    await checkAndResetDailyRevenue(); // This will now also reset monthly data if month changed
    renderMonthlyFinancialBar(); // Initial render of the monthly bar

    // Initial check for logged-in user to show the correct screen
    if (loggedInUser) {
        loginScreen.classList.add('hidden');
        mainAppContainer.classList.remove('hidden');
        startNewTransaction(); // Start a new transaction after successful auto-login
    } else {
        loginScreen.classList.remove('hidden');
        mainAppContainer.classList.add('hidden');
    }

    // Attempt to reconnect to the printer AFTER app settings are loaded and userId is available
    await loadSavedPrinter();


    // Event listener for product code input (registered products)
    if (productCodeInput) {
        // Event listener to populate product details and auto-add when code changes
        productCodeInput.addEventListener('input', function() {
            const code = this.value.trim();
            const foundProduct = products.find(p => p.id === code);

            if (foundProduct) {
                // Added explicit check for 0 stock
                if (foundProduct.stock !== undefined && foundProduct.stock <= 0) {
                    displayStatus(`Error: Stok ${foundProduct.name} habis. Tidak bisa menjual produk ini.`, "error");
                    productNameInput.value = '';
                    priceInput.value = '0';
                    quantityInput.value = '1';
                    return; // Stop processing if stock is 0
                }

                productNameInput.value = foundProduct.name;
                priceInput.value = foundProduct.price.toLocaleString('id-ID');
                // Auto-add to cart
                const id = code;
                const name = foundProduct.name;
                const price = foundProduct.price;
                let qty = parseInt(quantityInput.value); // Use current quantity value
                if (isNaN(qty) || qty <= 0) qty = 1; // Default to 1 if invalid

                // Check stock for all products using foundProduct
                if (foundProduct.stock !== undefined && foundProduct.stock < qty) {
                    displayStatus(`Error: Stok ${foundProduct.name} tidak cukup. Stok tersedia: ${foundProduct.stock}`, "error");
                    return;
                }

                addProductToTransaction(id, name, price, qty);
                // Clear input fields after successful addition
                productCodeInput.value = '';
                productNameInput.value = '';
                priceInput.value = '0';
                quantityInput.value = '1';
                displayStatus("", ""); // Clear previous status
                this.focus(); // Keep focus on product code input for quick entry
            } else {
                // Clear fields if product not found
                productNameInput.value = '';
                priceInput.value = '0';
                // Optionally clear status if a valid product was previously found and now it's not
                displayStatus("", "");
            }
        });

        // REMOVED: Keydown listener for 'Enter' is no longer needed for auto-add.
        // productCodeInput.addEventListener('keydown', function(e) { /* ... */ });
    }

    // Event listener for add registered item button (still useful if user doesn't use scanner/auto-add)
    if (addRegisteredItemButton) {
        addRegisteredItemButton.addEventListener('click', function() {
            const id = productCodeInput.value.trim();
            const name = productNameInput.value.trim();
            const price = parseFloat(priceInput.value.replace(/[^0-9,-]+/g, "").replace(",", ".")) || 0;
            let qty = parseInt(quantityInput.value);
            if (isNaN(qty) || qty <= 0) qty = 1; // Default to 1 if invalid

            const product = products.find(p => p.id === id);

            if (!id || !name || price <= 0) {
                displayStatus("Error: Pastikan Kode Produk terisi, Nama Produk & Harga muncul untuk Produk Terdaftar.", "error");
                return;
            }
            if (isNaN(qty) || qty <= 0) {
                displayStatus("Error: Jumlah valid diperlukan untuk Produk Terdaftar.", "error");
                return;
            }

            // Added explicit check for 0 stock
            if (product && product.stock !== undefined && product.stock <= 0) {
                displayStatus(`Error: Stok ${product.name} habis. Tidak bisa menjual produk ini.`, "error");
                return;
            }

            // Check stock for all products
            if (product && product.stock !== undefined && product.stock < qty) {
                displayStatus(`Error: Stok ${product.name} tidak cukup. Stok tersedia: ${product.stock}`, "error");
                return;
            }

            addProductToTransaction(id, name, price, qty);
            // Clear inputs after adding
            productCodeInput.value = '';
            productNameInput.value = '';
            priceInput.value = '0';
            quantityInput.value = '1';
            displayStatus("", ""); // Clear previous status
        });
    }

    // Event listener for input changes in quantity and payment amount
    document.addEventListener('input', function(e) {
        // Check if the input is an item quantity field within the transaction list
        if (e.target.classList.contains('item-qty-input')) {
            const index = e.target.dataset.itemIndex; // Changed from data-index to data-item-index
            const oldQty = currentTransactionItems[index].qty;
            let newQty = parseInt(e.target.value);

            if (isNaN(newQty) || newQty < 0) {
                newQty = 0; // Treat invalid or negative as 0 for consistency
                e.target.value = 0; // Update input field to 0
            }

            const itemProductId = currentTransactionItems[index].productId;
            // Only adjust stock for registered products in terms of validation
            if (!itemProductId.startsWith('custom-')) {
                const product = products.find(p => p.id === itemProductId);
                if (product && product.stock !== undefined) {
                    const quantityDifference = newQty - oldQty;

                    // If increasing quantity, check if enough stock
                    if (quantityDifference > 0 && product.stock < (currentTransactionItems[index].qty + quantityDifference)) { // Check if new total exceeds stock
                        displayStatus(`Error: Stok ${product.name} tidak cukup. Stok tersedia: ${product.stock}`, "error");
                        e.target.value = oldQty; // Revert quantity input
                        return;
                    }
                    // No direct modification to product.stock here, only validation.
                    // Stock is decremented only upon transaction commit.
                }
            }

            currentTransactionItems[index].qty = newQty;

            // Remove item if quantity becomes 0
            if (newQty === 0) {
                // No stock adjustment here, as it's handled in commit/revert
                currentTransactionItems.splice(index, 1);
            }
            renderTransactionItems(); // Re-render to update total
        }

        // Check if the payment amount input changed
        if (e.target.id === 'paymentAmount') {
            calculateChange(); // Recalculate change
        }

        // New: Check if the discount amount input changed
        if (e.target.id === 'discountAmount') {
            renderTransactionItems(); // Re-render to update total based on new discount
        }
    });

    // Event listener for remove item buttons (delegated to document)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('removeItem')) {
            const index = e.target.dataset.itemIndex; // Changed from data-index to data-item-index
            // No stock adjustment here, as it's handled in commit/revert
            currentTransactionItems.splice(index, 1); // Remove item from array
            renderTransactionItems(); // Re-render the list
        }
    });

    // Event listener for "New Transaction" button
    if (newTransactionButton) newTransactionButton.addEventListener('click', startNewTransaction);

    // Event listeners for section toggling
    if (showRegisteredProductsButton) showRegisteredProductsButton.addEventListener('click', () => showSection('registered'));
    if (showCustomProductsButton) showCustomProductsButton.addEventListener('click', () => showSection('custom'));


    // Event listener for "Add Custom Item" button
    if (addCustomItemButton) addCustomItemButton.addEventListener('click', function() {
        const name = customProductNameInput.value.trim();
        const price = parseFloat(customProductPriceInput.value);
        let qty = parseInt(customProductQtyInput.value);
        const code = customProductCodeInput.value.trim();

         if (!name) {
            displayStatus("Error: Nama produk kustom wajib diisi!", "error");
            return;
        }
        if (isNaN(price) || price < 0) {
            displayStatus("Error: Harga jual kustom tidak valid!", "error");
            return;
        }
        if (isNaN(qty) || qty <= 0) {
            displayStatus("Error: Jumlah produk kustom tidak valid!", "error");
            return;
        }

        // Validate custom product code (if provided) against registered product IDs
        if (code) {
            const isCodeRegistered = products.some(p => p.id.toLowerCase() === code.toLowerCase());
            if (isCodeRegistered) {
                displayStatus("Error: Kode produk kustom tidak boleh sama dengan kode produk terdaftar.", "error");
                return;
            }
        }

        // No check for custom product name duplication with registered products, as requested.

        addProductToTransaction(code || 'custom', name, price, qty, true); // Pass true for isCustom
        // Clear custom product inputs after adding
        if (customProductCodeInput) customProductCodeInput.value = '';
        if (customProductNameInput) customProductNameInput.value = '';
        if (customProductPriceInput) customProductPriceInput.value = '0';
        if (customProductQtyInput) customProductQtyInput.value = '1';
        displayStatus("", ""); // Clear previous status
    });

    // Event listener for "Cetak Struk" button (now calls processAndPrintTransaction)
    if (printReceiptButton) printReceiptButton.addEventListener('click', processAndPrintTransaction);

    // Event listener for new "Proses Pembayaran" button
    if (processOnlyPaymentButton) {
        processOnlyPaymentButton.addEventListener('click', async function() { // Made async
            const transactionRecord = await createTransactionObjectAndDecrementStock(); // Validate and decrement stock
            if (transactionRecord) {
                await commitTransactionData(transactionRecord); // Commit if valid
            }
        });
    }

    // --- Admin Menu Dropdown Toggle ---
    if (adminMenuButton) {
        adminMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (adminMenuDropdown) {
                adminMenuDropdown.classList.toggle('hidden');
            } else {
                console.error('Admin menu dropdown element is null inside click handler!');
            }
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', (e) => {
            if (adminMenuDropdown && !adminMenuDropdown.contains(e.target) && !adminMenuButton.contains(e.target)) {
                adminMenuDropdown.classList.add('hidden');
            }
        });
    }

    // --- Store Products Modal Event Listeners ---
    if (openStoreProductsModalBtn) {
        openStoreProductsModalBtn.addEventListener('click', () => {
            // Check if admin is logged in before opening
            if (loggedInUser && loggedInUser.role === 'admin') {
                storeProductsModal.classList.remove('hidden');
                renderStoreProducts();
                adminMenuDropdown.classList.add('hidden');
            } else {
                displayStatus("Akses Ditolak: Anda harus login sebagai Admin untuk melihat Produk Toko.", "error");
                adminMenuDropdown.classList.add('hidden');
            }
        });
    }
    if (closeStoreProductsModalBtn) {
        closeStoreProductsModalBtn.addEventListener('click', closeStoreProductsModal);
    }
    // Delegation for edit and delete buttons within the table
    if (storeProductsTableBody) {
        storeProductsTableBody.addEventListener('click', (e) => {
            if (e.target.closest('.edit-product-btn')) {
                const productId = e.target.closest('.edit-product-btn').dataset.productId;
                editProduct(productId);
            } else if (e.target.closest('.delete-product-btn')) {
                const productId = e.target.closest('.delete-product-btn').dataset.productId;
                deleteProduct(productId);
            }
        });
    }
    // Event listener for search input in Store Products Modal
    if (searchStoreProductsInput) {
        searchStoreProductsInput.addEventListener('input', (e) => {
            renderStoreProducts(e.target.value);
        });
    }

    // --- Save Product Edit button event listener ---
    if (saveProductEditBtn) {
        saveProductEditBtn.addEventListener('click', saveProductEdit);
    }

    // --- Cancel Product Edit button event listener ---
    if (cancelProductEditBtn) {
        cancelProductEditBtn.addEventListener('click', () => {
            editProductForm.classList.add('hidden'); // Hide the form
            storeProductsTableContainer.classList.remove('hidden'); // Show the product list
            searchStoreProductsInput.classList.remove('hidden'); // Show search input
            displayStatus("", ""); // Clear status message
        });
    }


    // --- Add New Product Modal Event Listeners ---
    if (openAddProductModalBtn) {
        openAddProductModalBtn.addEventListener('click', () => {
            // Check if admin is logged in before opening
            if (loggedInUser && loggedInUser.role === 'admin') {
                addProductModal.classList.remove('hidden');
                adminMenuDropdown.classList.add('hidden');
                calculateProfit();
            } else {
                displayStatus("Akses Ditolak: Anda harus login sebagai Admin untuk menambah Produk Baru.", "error");
                adminMenuDropdown.classList.add('hidden');
            }
        });
    }
    if (closeAddProductModalBtn) {
        closeAddProductModalBtn.addEventListener('click', closeAddProductModal);
    }
    if (addProductCostInput) {
        addProductCostInput.addEventListener('input', calculateProfit);
    }
    if (addProductPriceInput) {
        addProductPriceInput.addEventListener('input', calculateProfit);
    }
    if (saveNewProductBtn) {
        saveNewProductBtn.addEventListener('click', addNewProduct);
    }
    if (cancelAddProductBtn) {
        cancelAddProductBtn.addEventListener('click', closeAddProductModal);
    }

    // --- Expenses Modal Event Listeners (New) ---
    if (openExpensesModalBtn) {
        openExpensesModalBtn.addEventListener('click', () => {
             // Check if admin is logged in before opening
             if (loggedInUser && loggedInUser.role === 'admin') {
                expensesModal.classList.remove('hidden');
                adminMenuDropdown.classList.add('hidden');
                expenseDateInput.value = new Date().toISOString().slice(0, 10); // Set default date to today
                expenseSearchInput.value = ''; // Clear search input
                expenseFilterStartDate.value = ''; // Clear date filters
                expenseFilterEndDate.value = ''; // Clear date filters
                renderExpenses(); // Render expenses when opening modal
            } else {
                displayStatus("Akses Ditolak: Anda harus login sebagai Admin untuk melihat Pengeluaran.", "error");
                adminMenuDropdown.classList.add('hidden');
            }
        });
    }
    if (closeExpensesModalBtn) {
        closeExpensesModalBtn.addEventListener('click', closeExpensesModal);
    }
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', addExpense);
    }
    // Delegate expense deletion
    if (expensesListBody) {
        expensesListBody.addEventListener('click', (e) => {
            if (e.target.closest('.delete-expense-btn')) {
                const expenseId = e.target.closest('.delete-expense-btn').dataset.expenseId;
                deleteExpense(expenseId);
            }
        });
    }
    // New: Event listeners for expense search and filter
    if (expenseSearchInput) {
        expenseSearchInput.addEventListener('input', renderExpenses);
    }
    if (applyExpenseFilterBtn) {
        applyExpenseFilterBtn.addEventListener('click', renderExpenses);
    }
    if (clearExpenseFilterBtn) {
        clearExpenseFilterBtn.addEventListener('click', () => {
            expenseFilterStartDate.value = '';
            expenseFilterEndDate.value = '';
            renderExpenses(); // Re-render with cleared date filters
        });
    }


    // --- Financial Report Modal Event Listeners ---
    if (openFinancialReportModalBtn) {
        openFinancialReportModalBtn.addEventListener('click', () => {
            // Check if admin is logged in before opening
            if (loggedInUser && loggedInUser.role === 'admin') {
                financialReportModal.classList.remove('hidden');
                adminMenuDropdown.classList.add('hidden');
                calculateFinancialReport();
            } else {
                displayStatus("Akses Ditolak: Anda harus login sebagai Admin untuk melihat Laporan Keuangan.", "error");
                adminMenuDropdown.classList.add('hidden');
            }
        });
    }
    if (closeFinancialReportModalBtn) {
        closeFinancialReportModalBtn.addEventListener('click', () => {
            financialReportModal.classList.add('hidden');
            if (financialReportMessageBox) {
                financialReportMessageBox.classList.add('hidden');
                financialReportMessageBox.textContent = '';
            }
            displayStatus("", ""); // Clear main status message
        });
    }
    if (applyFinancialFilterBtn) {
        applyFinancialFilterBtn.addEventListener('click', calculateFinancialReport);
    }
    if (clearFinancialFilterBtn) {
        clearFinancialFilterBtn.addEventListener('click', () => {
            reportStartDateInput.value = '';
            reportEndDateInput.value = '';
            calculateFinancialReport(); // Re-run with empty filters
        });
    }

    // --- Transaction History Functions ---
    if (openTransactionHistoryBtn) {
        openTransactionHistoryBtn.addEventListener('click', () => {
            transactionHistoryModal.classList.remove('hidden');
            transactionDetailSection.classList.add('hidden');
            if (transactionHistoryTableBody && transactionHistoryTableBody.parentElement) {
                transactionHistoryTableBody.parentElement.classList.remove('hidden');
            }
            if (historyFilterControls) {
                historyFilterControls.classList.remove('hidden');
            }
            totalTransactionsAmount.parentElement.classList.remove('hidden'); // Show total transactions amount
            historyStartDateInput.value = '';
            historyEndDateInput.value = '';
            renderTransactionHistory();
        });
    }
    if (closeTransactionHistoryModalBtn) {
        closeTransactionHistoryModalBtn.addEventListener('click', () => {
            transactionHistoryModal.classList.add('hidden');
            displayStatus("", "");
        });
    }
    if (applyHistoryFilterBtn) {
        applyHistoryFilterBtn.addEventListener('click', () => {
            renderTransactionHistory(historyStartDateInput.value, historyEndDateInput.value);
        });
    }
    if (clearHistoryFilterBtn) {
        clearHistoryFilterBtn.addEventListener('click', () => {
            historyStartDateInput.value = '';
            historyEndDateInput.value = '';
            renderTransactionHistory();
        });
    }
    // Delegation for detail and delete buttons within the transaction history table
    if (transactionHistoryTableBody) {
        transactionHistoryTableBody.addEventListener('click', (e) => {
            if (e.target.closest('.view-detail-btn')) {
                const transactionId = e.target.closest('.view-detail-btn').dataset.transactionId;
                viewTransactionDetails(transactionId);
            } else if (e.target.closest('.delete-transaction-btn')) {
                const transactionId = e.target.closest('.delete-transaction-btn').dataset.transactionId;
                deleteTransaction(transactionId);
            }
        });
    }
    if (closeTransactionDetailBtn) {
        closeTransactionDetailBtn.addEventListener('click', closeTransactionDetails);
    }
    // NEW: Event listener for reprint receipt button in transaction detail
    if (reprintReceiptBtn) {
        reprintReceiptBtn.addEventListener('click', async () => { // Made async
            const transactionId = reprintReceiptBtn.dataset.transactionId;
            if (transactionId) {
                await reprintTransactionReceipt(transactionId);
            } else {
                displayStatus("Error: Tidak ada ID transaksi untuk dicetak ulang.", "error");
            }
        });
    }


    // --- Data Import/Export & Reset Event Listeners ---
    if (exportProductsBtn) {
        exportProductsBtn.addEventListener('click', exportProducts);
    }
    if (importProductsBtn) {
        importProductsBtn.addEventListener('click', () => {
            importProductsFileInput.click();
        });
    }
    if (importProductsFileInput) {
        importProductsFileInput.addEventListener('change', importProducts);
    }

    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportAllData);
    }
    if (importDataBtn) {
        importDataBtn.addEventListener('click', () => {
            importFileInput.click();
        });
    }
    if (importFileInput) {
        importFileInput.addEventListener('change', importAllData);
    }
    // Modified resetAllDataBtn to open the new reset confirmation modal
    if (resetAllDataBtn) {
        resetAllDataBtn.addEventListener('click', openResetDataConfirmation);
    }

    // --- Confirmation Modal Event Listeners --
    if (confirmOkBtn) {
        confirmOkBtn.addEventListener('click', () => {
            confirmationModal.classList.add('hidden');
            if (confirmPromiseResolve) confirmPromiseResolve(true);
        });
    }
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', () => {
            confirmationModal.classList.add('hidden');
            if (confirmPromiseResolve) confirmPromiseResolve(false);
        });
    }

    // New: Reset Data Modal Event Listeners
    if (resetDataConfirmBtn) {
        resetDataConfirmBtn.addEventListener('click', async () => { // Made async
            const enteredPassword = resetPasswordInput.value;
            if (enteredPassword === RESET_PASSWORD) {
                await performResetAllData(); // Call the actual reset function
                resetDataModal.classList.add('hidden');
                displayStatus("Semua data aplikasi telah direset!", "success");
            } else {
                displayStatus("Kata sandi salah. Reset data dibatalkan.", "error", resetDataMessage);
            }
        });
    }
    if (resetDataCancelBtn) {
        resetDataCancelBtn.addEventListener('click', () => {
            resetDataModal.classList.add('hidden');
            displayStatus("Reset data dibatalkan.", "info");
        });
    }


    // --- Toggle Daily Revenue Visibility Event Listener ---
    if (toggleDailyRevenueVisibilityButton) {
        toggleDailyRevenueVisibilityButton.addEventListener('click', async () => { // Made async
            isRevenueVisible = !isRevenueVisible; // Toggle the state
            await saveAppSettingsToFirestore(); // Save the new state
            updateHeaderDailyRevenue(); // Update display
        });
    }

    // --- User Settings Modal Event Listeners (New) ---
    if (openUserSettingsModalBtn) {
        openUserSettingsModalBtn.addEventListener('click', openUserSettingsModal);
    }
    if (closeUserSettingsModalBtn) {
        closeUserSettingsModalBtn.addEventListener('click', closeUserSettingsModal);
    }
    // Event listener for the main login button on the initial login screen
    if (loginScreenBtn) {
        loginScreenBtn.addEventListener('click', loginUser);
    }
    // Event listener for login button INSIDE the user settings modal
    if (userSettingsLoginButton) {
        userSettingsLoginButton.addEventListener('click', userSettingsLogin);
    }
    if (logoutButton) { // Event listener for the main logout button in the header
        logoutButton.addEventListener('click', logoutUser);
    }
    if (addUserButton) {
        addUserButton.addEventListener('click', addNewUser);
    }
    // Delegate user deletion
    if (userListBody) {
        userListBody.addEventListener('click', (e) => {
            if (e.target.closest('.delete-user-btn')) {
                const username = e.target.closest('.delete-user-btn').dataset.username;
                deleteUser(username);
            }
        });
    }

    // New: Dark Mode Toggle Event Listener
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', async () => { // Made async
            isDarkMode = !isDarkMode;
            await saveAppSettingsToFirestore(); // Save the new state to Firestore
            applyDarkMode(); // Apply/remove dark-mode class
            // Re-render components that need immediate style updates based on dark mode
            renderTransactionItems(); // To update item list background/text
            renderStoreProducts(searchStoreProductsInput.value); // To update product table
            renderExpenses(); // To update expenses table
            calculateFinancialReport(); // To update chart colors
        });
    }

    // --- Printer Settings Event Listeners (New) ---
    if (openPrinterSettingsBtn) {
        openPrinterSettingsBtn.addEventListener('click', () => {
            printerSettingsModal.classList.remove('hidden');
            adminMenuDropdown.classList.add('hidden'); // Close admin menu if open
            // Ensure printer status is updated when modal opens
            if (bluetoothPrinterDevice && bluetoothPrinterDevice.gatt.connected) {
                updatePrinterConnectionStatus(`Terhubung ke: ${bluetoothPrinterDevice.name || bluetoothPrinterDevice.id}`, true);
            } else {
                updatePrinterConnectionStatus("Silahkan sambungkan printer", false);
            }
        });
    }
    if (closePrinterSettingsModalBtn) {
        closePrinterSettingsModalBtn.addEventListener('click', () => {
            printerSettingsModal.classList.add('hidden');
        });
    }
    if (connectPrinterBtn) {
        connectPrinterBtn.addEventListener('click', connectPrinter);
    }
    if (disconnectPrinterBtn) {
        disconnectPrinterBtn.addEventListener('click', disconnectPrinter);
    }
    if (testPrintBtn) {
        testPrintBtn.addEventListener('click', testPrint);
    }

    // --- Price Calculator Event Listeners (NEW) ---
    if (openPriceCalculatorModalBtn) {
        openPriceCalculatorModalBtn.addEventListener('click', openPriceCalculatorModal);
    }
    if (closePriceCalculatorModalBtn) {
        closePriceCalculatorModalBtn.addEventListener('click', closePriceCalculatorModal);
    }
    if (calculatePriceBtn) {
        calculatePriceBtn.addEventListener('click', calculateSellingPriceAndProfit);
    }
    // Live calculation as inputs change
    if (priceCalcModalInput) priceCalcModalInput.addEventListener('input', calculateSellingPriceAndProfit);
    if (priceCalcMarginPercentInput) priceCalcMarginPercentInput.addEventListener('input', calculateSellingPriceAndProfit);
    if (priceCalcTaxPercentInput) priceCalcTaxPercentInput.addEventListener('input', calculateSellingPriceAndProfit);
    if (priceCalcDiscountPercentInput) priceCalcDiscountPercentInput.addEventListener('input', calculateSellingPriceAndProfit);
    if (priceCalcProductCodeInput) {
        priceCalcProductCodeInput.addEventListener('input', calculateSellingPriceAndProfit); // To trigger validation message
    }

    // Copy buttons
    if (copyProductCodeBtn) {
        copyProductCodeBtn.addEventListener('click', () => {
            copyTextToClipboard(priceCalcProductCodeInput.value, priceCalcStatusMessage);
        });
    }
    if (copySellingPriceBtn) {
        copySellingPriceBtn.addEventListener('click', () => {
            // Remove "Rp " and commas for copying just the number
            const sellingPriceNum = priceCalcSellingPriceInput.value.replace(/[^0-9]/g, '');
            copyTextToClipboard(sellingPriceNum, priceCalcStatusMessage);
        });
    }

    // --- NEW: Nominal Quick Pay Buttons Event Listener ---
    if (nominalButtonsContainer) {
        nominalButtonsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('nominal-btn')) {
                const nominalValue = parseInt(e.target.dataset.nominal);
                if (!isNaN(nominalValue)) {
                    // Get current payment amount, or 0 if empty/invalid
                    let currentPayment = parseFloat(paymentAmountInput.value) || 0;
                    // Add the nominal value to the current payment amount
                    paymentAmountInput.value = currentPayment + nominalValue;
                    calculateChange(); // Recalculate change after setting nominal
                }
            }
        });
    }

});

// Removed window.addEventListener('beforeunload') because all data is handled by Firestore now
// and automatic saving on unload is not necessary; explicit saves are done after operations.
// The printer ID is handled by saveAppSettingsToFirestore.
