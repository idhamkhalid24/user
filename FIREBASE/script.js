(function() { // Seluruh script dibungkus dalam IIFE (Immediately Invoked Function Expression)
    // Ini membantu mencegah masalah deklarasi ulang variabel global jika script dimuat lebih dari sekali.

    // --- Data Variables (Akan sebagian besar digantikan oleh data dari Firestore) ---
    // Variabel ini akan menyimpan data yang dimuat dari Firestore secara real-time
    let products = [];
    let currentTransactionItems = [];
    let transactionHistory = [];
    let expenses = [];
    let users = []; // Data pengguna dari Firestore
    let loggedInUser = null; // Pengguna yang sedang login (data dari Firestore dan Firebase Auth)
    let currentTransactionMode = 'registered';

    // Variabel untuk data keuangan harian dan bulanan, akan disimpan di Firestore per user
    let dailyRevenue = 0;
    let lastRecordedDate = ''; // Format:YYYY-MM-DD
    let isRevenueVisible = true; // State untuk visibilitas pendapatan
    let isDarkMode = false; // State untuk mode gelap

    let monthlyNetProfit = 0;
    let monthlyExpenses = 0;
    let lastRecordedMonth = ''; // Format:YYYY-MM

    // Bluetooth Printer variables (tetap pakai lokal/session storage, tidak ke Firebase)
    let bluetoothPrinterDevice = null;
    let printerCharacteristic = null;

    // --- Firebase Instances (Didapatkan dari window yang diekspos oleh index.html) ---
    // Variabel ini dideklarasikan di sini dan akan diisi di dalam DOMContentLoaded
    // dari variabel global yang disediakan oleh lingkungan Canvas/Firebase.
    let auth;
    let db;
    let appId; // ID aplikasi dari Canvas environment
    let firebaseFunctions; // Semua fungsi Firebase yang diekspor

    // --- DOM Elements (Declared here, assigned on DOMContentLoaded) ---
    // (Deklarasi DOM elements tetap sama)
    let loginScreen;
    let mainAppContainer;
    let loginScreenUsernameInput;
    let loginScreenPasswordInput;
    let loginScreenBtn;
    let loginScreenMessage;
    let itemList;
    let totalAmountInput;
    let discountAmountInput;
    let paymentAmountInput;
    let paymentMethodSelect;
    let changeAmountHeader;
    let statusElement;
    let newTransactionButton;
    let printReceiptButton;
    let processOnlyPaymentButton;
    let noItemsMessage;
    let headerDateTime;
    let headerDailyRevenue;
    let headerDailyRevenueAmountContainer;
    let toggleDailyRevenueVisibilityButton;
    let eyeIcon;
    let eyeSlashIcon;
    let cashierDisplay;
    let cashierRole;
    let logoutButton;
    let darkModeToggle;
    let monthlyFinancialBarContainer;
    let monthlyProfitBar;
    let monthlyExpenseBar;
    let productCodeInput;
    let productNameInput;
    let priceInput;
    let quantityInput;
    let addRegisteredItemButton;
    let customProductCodeInput;
    let customProductNameInput;
    let customProductPriceInput;
    let customProductQtyInput;
    let addCustomItemButton;
    let showRegisteredProductsButton;
    let showCustomProductsButton;
    let customProductSection;
    let registeredProductSection;
    let adminMenuButton;
    let adminMenuDropdown;
    let openStoreProductsModalBtn;
    let openAddProductModalBtn;
    let openFinancialReportModalBtn;
    let openExpensesModalBtn;
    let openUserSettingsModalBtn;
    let openPriceCalculatorModalBtn;
    let exportProductsBtn;
    let importProductsFileInput;
    let importProductsBtn;
    let exportDataBtn;
    let importFileInput;
    let importDataBtn;
    let resetAllDataBtn;
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
    let reprintReceiptBtn;
    let historyFilterControls;
    let totalTransactionsAmount;
    let confirmationModal;
    let confirmationMessage;
    let confirmOkBtn;
    let confirmCancelBtn;
    let confirmPromiseResolve;
    let userSettingsModal;
    let closeUserSettingsModalBtn;
    let userSettingsLoginSection;
    let userSettingsLoginUsernameInput;
    let userSettingsLoginPasswordInput;
    let userSettingsLoginButton;
    let userSettingsLoginStatusMessage;
    let userManagementSection;
    let newUserNameInput;
    let newUserPasswordInput;
    let newUserRoleSelect;
    let addUserButton;
    let addUserStatusMessage;
    let userListBody;
    let emptyUserMessage;
    let openPrinterSettingsBtn;
    let printerSettingsModal;
    let closePrinterSettingsModalBtn;
    let printerStatus;
    let connectPrinterBtn;
    let disconnectPrinterBtn;
    let testPrintBtn;
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
    let nominalButtonsContainer;
    let nominalButtons;
    let coinSoundAudio;
    let resetDataModal;
    let resetPasswordInput;
    let resetDataConfirmBtn;
    let resetDataCancelBtn;
    let resetDataMessage;
    let cleanupUsersBtn; // NEW: Tombol untuk cleanup user

    // --- Data Storage Keys (Digunakan untuk localStorage printer ID) ---
    const LOCAL_STORAGE_PRINTER_ID_KEY = 'pos_bluetooth_printer_id';

    // --- Fungsi Helper untuk mendapatkan UID user yang sedang login ---
    // Ini penting untuk membuat path Firestore yang aman per user
    function getCurrentUserId() {
        return auth.currentUser ? auth.currentUser.uid : null;
    }

    // --- General Utility Functions ---
    // (Fungsi displayStatus, updateHeaderDailyRevenue, checkAndResetDailyRevenue, renderMonthlyFinancialBar,
    // copyTextToClipboard, playCoinSound tetap sama atau sedikit disesuaikan)

    function displayStatus(message, type, element = statusElement) {
        if (!element) return;
        element.textContent = message;
        let bgColorClass, textColorClass;
        if (isDarkMode) {
            bgColorClass = type === 'success' ? 'bg-green-700' :
                           type === 'error' ? 'bg-red-700' :
                           'bg-blue-700';
            textColorClass = type === 'success' ? 'text-green-200' :
                             type === 'error' ? 'text-red-200' :
                             'text-blue-200';
        } else {
            bgColorClass = type === 'success' ? 'bg-green-100' :
                           type === 'error' ? 'bg-red-100' :
                           'bg-blue-100';
            textColorClass = type === 'success' ? 'text-green-800' :
                             type === 'error' ? 'text-red-700' :
                             'text-blue-800';
        }
        element.className = `mt-4 p-3 text-center rounded-md text-sm ${bgColorClass} ${textColorClass}`;
        element.classList.remove('hidden');
    }

    function updateHeaderDailyRevenue() {
        if (headerDailyRevenue) {
            headerDailyRevenue.textContent = dailyRevenue.toLocaleString('id-ID');
        }
        if (headerDailyRevenueAmountContainer) {
            headerDailyRevenueAmountContainer.style.visibility = isRevenueVisible ? 'visible' : 'hidden';
        }
        if (eyeIcon && eyeSlashIcon) {
            eyeIcon.classList.toggle('hidden', !isRevenueVisible);
            eyeSlashIcon.classList.toggle('hidden', isRevenueVisible);
        }
    }

    // Mengambil tanggal hari ini dalam formatYYYY-MM-DD
    function getTodayDateString() {
        return new Date().toISOString().slice(0, 10);
    }

    // Mengambil bulan ini dalam formatYYYY-MM
    function getThisMonthString() {
        return new Date().toISOString().slice(0, 7);
    }

    // Memuat data keuangan harian dari Firestore
    async function loadDailyRevenueFromFirestore() {
        const userId = getCurrentUserId();
        if (!userId) {
            dailyRevenue = 0;
            lastRecordedDate = '';
            return;
        }
        try {
            const docRef = firebaseFunctions.doc(db, `artifacts/${appId}/users/${userId}/financialSummary/daily`);
            const docSnap = await firebaseFunctions.getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                dailyRevenue = data.revenue || 0;
                lastRecordedDate = data.lastDate || '';
            } else {
                dailyRevenue = 0;
                lastRecordedDate = '';
            }
            console.log(`[Firestore Load] Loaded daily revenue for ${userId}: ${dailyRevenue}, last date: ${lastRecordedDate}`);
        } catch (error) {
            console.error("Gagal memuat pendapatan harian dari Firestore:", error);
            dailyRevenue = 0;
            lastRecordedDate = '';
        }
    }

    // Menyimpan data keuangan harian ke Firestore
    async function saveDailyRevenueToFirestore() {
        const userId = getCurrentUserId();
        if (!userId) return;
        try {
            const docRef = firebaseFunctions.doc(db, `artifacts/${appId}/users/${userId}/financialSummary/daily`);
            await firebaseFunctions.setDoc(docRef, { revenue: dailyRevenue, lastDate: lastRecordedDate }, { merge: true });
            console.log(`[Firestore Save] Saved daily revenue for ${userId}: ${dailyRevenue}, last date: ${lastRecordedDate}`);
        } catch (error) {
            console.error("Gagal menyimpan pendapatan harian ke Firestore:", error);
        }
    }

    // Memuat data keuangan bulanan dari Firestore
    async function loadMonthlyFinancialDataFromFirestore() {
        const userId = getCurrentUserId();
        if (!userId) {
            monthlyNetProfit = 0;
            monthlyExpenses = 0;
            lastRecordedMonth = '';
            return;
        }
        try {
            const docRef = firebaseFunctions.doc(db, `artifacts/${appId}/users/${userId}/financialSummary/monthly`);
            const docSnap = await firebaseFunctions.getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                monthlyNetProfit = data.netProfit || 0;
                monthlyExpenses = data.expenses || 0;
                lastRecordedMonth = data.lastMonth || '';
            } else {
                monthlyNetProfit = 0;
                monthlyExpenses = 0;
                lastRecordedMonth = '';
            }
            console.log(`[Firestore Load] Loaded monthly financial data for ${userId}: NetProfit=${monthlyNetProfit}, Expenses=${monthlyExpenses}, last month: ${lastRecordedMonth}`);
        } catch (error) {
            console.error("Gagal memuat data keuangan bulanan dari Firestore:", error);
            monthlyNetProfit = 0;
            monthlyExpenses = 0;
            lastRecordedMonth = '';
        }
    }

    // Menyimpan data keuangan bulanan ke Firestore
    async function saveMonthlyFinancialDataToFirestore() {
        const userId = getCurrentUserId();
        if (!userId) return;
        try {
            const docRef = firebaseFunctions.doc(db, `artifacts/${appId}/users/${userId}/financialSummary/monthly`);
            await firebaseFunctions.setDoc(docRef, { netProfit: monthlyNetProfit, expenses: monthlyExpenses, lastMonth: lastRecordedMonth }, { merge: true });
            console.log(`[Firestore Save] Saved monthly financial data for ${userId}: NetProfit=${monthlyNetProfit}, Expenses=${monthlyExpenses}, last month: ${lastRecordedMonth}`);
        } catch (error) {
            console.error("Gagal menyimpan data keuangan bulanan ke Firestore:", error);
        }
    }

    // Checks if the date has changed and resets daily revenue if so.
    // Also checks if the month has changed and resets monthly financial data.
    async function checkAndResetDailyRevenue() {
        const today = getTodayDateString();
        const thisMonth = getThisMonthString();

        await loadDailyRevenueFromFirestore(); // Pastikan data harian terbaru dimuat
        await loadMonthlyFinancialDataFromFirestore(); // Pastikan data bulanan terbaru dimuat

        if (lastRecordedDate !== today) {
            console.log(`Date changed from ${lastRecordedDate} to ${today}. Resetting daily revenue.`);
            dailyRevenue = 0;
            lastRecordedDate = today;
            await saveDailyRevenueToFirestore();
            displayStatus("Pendapatan harian direset untuk hari baru.", "info");
        }
        updateHeaderDailyRevenue();

        if (lastRecordedMonth !== thisMonth) {
            console.log(`Month changed from ${lastRecordedMonth} to ${thisMonth}. Resetting monthly financial data.`);
            monthlyNetProfit = 0;
            monthlyExpenses = 0;
            lastRecordedMonth = thisMonth;
            await saveMonthlyFinancialDataToFirestore();
        }
        renderMonthlyFinancialBar();
    }

    function renderMonthlyFinancialBar() {
        if (!monthlyProfitBar || !monthlyExpenseBar || !monthlyFinancialBarContainer) return;

        // Pastikan nilai adalah numerik dan tidak negatif
        const currentProfit = Math.max(0, monthlyNetProfit);
        const currentExpenses = Math.max(0, monthlyExpenses);
        const combinedTotal = currentProfit + currentExpenses;

        let profitWidth = 0;
        let expenseWidth = 0;

        if (combinedTotal > 0) {
            profitWidth = (currentProfit / combinedTotal) * 100;
            expenseWidth = (currentExpenses / combinedTotal) * 100;
        }

        monthlyProfitBar.style.width = `${profitWidth}%`;
        monthlyExpenseBar.style.width = `${expenseWidth}%`;

        monthlyProfitBar.classList.remove('rounded-l-full', 'rounded-r-full', 'rounded-full');
        monthlyExpenseBar.classList.remove('rounded-l-full', 'rounded-r-full', 'rounded-full');

        if (profitWidth > 0 && expenseWidth > 0) {
            monthlyProfitBar.classList.add('rounded-l-full');
            monthlyExpenseBar.classList.add('rounded-r-full');
        } else if (profitWidth > 0) {
            monthlyProfitBar.classList.add('rounded-full');
        } else if (expenseWidth > 0) {
            monthlyExpenseBar.classList.add('rounded-full');
        }

        if (profitWidth === 0 && expenseWidth === 0) {
            monthlyFinancialBarContainer.style.backgroundColor = '#ccc';
        } else {
            monthlyFinancialBarContainer.style.backgroundColor = 'transparent';
        }
    }

    function copyTextToClipboard(text, successMessageElement) {
        if (!navigator.clipboard) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                displayStatus("Berhasil disalin!", "success", successMessageElement);
            } catch (error) {
                console.error('Gagal menyalin: ', error);
                displayStatus("Gagal menyalin teks.", "error", successMessageElement);
            }
            document.body.removeChild(textArea);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            displayStatus("Berhasil disalin!", "success", successMessageElement);
        }).catch(function(error) {
            console.error('Gagal menyalin: ', error);
            displayStatus("Gagal menyalin teks.", "error", successMessageElement);
        });
    }

    function playCoinSound() {
        if (coinSoundAudio) {
            coinSoundAudio.play().catch(error => console.error("Error playing sound:", error));
        }
    }

    // Fungsi untuk membuat profil pengguna di Firestore setelah Auth berhasil
    async function createUserProfileInFirestore(uid, username, role) {
        // Pastikan username dan role tidak undefined saat disimpan
        const finalUsername = username || `user_${uid.substring(0, 8)}`; // Fallback jika username kosong
        const finalRole = role || 'cashier'; // Fallback jika role kosong
        try {
            const userDocRef = firebaseFunctions.doc(db, `users/${uid}`);
            await firebaseFunctions.setDoc(userDocRef, {
                username: finalUsername,
                role: finalRole,
                createdAt: firebaseFunctions.serverTimestamp()
            });
            console.log(`[Firestore] User profile ${finalUsername} (${uid}) created with role: ${finalRole}.`);
        } catch (error) {
            console.error("Error membuat profil user di Firestore:", error);
        }
    }

    // --- Core Application Logic ---

    // Memuat produk dari Firestore secara real-time
    async function loadProductsFromFirestore() {
        const userId = getCurrentUserId();
        if (!userId) {
            products = [];
            renderStoreProducts(); // Render kosong jika tidak ada user
            return;
        }
        const productsColRef = firebaseFunctions.collection(db, `artifacts/${appId}/products`);
        firebaseFunctions.onSnapshot(productsColRef, (snapshot) => {
            products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("[Firestore Load] Produk dimuat dari Firestore:", products);
            renderStoreProducts(searchStoreProductsInput ? searchStoreProductsInput.value : ''); // Re-render table when data changes
        }, (error) => {
            console.error("Error memuat produk dari Firestore:", error);
            displayStatus("Error: Gagal memuat produk dari server.", "error");
        });
    }

    // Memuat riwayat transaksi dari Firestore secara real-time
    async function loadTransactionHistoryFromFirestore() {
        const userId = getCurrentUserId();
        if (!userId) {
            transactionHistory = [];
            renderTransactionHistory();
            return;
        }
        const transactionsColRef = firebaseFunctions.collection(db, `artifacts/${appId}/transactions`);
        const q = firebaseFunctions.query(transactionsColRef, firebaseFunctions.where("userId", "==", userId)); // Filter by userId

        firebaseFunctions.onSnapshot(q, (snapshot) => {
            transactionHistory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("[Firestore Load] Riwayat transaksi dimuat dari Firestore:", transactionHistory);
            renderTransactionHistory(historyStartDateInput.value, historyEndDateInput.value); // Re-render table when data changes
        }, (error) => {
            console.error("Error memuat riwayat transaksi dari Firestore:", error);
            displayStatus("Error: Gagal memuat riwayat transaksi dari server.", "error");
        });
    }

    // Memuat pengeluaran dari Firestore secara real-time
    async function loadExpensesFromFirestore() {
        const userId = getCurrentUserId();
        if (!userId) {
            expenses = [];
            renderExpenses();
            return;
        }
        const expensesColRef = firebaseFunctions.collection(db, `artifacts/${appId}/expenses`);
        const q = firebaseFunctions.query(expensesColRef, firebaseFunctions.where("userId", "==", userId)); // Filter by userId

        firebaseFunctions.onSnapshot(q, (snapshot) => {
            expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("[Firestore Load] Pengeluaran dimuat dari Firestore:", expenses);
            renderExpenses(); // Re-render table when data changes
        }, (error) => {
            console.error("Error memuat pengeluaran dari Firestore:", error);
            displayStatus("Error: Gagal memuat pengeluaran dari server.", "error");
        });
    }

    // Memuat data user dari Firestore (untuk informasi role dll)
    async function loadUserDataFromFirestore(uid) {
        try {
            const userDocRef = firebaseFunctions.doc(db, `users/${uid}`); // User profile disimpan di collection 'users'
            const userDocSnap = await firebaseFunctions.getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const data = userDocSnap.data();
                // Pastikan username dan role selalu string, dengan fallback jika kosong
                const username = data.username || `user_${uid.substring(0, 8)}`;
                const role = data.role || 'cashier'; // Default ke 'cashier' jika role kosong
                return { uid: userDocSnap.id, username: username, role: role };
            }
            console.log(`[Firestore Load] No user profile found for UID: ${uid}`);
            return null;
        } catch (error) {
            console.error("Error memuat data pengguna dari Firestore:", error);
            return null;
        }
    }

    // Menambahkan produk ke daftar transaksi (di memory saja)
    function addProductToTransaction(id, name, price, qty, isCustom = false) {
        const finalId = isCustom ? 'custom-' + Date.now() : id;
        const existingItemIndex = currentTransactionItems.findIndex(item => item.productId === finalId && !isCustom);
        const productData = products.find(p => p.id === id);

        if (!isCustom && productData && productData.stock !== undefined) {
            const currentQtyInCart = existingItemIndex > -1 ? currentTransactionItems[existingItemIndex].qty : 0;
            const newTotalQty = currentQtyInCart + qty;

            if (productData.stock < newTotalQty) {
                displayStatus(`Error: Stok ${productData.name} tidak cukup. Stok tersedia: ${productData.stock}`, "error");
                return;
            }
        }

        if (existingItemIndex > -1) {
            currentTransactionItems[existingItemIndex].qty += qty;
        } else {
            currentTransactionItems.push({
                productId: finalId,
                name: name,
                qty: qty,
                price: price,
                cost: isCustom ? (price * 0.8) : (productData?.cost || 0),
                isCustom: isCustom
            });
        }
        renderTransactionItems();
    }

    // Merender item dalam daftar transaksi dan memperbarui total.
    function renderTransactionItems() {
        if (!itemList || !noItemsMessage || !totalAmountInput) return;

        itemList.innerHTML = '';
        let subtotal = 0;

        if (currentTransactionItems.length === 0) {
            noItemsMessage.classList.remove('hidden');
            itemList.appendChild(noItemsMessage);
        } else {
            noItemsMessage.classList.add('hidden');
            currentTransactionItems.forEach((item, index) => {
                const itemDiv = document.createElement('div');
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

        const discount = parseFloat(discountAmountInput.value) || 0;
        const finalTotal = subtotal - discount;
        totalAmountInput.value = `Rp ${finalTotal.toLocaleString('id-ID')}`;
        calculateChange();
        updateHeaderDateTime();
        updateCashierDisplay();
    }

    function calculateChange() {
        if (!totalAmountInput || !paymentAmountInput || !changeAmountHeader) return;
        const total = parseFloat(totalAmountInput.value.replace(/[^0-9,-]+/g, "").replace(",", ".")) || 0;
        const payment = parseFloat(paymentAmountInput.value) || 0;
        const change = payment - total;
        changeAmountHeader.textContent = `Rp ${(change > 0 ? change : 0).toLocaleString('id-ID')}`;
    }

    function updateHeaderDateTime() {
        if (!headerDateTime) return;
        const now = new Date();
        const options = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        };
        headerDateTime.textContent = now.toLocaleDateString('id-ID', options);
    }

    function updateCashierDisplay() {
        if (!cashierDisplay || !cashierRole || !adminMenuButton) return;
        if (loggedInUser) {
            cashierDisplay.textContent = loggedInUser.username;
            cashierRole.textContent = loggedInUser.role;
            console.log(`[UI Update] Logged in user: ${loggedInUser.username}, Role: ${loggedInUser.role}`);
            if (loggedInUser.role === 'admin') {
                adminMenuButton.classList.remove('hidden');
                console.log("[UI Update] Admin menu button should be visible.");
            } else {
                adminMenuButton.classList.add('hidden');
                adminMenuDropdown.classList.add('hidden'); // Sembunyikan dropdown juga
                console.log("[UI Update] Admin menu button should be hidden.");
            }
        } else {
            cashierDisplay.textContent = 'Tidak Login';
            cashierRole.textContent = '';
            adminMenuButton.classList.add('hidden');
            adminMenuDropdown.classList.add('hidden');
            console.log("[UI Update] User not logged in, admin menu hidden.");
        }
    }

    function startNewTransaction() {
        currentTransactionItems = [];
        if (paymentAmountInput) paymentAmountInput.value = '0';
        if (discountAmountInput) discountAmountInput.value = '0';
        if (changeAmountHeader) changeAmountHeader.textContent = 'Rp 0';
        if (paymentMethodSelect) paymentMethodSelect.value = "Tunai";

        renderTransactionItems();

        if (document.getElementById('transactionNumber')) document.getElementById('transactionNumber').value = 'TRX-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        displayStatus("", "");
        updateHeaderDateTime();
        updateCashierDisplay();
        updateHeaderDailyRevenue();
        renderMonthlyFinancialBar();
        if (productCodeInput) productCodeInput.value = '';
        if (productNameInput) productNameInput.value = '';
        if (priceInput) priceInput.value = '0';
        if (quantityInput) quantityInput.value = '1';
        if (customProductCodeInput) customProductCodeInput.value = '';
        if (customProductNameInput) customProductNameInput.value = '';
        if (customProductPriceInput) customProductPriceInput.value = '0';
        if (customProductQtyInput) customProductQtyInput.value = '1';

        showSection('registered');
    }

    function showSection(mode) {
        currentTransactionMode = mode;
        if (registeredProductSection && customProductSection && showRegisteredProductsButton && showCustomProductsButton) {
            if (mode === 'registered') {
                registeredProductSection.classList.remove('hidden');
                customProductSection.classList.add('hidden');
                showRegisteredProductsButton.classList.add('bg-green-500', 'hover:bg-green-600');
                showRegisteredProductsButton.classList.remove('bg-gray-400', 'hover:bg-gray-500');
                showCustomProductsButton.classList.add('bg-gray-400', 'hover:bg-gray-500');
                showCustomProductsButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            } else {
                registeredProductSection.classList.add('hidden');
                customProductSection.classList.remove('hidden');
                showRegisteredProductsButton.classList.add('bg-gray-400', 'hover:bg-gray-500');
                showRegisteredProductsButton.classList.remove('bg-green-500', 'hover:bg-green-600');
                showCustomProductsButton.classList.add('bg-green-500', 'hover:bg-green-600');
                showCustomProductsButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            }
        }
    }

    async function createTransactionObjectAndDecrementStock() {
        const total = parseFloat(totalAmountInput.value.replace(/[^0-9,-]+/g, "").replace(",", ".")) || 0;
        const payment = parseFloat(paymentAmountInput.value) || 0;
        const discount = parseFloat(discountAmountInput.value) || 0;
        const paymentMethod = paymentMethodSelect.value;
        const userId = getCurrentUserId();

        if (!userId) {
            displayStatus("Error: Anda harus login untuk memproses transaksi!", "error");
            return null;
        }

        if (payment < total) {
            displayStatus("Error: Jumlah pembayaran kurang dari total!", "error");
            return null;
        }

        if (currentTransactionItems.length === 0) {
            displayStatus("Error: Tambahkan setidaknya satu item untuk memproses transaksi!", "error");
            return null;
        }

        let transactionGrossProfit = 0;
        const itemsToUpdateStock = [];

        // Calculate profit and prepare stock updates
        currentTransactionItems.forEach(item => {
            const itemTotal = item.qty * item.price;
            const itemCost = item.qty * item.cost;
            transactionGrossProfit += (itemTotal - itemCost);

            if (!item.productId.startsWith('custom-')) {
                const product = products.find(p => p.id === item.productId);
                if (product && product.stock !== undefined) {
                    // Check stock again before proceeding
                    const currentQtyInCart = currentTransactionItems.filter(i => i.productId === item.productId).reduce((sum, i) => sum + i.qty, 0); // Total qty for this product in current cart
                    // This check is already done in addProductToTransaction, but a final check here is good
                    if (product.stock < item.qty) { // This check should be based on `item.qty` against `product.stock`
                        displayStatus(`Error: Stok ${product.name} tidak cukup. Stok tersedia: ${product.stock}`, "error");
                        return null; // Return null to indicate failure
                    }
                    itemsToUpdateStock.push({ id: product.id, newStock: product.stock - item.qty });
                }
            }
        });

        // If any stock check failed, return null
        if (itemsToUpdateStock.length !== currentTransactionItems.filter(item => !item.productId.startsWith('custom-')).length) {
            // This check is a bit flawed if there are only custom items.
            // It means if itemsToUpdateStock is empty (all custom), it will not return null here.
            // Let's refine this to explicitly return null if any product was found but failed stock check.
            const registeredItemsInCart = currentTransactionItems.filter(item => !item.productId.startsWith('custom-'));
            for (const item of registeredItemsInCart) {
                const product = products.find(p => p.id === item.productId);
                if (product && product.stock !== undefined && product.stock < item.qty) {
                    return null; // A registered item has insufficient stock.
                }
            }
        }

        const transactionNetProfit = transactionGrossProfit - discount;

        const transactionRecord = {
            id: 'TRX-' + Date.now(),
            userId: userId, // Simpan UID user yang melakukan transaksi
            date: new Date().toISOString(),
            items: currentTransactionItems.map(item => ({ ...item })),
            subtotalAmount: currentTransactionItems.reduce((sum, item) => sum + (item.qty * item.price), 0),
            discountAmount: discount,
            totalAmount: total,
            paymentAmount: payment,
            changeAmount: payment - total,
            cashier: loggedInUser ? loggedInUser.username : 'Unknown', // Pastikan loggedInUser punya nilai (username tidak undefined)
            transactionNetProfit: transactionNetProfit,
            paymentMethod: paymentMethod
        };

        // Decrement stock in Firestore
        for (const item of itemsToUpdateStock) {
            try {
                const productDocRef = firebaseFunctions.doc(db, `artifacts/${appId}/products`, item.id);
                await firebaseFunctions.updateDoc(productDocRef, { stock: item.newStock });
                console.log(`[Firestore Update] Stock for product ${item.id} decremented to ${item.newStock}`);
            } catch (error) {
                console.error(`Error memperbarui stok produk ${item.id} di Firestore:`, error);
                displayStatus(`Error: Gagal memperbarui stok ${item.id}.`, "error");
                // If stock update fails, revert previous stock changes (if any) and abort transaction
                revertStockDecrement(currentTransactionItems); // Revert all items in current transaction
                return null;
            }
        }

        return transactionRecord;
    }

    // Fungsi untuk mengembalikan stok (jika print gagal atau transaksi tidak di-commit)
    async function revertStockDecrement(items) {
        for (const item of items) {
            if (!item.productId.startsWith('custom-')) {
                try {
                    const productDocRef = firebaseFunctions.doc(db, `artifacts/${appId}/products`, item.productId);
                    const productDocSnap = await firebaseFunctions.getDoc(productDocRef);
                    if (productDocSnap.exists()) {
                        const currentStock = productDocSnap.data().stock || 0;
                        await firebaseFunctions.updateDoc(productDocRef, { stock: currentStock + item.qty });
                    }
                } catch (error) {
                    console.error(`Error mengembalikan stok produk ${item.productId} di Firestore:`, error);
                }
            }
        }
        console.log("Stock reverted due to transaction not committed.");
    }

    // Fungsi untuk commit data transaksi (tambah ke history, update revenue) ke Firestore
    async function commitTransactionData(transactionRecord) {
        const userId = getCurrentUserId();
        if (!userId) return;

        try {
            // Simpan transaksi ke Firestore
            await firebaseFunctions.setDoc(firebaseFunctions.doc(db, `artifacts/${appId}/transactions`, transactionRecord.id), transactionRecord);
            console.log(`[Firestore Commit] Transaction ${transactionRecord.id} committed.`);

            // Perbarui daily revenue
            dailyRevenue += transactionRecord.totalAmount;
            await saveDailyRevenueToFirestore();
            updateHeaderDailyRevenue();

            // Perbarui monthly net profit
            monthlyNetProfit += transactionRecord.transactionNetProfit;
            await saveMonthlyFinancialDataToFirestore();
            renderMonthlyFinancialBar();

            displayStatus("Transaksi berhasil diproses!", "success");
            playCoinSound();
            startNewTransaction();
        } catch (error) {
            console.error("Error saat menyimpan transaksi atau memperbarui keuangan ke Firestore:", error);
            displayStatus("Error: Gagal menyimpan transaksi ke server. Stok akan dikembalikan.", "error");
            // Revert stock if transaction commit fails
            revertStockDecrement(transactionRecord.items);
        }
    }

    async function printReceiptContent(transactionRecord) {
        if (!bluetoothPrinterDevice || !printerCharacteristic) {
            displayStatus("Printer belum terhubung. Silakan hubungkan printer melalui Pengaturan Printer.", "error");
            printerSettingsModal.classList.remove('hidden');
            return false;
        }

        displayStatus("Mengirim struk ke printer...", "info");

        const companyName = "UNIX FASHION";
        const companyAddress = "cilebut-bogor";
        const companyPhone = "0851-7210-7731";

        const transactionNumber = transactionRecord.id;
        const cashier = transactionRecord.cashier;
        const paymentMethod = transactionRecord.paymentMethod;

        const total = transactionRecord.totalAmount;
        const payment = transactionRecord.paymentAmount;
        const change = transactionRecord.changeAmount;
        const discount = transactionRecord.discountAmount;
        const subtotalBeforeDiscount = transactionRecord.subtotalAmount;

        const now = new Date(transactionRecord.date);
        const dateTimeFormatted = now.toLocaleString('id-ID', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });

        try {
            const encoder = new TextEncoder();
            let printText = "";

            printText += centerText(companyName.toUpperCase()) + "\n";
            printText += centerText(companyAddress) + "\n";
            printText += centerText(companyPhone) + "\n";
            printText += "\n";

            printText += `No.Transaksi: ${transactionNumber}\n`;
            printText += `Kasir: ${cashier}\n`;
            printText += `Waktu: ${dateTimeFormatted}\n`;
            printText += "--------------------------------\n";

            for (let item of transactionRecord.items) {
                if (item.name && item.qty > 0) {
                    printText += `${item.name}\n`;
                    const itemSubtotal = item.qty * item.price;
                    printText += `  ${item.qty} pcs x ${item.price.toLocaleString('id-ID')}    Rp ${itemSubtotal.toLocaleString('id-ID')}\n`;
                }
            }
            printText += "--------------------------------\n";

            printText += `Subtotal :     Rp ${subtotalBeforeDiscount.toLocaleString('id-ID')}\n`;
            if (discount > 0) {
                printText += `Diskon   :     Rp ${discount.toLocaleString('id-ID')}\n`;
            }
            printText += `Total    :     Rp ${total.toLocaleString('id-ID')}\n`;
            printText += `Bayar    :     Rp ${payment.toLocaleString('id-ID')}\n`;
            printText += `Kembali  :     Rp ${change.toLocaleString('id-ID')}\n`;
            printText += `Metode   :     ${paymentMethod}\n`;
            printText += "\n";

            printText += centerText("Terimakasih sudah berbelanja") + "\n";
            printText += centerText("UNIX FASHION") + "\n";
            printText += "\n\n\n";

            await printerCharacteristic.writeValue(encoder.encode(printText));
            displayStatus("Struk berhasil dicetak!", "success");
            return true;

        } catch (error) {
            displayStatus(`Error saat mencetak: ${error.message}.`, "error");
            console.error("Printing error:", error);
            return false;
        }
    }

    async function processAndPrintTransaction() {
        const transactionRecord = await createTransactionObjectAndDecrementStock(); // Await this as it's now async
        if (!transactionRecord) {
            return;
        }

        const printSuccess = await printReceiptContent(transactionRecord);

        if (printSuccess) {
            await commitTransactionData(transactionRecord); // Await this as it's now async
        } else {
            await revertStockDecrement(transactionRecord.items); // Await this
        }
    }

    async function reprintTransactionReceipt(transactionId) {
        const userId = getCurrentUserId();
        if (!userId) {
            displayStatus("Error: Anda harus login untuk mencetak ulang transaksi.", "error");
            return;
        }
        const transactionDocRef = firebaseFunctions.doc(db, `artifacts/${appId}/transactions`, transactionId);
        try {
            const docSnap = await firebaseFunctions.getDoc(transactionDocRef);
            if (docSnap.exists() && docSnap.data().userId === userId) { // Pastikan user yang login punya hak akses ke transaksi ini
                const transactionToReprint = { id: docSnap.id, ...docSnap.data() };
                displayStatus("Mencetak ulang struk...", "info");
                await printReceiptContent(transactionToReprint);
            } else {
                displayStatus("Error: Transaksi tidak ditemukan atau Anda tidak memiliki akses.", "error");
            }
        } catch (error) {
            console.error("Error mencetak ulang transaksi dari Firestore:", error);
            displayStatus("Error: Gagal mencetak ulang transaksi dari server.", "error");
        }
    }

    function centerText(text, width = 32) {
        const padding = Math.max(0, width - text.length);
        const leftPadding = Math.floor(padding / 2);
        const rightPadding = padding - leftPadding;
        return " ".repeat(leftPadding) + text + " ".repeat(rightPadding);
    }


    // --- Store Products Functions ---

    function renderStoreProducts(searchTerm = '') {
        if (!storeProductsTableBody) return;
        storeProductsTableBody.innerHTML = '';

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

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
            const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-50';
            const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
            const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-200';

            row.className = hoverClass;
            row.innerHTML = `
            <td class="py-2 px-4 border-b ${borderColor} ${textClass}">${product.id}</td>
            <td class="py-2 px-4 border-b ${borderColor} ${textClass}">${product.name}</td>
            <td class="py-2 px-4 border-b ${borderColor} text-right ${textClass}">Rp ${product.price.toLocaleString('id-ID')}</td>
            <td class="py-2 px-4 border-b ${borderColor} text-right ${textClass}">${product.stock !== undefined ? product.stock : 'N/A'}</td>
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
        // saveProducts() tidak lagi dipanggil di sini, karena data akan sync dari Firestore
    }

    function editProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            editProductIdInput.value = product.id;
            editProductNameInput.value = product.name;
            editProductCostInput.value = product.cost !== undefined ? product.cost : 0;
            editProductPriceInput.value = product.price;
            editProductStockInput.value = product.stock !== undefined ? product.stock : 0;
            editProductForm.classList.remove('hidden');
            storeProductsTableContainer.classList.add('hidden');
            searchStoreProductsInput.classList.add('hidden');
        } else {
            console.error("Produk tidak ditemukan untuk diedit:", productId);
        }
    }

    async function saveProductEdit() {
        const id = editProductIdInput.value;
        const name = editProductNameInput.value.trim();
        const cost = parseFloat(editProductCostInput.value);
        const price = parseFloat(editProductPriceInput.value);
        const stock = parseInt(editProductStockInput.value);
        const userId = getCurrentUserId();

        if (!userId) {
            displayStatus("Error: Anda harus login untuk memperbarui produk.", "error");
            return;
        }

        if (!name || isNaN(cost) || cost < 0 || isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
            displayStatus("Error: Nama produk, modal, harga, dan stok harus valid!", "error");
            return;
        }

        try {
            const productDocRef = firebaseFunctions.doc(db, `artifacts/${appId}/products`, id);
            await firebaseFunctions.updateDoc(productDocRef, {
                name: name,
                cost: cost,
                price: price,
                stock: stock
            });
            displayStatus("Produk berhasil diperbarui!", "success");
            editProductForm.classList.add('hidden');
            storeProductsTableContainer.classList.remove('hidden');
            searchStoreProductsInput.classList.remove('hidden');
            // renderStoreProducts() akan otomatis dipanggil karena onSnapshot
        } catch (error) {
            console.error("Error memperbarui produk di Firestore:", error);
            displayStatus("Error: Gagal memperbarui produk. " + error.message, "error");
        }
    }

    async function deleteProduct(productId) {
        const confirmed = await confirmAction("Apakah Anda yakin ingin menghapus produk ini?");
        const userId = getCurrentUserId();
        if (!userId) {
            displayStatus("Error: Anda harus login untuk menghapus produk.", "error");
            return;
        }
        if (confirmed) {
            try {
                await firebaseFunctions.deleteDoc(firebaseFunctions.doc(db, `artifacts/${appId}/products`, productId));
                displayStatus("Produk berhasil dihapus!", "success");
                // renderStoreProducts() akan otomatis dipanggil karena onSnapshot
            } catch (error) {
                console.error("Error menghapus produk dari Firestore:", error);
                displayStatus("Error: Gagal menghapus produk. " + error.message, "error");
            }
        }
    }

    function closeStoreProductsModal() {
        storeProductsModal.classList.add('hidden');
        editProductForm.classList.add('hidden');
        searchStoreProductsInput.value = '';
        storeProductsTableContainer.classList.remove('hidden');
        searchStoreProductsInput.classList.remove('hidden');
        displayStatus("", "");
    }

    // --- Add New Product Functions ---
    function calculateProfit() {
        const cost = parseFloat(addProductCostInput.value) || 0;
        const price = parseFloat(addProductPriceInput.value) || 0;
        const profit = price - cost;
        addProductProfitInput.value = `Rp ${profit.toLocaleString('id-ID')}`;
        if (profit < 0) {
            addProductProfitInput.style.color = 'red';
        } else {
            addProductProfitInput.style.color = '';
        }
    }

    async function addNewProduct() {
        const id = addProductCodeInput.value.trim();
        const name = addProductNameInput.value.trim();
        const cost = parseFloat(addProductCostInput.value);
        const price = parseFloat(addProductPriceInput.value);
        const stock = parseInt(addProductStockInput.value);
        const userId = getCurrentUserId();

        if (!userId) {
            displayStatus("Error: Anda harus login untuk menambah produk.", "error");
            return;
        }

        if (!id || !name || isNaN(cost) || cost < 0 || isNaN(price) || price < 0 || isNaN(stock) || stock < 0) {
            displayStatus("Error: Pastikan semua kolom wajib diisi dengan nilai yang valid!", "error");
            return;
        }

        // Check for duplicate product ID from the current `products` array (which is synced from Firestore)
        if (products.some(p => p.id.toLowerCase() === id.toLowerCase())) {
            displayStatus("Error: Kode Barang sudah ada. Gunakan kode lain atau edit produk yang sudah ada.", "error");
            return;
        }

        try {
            await firebaseFunctions.setDoc(firebaseFunctions.doc(db, `artifacts/${appId}/products`, id), {
                name: name,
                price: price,
                cost: cost,
                stock: stock,
                createdAt: firebaseFunctions.serverTimestamp() // Tambahkan timestamp
            });
            displayStatus("Produk baru berhasil ditambahkan!", "success");
            // Clear form
            addProductCodeInput.value = '';
            addProductNameInput.value = '';
            addProductCostInput.value = '0';
            addProductPriceInput.value = '0';
            addProductStockInput.value = '0';
            calculateProfit();
            closeAddProductModal();
            // renderStoreProducts() akan otomatis dipanggil karena onSnapshot
        } catch (error) {
            console.error("Error menambah produk ke Firestore:", error);
            displayStatus("Error: Gagal menambah produk baru. " + error.message, "error");
        }
    }

    function closeAddProductModal() {
        addProductModal.classList.add('hidden');
        displayStatus("", "");
    }

    // --- Expenses Functions ---
    async function addExpense() {
        const date = expenseDateInput.value;
        const description = expenseDescriptionInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value);
        const userId = getCurrentUserId();

        if (!userId) {
            displayStatus("Error: Anda harus login untuk menambah pengeluaran.", "error", expenseStatusMessage);
            return;
        }

        if (!date || !description || isNaN(amount) || amount <= 0) {
            displayStatus("Error: Tanggal, deskripsi, dan jumlah pengeluaran harus valid!", "error", expenseStatusMessage);
            return;
        }

        try {
            await firebaseFunctions.addDoc(firebaseFunctions.collection(db, `artifacts/${appId}/expenses`), {
                date: date,
                description: description,
                amount: amount,
                userId: userId, // Simpan UID user yang menambahkan pengeluaran
                createdAt: firebaseFunctions.serverTimestamp()
            });

            // Update monthly expenses in Firestore
            monthlyExpenses += amount;
            await saveMonthlyFinancialDataToFirestore();
            renderMonthlyFinancialBar();

            displayStatus("Pengeluaran berhasil ditambahkan!", "success", expenseStatusMessage);
            // Clear form
            expenseDateInput.value = getTodayDateString();
            expenseDescriptionInput.value = '';
            expenseAmountInput.value = '0';
            // renderExpenses() akan otomatis dipanggil karena onSnapshot
        } catch (error) {
            console.error("Error menambah pengeluaran ke Firestore:", error);
            displayStatus("Error: Gagal menambah pengeluaran. " + error.message, "error", expenseStatusMessage);
        }
    }

    function renderExpenses() {
        if (!expensesListBody || !totalExpensesDisplayModal) return;
        expensesListBody.innerHTML = '';

        const searchTerm = expenseSearchInput.value.toLowerCase();
        const startDateStr = expenseFilterStartDate.value;
        const endDateStr = expenseFilterEndDate.value;

        let filteredExpenses = expenses;

        if (searchTerm) {
            filteredExpenses = filteredExpenses.filter(expense =>
                expense.description.toLowerCase().includes(searchTerm)
            );
        }

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
            filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
            filteredExpenses.forEach(expense => {
                const row = document.createElement('tr');
                const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-50';
                const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
                const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-200';

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
                totalFilteredExpenses += expense.amount;
            });
        }
        totalExpensesDisplayModal.textContent = `Rp ${totalFilteredExpenses.toLocaleString('id-ID')}`;
    }

    async function deleteExpense(expenseId) {
        const confirmed = await confirmAction("Apakah Anda yakin ingin menghapus pengeluaran ini?");
        const userId = getCurrentUserId();
        if (!userId) {
            displayStatus("Error: Anda harus login untuk menghapus pengeluaran.", "error", expenseStatusMessage);
            return;
        }
        if (confirmed) {
            try {
                const expenseToDelete = expenses.find(e => e.id === expenseId);
                if (!expenseToDelete || expenseToDelete.userId !== userId) {
                    displayStatus("Error: Anda tidak memiliki akses untuk menghapus pengeluaran ini.", "error", expenseStatusMessage);
                    return;
                }

                await firebaseFunctions.deleteDoc(firebaseFunctions.doc(db, `artifacts/${appId}/expenses`, expenseId));

                // Update monthly expenses in Firestore
                const thisMonth = getThisMonthString();
                const expenseMonth = new Date(expenseToDelete.date).toISOString().slice(0, 7);
                if (expenseMonth === thisMonth) {
                    monthlyExpenses -= expenseToDelete.amount;
                    if (monthlyExpenses < 0) monthlyExpenses = 0;
                    await saveMonthlyFinancialDataToFirestore();
                    renderMonthlyFinancialBar();
                }
                displayStatus("Pengeluaran berhasil dihapus!", "success", expenseStatusMessage);
                // renderExpenses() akan otomatis dipanggil karena onSnapshot
            } catch (error) {
                console.error("Error menghapus pengeluaran dari Firestore:", error);
                displayStatus("Error: Gagal menghapus pengeluaran. " + error.message, "error", expenseStatusMessage);
            }
        } else {
            displayStatus("Penghapusan pengeluaran dibatalkan.", "info", expenseStatusMessage);
        }
    }

    function closeExpensesModal() {
        expensesModal.classList.add('hidden');
        displayStatus("", "", expenseStatusMessage);
        displayStatus("", "");
        expenseSearchInput.value = '';
        expenseFilterStartDate.value = '';
        expenseFilterEndDate.value = '';
    }

    // --- Financial Report Functions ---
    function calculateFinancialReport() {
        const startDateStr = reportStartDateInput.value;
        const endDateStr = reportEndDateInput.value;
        let filteredTransactions = transactionHistory;
        let filteredExpenses = expenses;

        if (startDateStr && endDateStr) {
            const startDate = new Date(startDateStr);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(endDateStr);
            endDate.setHours(23, 59, 59, 999);

            filteredTransactions = filteredTransactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= startDate && transactionDate <= endDate;
            });
            filteredExpenses = filteredExpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= startDate && expenseDate <= endDate;
            });

        } else if (startDateStr) {
            const startDate = new Date(startDateStr);
            startDate.setHours(0, 0, 0, 0);
            filteredTransactions = filteredTransactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= startDate;
            });
            filteredExpenses = filteredExpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= startDate;
            });
        } else if (endDateStr) {
            const endDate = new Date(endDateStr);
            endDate.setHours(23, 59, 59, 999);
            filteredTransactions = filteredTransactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate <= endDate;
            });
            filteredExpenses = filteredExpenses.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate <= endDate;
            });
        }

        let totalRevenue = 0;
        let totalCostOfGoodsSold = 0;
        let totalExpenses = 0;

        filteredTransactions.forEach(transaction => {
            totalRevenue += transaction.totalAmount;
            transaction.items.forEach(item => {
                if (item.isCustom) {
                    totalCostOfGoodsSold += (item.price * 0.8) * item.qty;
                } else {
                    totalCostOfGoodsSold += item.cost * item.qty;
                }
            });
        });

        filteredExpenses.forEach(expense => {
            totalExpenses += expense.amount;
        });

        const grossProfit = totalRevenue - totalCostOfGoodsSold;
        const netProfit = grossProfit - totalExpenses;

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

        const chartData = [totalRevenue, totalExpenses, grossProfit, netProfit];
        renderFinancialReportChart(chartData);
    }

    function renderFinancialReportChart(data) {
        const ctx = financialChartCanvas.getContext('2d');
        if (window.myFinancialChart) {
            window.myFinancialChart.destroy();
        }

        const textColor = isDarkMode ? '#e2e8f0' : '#1a202c';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

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
                        color: textColor
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    x: {
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
                    }
                }
            }
        });
    }

    // --- Data Import/Export Functions (Disesuaikan untuk Firestore) ---
    // Note: Ekspor/Impor data ke/dari JSON lokal masih memungkinkan,
    // namun untuk data real-time, Firestore lebih diutamakan.
    // Fungsi ini akan melakukan ekspor dari data yang sudah disync dari Firestore.
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

    async function importProducts(event) {
        const file = event.target.files[0];
        const userId = getCurrentUserId();
        if (!userId) {
            displayStatus("Error: Anda harus login untuk mengimpor produk.", "error");
            return;
        }
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedProducts = JSON.parse(e.target.result);
                if (!Array.isArray(importedProducts) || !importedProducts.every(p => p.id && p.name && typeof p.price === 'number')) {
                    displayStatus("Error: Format file produk tidak valid.", "error");
                    return;
                }

                const confirmed = await confirmAction("Ini akan menimpa data produk yang ada di Firestore dengan data dari file. Lanjutkan?");
                if (confirmed) {
                    // Hapus semua produk yang ada di Firestore terlebih dahulu
                    const productsColRef = firebaseFunctions.collection(db, `artifacts/${appId}/products`);
                    const snapshot = await firebaseFunctions.getDocs(productsColRef);
                    const deletePromises = snapshot.docs.map(doc => firebaseFunctions.deleteDoc(doc.ref));
                    await Promise.all(deletePromises);

                    // Tambahkan produk yang diimpor ke Firestore
                    const addPromises = importedProducts.map(product =>
                        firebaseFunctions.setDoc(firebaseFunctions.doc(db, `artifacts/${appId}/products`, product.id), {
                            ...product,
                            createdAt: firebaseFunctions.serverTimestamp() // Tambahkan timestamp
                        })
                    );
                    await Promise.all(addPromises);

                    displayStatus("Data produk berhasil diimpor ke Firestore!", "success");
                    // renderStoreProducts() akan otomatis dipanggil karena onSnapshot
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

    // Fungsi ekspor data lengkap (akan mengambil dari state lokal yang sudah disync dari Firestore)
    function exportAllData() {
        const appData = {
            products: products,
            transactions: transactionHistory,
            expenses: expenses,
            users: users.map(u => ({ username: u.username, role: u.role, uid: u.uid })), // Export UID juga
            dailyRevenue: dailyRevenue,
            lastRecordedDate: lastRecordedDate,
            isRevenueVisible: isRevenueVisible,
            isDarkMode: isDarkMode,
            monthlyNetProfit: monthlyNetProfit,
            monthlyExpenses: monthlyExpenses,
            lastRecordedMonth: lastRecordedMonth,
            lastConnectedPrinterId: bluetoothPrinterDevice ? bluetoothPrinterDevice.id : null
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

    async function importAllData(event) {
        const file = event.target.files[0];
        const userId = getCurrentUserId();
        if (!userId || (loggedInUser && loggedInUser.role !== 'admin')) { // Hanya admin yang bisa import semua data
            displayStatus("Akses Ditolak: Hanya Admin yang bisa mengimpor semua data aplikasi.", "error");
            return;
        }
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target.result);

                if (!importedData.products || !importedData.transactions || !importedData.expenses || !importedData.users) {
                    displayStatus("Error: Format file data aplikasi tidak valid. Pastikan berisi 'products', 'transactions', 'expenses', dan 'users'.", "error");
                    return;
                }

                const confirmed = await confirmAction("Ini akan menimpa SEMUA data aplikasi yang ada di Firestore. Lanjutkan?");
                if (confirmed) {
                    displayStatus("Mengimpor data, harap tunggu...", "info");
                    // Hapus data Firestore yang ada
                    await performResetAllDataFirebaseOnly(); // Fungsi baru untuk menghapus data di Firestore saja

                    // Impor Produk
                    const productsColRef = firebaseFunctions.collection(db, `artifacts/${appId}/products`);
                    for (const product of importedData.products) {
                        await firebaseFunctions.setDoc(firebaseFunctions.doc(productsColRef, product.id), product);
                    }

                    // Impor Transaksi
                    const transactionsColRef = firebaseFunctions.collection(db, `artifacts/${appId}/transactions`);
                    for (const transaction of importedData.transactions) {
                        await firebaseFunctions.setDoc(firebaseFunctions.doc(transactionsColRef, transaction.id), transaction);
                    }

                    // Impor Pengeluaran
                    const expensesColRef = firebaseFunctions.collection(db, `artifacts/${appId}/expenses`);
                    for (const expense of importedData.expenses) {
                        await firebaseFunctions.addDoc(expensesColRef, expense); // addDoc akan generate ID baru
                    }

                    // Impor Pengguna (Hanya username dan role, password Auth tetap di Firebase Auth)
                    // Hapus pengguna non-admin yang ada di Firestore kecuali user yang sedang login
                    const usersColRef = firebaseFunctions.collection(db, `users`);
                    const existingUsersSnap = await firebaseFunctions.getDocs(usersColRef);
                    const deleteUserPromises = existingUsersSnap.docs
                        .filter(doc => doc.id !== getCurrentUserId()) // Jangan hapus user yang sedang login
                        .map(doc => firebaseFunctions.deleteDoc(doc.ref));
                    await Promise.all(deleteUserPromises);

                    // Tambahkan pengguna baru dari import, kecuali admin default yang mungkin sudah ada
                    for (const user of importedData.users) {
                        // Hanya tambahkan jika user dengan UID yang sama belum ada
                        const existingUserDoc = await firebaseFunctions.getDoc(firebaseFunctions.doc(db, `users`, user.uid));
                        if (!existingUserDoc.exists()) {
                            await firebaseFunctions.setDoc(firebaseFunctions.doc(db, `users`, user.uid), user);
                        }
                    }

                    // Impor data keuangan harian/bulanan (untuk user yang sedang login)
                    // Ini akan langsung update variabel global dan kemudian disimpan ke Firestore
                    dailyRevenue = importedData.dailyRevenue || 0;
                    lastRecordedDate = importedData.lastRecordedDate || '';
                    isRevenueVisible = typeof importedData.isRevenueVisible !== 'undefined' ? importedData.isRevenueVisible : true;
                    isDarkMode = typeof importedData.isDarkMode !== 'undefined' ? importedData.isDarkMode : false;
                    monthlyNetProfit = importedData.monthlyNetProfit || 0;
                    monthlyExpenses = importedData.monthlyExpenses || 0;
                    lastRecordedMonth = importedData.lastRecordedMonth || '';

                    await saveDailyRevenueToFirestore();
                    await saveMonthlyFinancialDataToFirestore();

                    // Restore last connected printer ID
                    const storedPrinterId = importedData.lastConnectedPrinterId || null;
                    if (storedPrinterId) {
                        localStorage.setItem(LOCAL_STORAGE_PRINTER_ID_KEY, storedPrinterId);
                    } else {
                        localStorage.removeItem(LOCAL_STORAGE_PRINTER_ID_KEY);
                    }

                    applyDarkMode();
                    renderMonthlyFinancialBar();
                    updatePrinterConnectionStatus("Silahkan sambungkan printer");

                    displayStatus("Data aplikasi lengkap berhasil diimpor ke Firestore!", "success");

                    // Auto-login atau paksa ke login screen setelah import
                    // onAuthStateChanged akan handle redirect ke main app jika user sudah login
                    // Jika tidak, tetap di login screen
                    // loadSavedPrinter(); // Coba konek printer (sudah di DOMContentLoaded)
                    loginScreen.classList.remove('hidden');
                    mainAppContainer.classList.add('hidden');
                    loggedInUser = null; // Reset logged in user state
                    firebaseFunctions.signOut(auth); // Force sign out to re-trigger onAuthStateChanged
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

    // Fungsi untuk menghapus semua data di Firestore (hanya bagian yang relevan dengan aplikasi)
    async function performResetAllDataFirebaseOnly() {
        const userId = getCurrentUserId();
        if (!userId || (loggedInUser && loggedInUser.role !== 'admin')) {
            displayStatus("Akses Ditolak: Hanya Admin yang bisa mereset semua data aplikasi.", "error");
            return false;
        }

        try {
            const collectionsToClear = [
                firebaseFunctions.collection(db, `artifacts/${appId}/products`),
                firebaseFunctions.collection(db, `artifacts/${appId}/transactions`),
                firebaseFunctions.collection(db, `artifacts/${appId}/expenses`),
            ];
            // Collection 'users' (profil user) akan di-handle terpisah untuk menghindari penghapusan admin yang sedang login

            for (const colRef of collectionsToClear) {
                const snapshot = await firebaseFunctions.getDocs(colRef);
                const deletePromises = snapshot.docs.map(doc => firebaseFunctions.deleteDoc(doc.ref));
                await Promise.all(deletePromises);
                console.log(`[Firestore Reset] Cleared collection: ${colRef.path}`);
            }

            // Reset data keuangan harian/bulanan di Firestore untuk user ini
            await firebaseFunctions.setDoc(firebaseFunctions.doc(db, `artifacts/${appId}/users/${userId}/financialSummary/daily`), {
                revenue: 0,
                lastDate: ''
            }, { merge: true });
            await firebaseFunctions.setDoc(firebaseFunctions.doc(db, `artifacts/${appId}/users/${userId}/financialSummary/monthly`), {
                netProfit: 0,
                expenses: 0,
                lastMonth: ''
            }, { merge: true });
            console.log(`[Firestore Reset] Financial summaries reset for user ${userId}`);

            console.log("Semua data aplikasi di Firestore berhasil direset.");
            return true;
        } catch (error) {
            console.error("Error mereset data Firestore:", error);
            displayStatus("Error: Gagal mereset data di server. " + error.message, "error");
            return false;
        }
    }

    // Fungsi untuk mereset semua data aplikasi (termasuk lokal dan Firestor)
    async function performResetAllData() {
        const userId = getCurrentUserId();
        if (!userId || (loggedInUser && loggedInUser.role !== 'admin')) {
            displayStatus("Akses Ditolak: Hanya Admin yang bisa mereset semua data aplikasi.", "error");
            return;
        }

        const resetSuccess = await performResetAllDataFirebaseOnly();
        if (resetSuccess) {
            products = [];
            transactionHistory = [];
            expenses = [];
            // users tidak direset total, karena admin yang login harus tetap ada
            dailyRevenue = 0;
            lastRecordedDate = '';
            isRevenueVisible = true;
            isDarkMode = false;
            monthlyNetProfit = 0;
            monthlyExpenses = 0;
            lastRecordedMonth = '';
            bluetoothPrinterDevice = null;
            printerCharacteristic = null;

            localStorage.removeItem(LOCAL_STORAGE_PRINTER_ID_KEY); // Clear saved printer ID

            // Perbarui UI dan muat ulang data (onSnapshot akan otomatis memuat ulang)
            startNewTransaction();
            renderStoreProducts();
            updateHeaderDailyRevenue();
            updateCashierDisplay();
            applyDarkMode();
            renderMonthlyFinancialBar();
            updatePrinterConnectionStatus("Silahkan sambungkan printer");
            displayStatus("Semua data aplikasi telah direset!", "success");

            // Force logout to clear session and reload all data via onAuthStateChanged
            await firebaseFunctions.signOut(auth);
        }
    }

    // Fungsi untuk membuka reset data confirmation modal
    function openResetDataConfirmation() {
        resetDataModal.classList.remove('hidden');
        resetPasswordInput.value = '';
        resetDataMessage.classList.add('hidden');
        // Tidak ada lagi password hardcode, tombol confirm akan mengandalkan login admin saat ini
        const userId = getCurrentUserId();
        if (!userId || (loggedInUser && loggedInUser.role !== 'admin')) {
            displayStatus("Hanya Admin yang bisa melakukan reset data. Silakan login sebagai Admin.", "error", resetDataMessage);
            resetDataConfirmBtn.disabled = true;
            resetPasswordInput.disabled = true;
            resetPasswordInput.placeholder = "Login sebagai Admin terlebih dahulu";
        } else {
            displayStatus("Untuk mereset data, konfirmasi bahwa Anda adalah Admin.", "info", resetDataMessage);
            resetDataConfirmBtn.disabled = false;
            resetPasswordInput.disabled = false;
            resetPasswordInput.placeholder = "Masukkan password Admin";
        }
    }


    // --- Transaction History Functions ---
    function renderTransactionHistory(startDateStr = '', endDateStr = '') {
        if (!transactionHistoryTableBody || !totalTransactionsAmount) return;
        transactionHistoryTableBody.innerHTML = '';

        let filteredHistory = transactionHistory;

        if (startDateStr && endDateStr) {
            const startDate = new Date(startDateStr);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(endDateStr);
            endDate.setHours(23, 59, 59, 999);

            filteredHistory = filteredHistory.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= startDate && transactionDate <= endDate;
            });
        } else if (startDateStr) {
            const startDate = new Date(startDateStr);
            startDate.setHours(0, 0, 0, 0);
            filteredHistory = filteredHistory.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= startDate;
            });
        } else if (endDateStr) {
            const endDate = new Date(endDateStr);
            endDate.setHours(23, 59, 59, 999);
            filteredHistory = filteredHistory.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate <= endDate;
            });
        }

        let totalAmountFilteredTransactions = 0;

        if (filteredHistory.length === 0) {
            transactionHistoryMessageBox.classList.remove('hidden');
            transactionHistoryMessageBox.textContent = "Tidak ada transaksi dalam riwayat." + (startDateStr || endDateStr ? " untuk rentang tanggal yang dipilih." : "");
            totalAmountFilteredTransactions = 0;
        } else {
            transactionHistoryMessageBox.classList.add('hidden');
        }

        filteredHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

        filteredHistory.forEach(transaction => {
            const row = document.createElement('tr');
            const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-50';
            const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
            const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-200';

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
            totalAmountFilteredTransactions += transaction.totalAmount;
        });
        totalTransactionsAmount.textContent = `Rp ${totalAmountFilteredTransactions.toLocaleString('id-ID')}`;
    }

    function viewTransactionDetails(transactionId) {
        const transaction = transactionHistory.find(t => t.id === transactionId);
        if (!transaction) {
            displayStatus("Error: Transaksi tidak ditemukan.", "error");
            return;
        }

        document.getElementById('transaction-history-table-body').parentElement.classList.add('hidden');
        document.getElementById('transaction-history-message-box').classList.add('hidden');
        historyFilterControls.classList.add('hidden');
        totalTransactionsAmount.parentElement.classList.add('hidden');
        transactionDetailSection.classList.remove('hidden');

        reprintReceiptBtn.dataset.transactionId = transaction.id;

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

    function closeTransactionDetails() {
        transactionDetailSection.classList.add('hidden');
        document.getElementById('transaction-history-table-body').parentElement.classList.remove('hidden');
        historyFilterControls.classList.remove('hidden');
        totalTransactionsAmount.parentElement.classList.remove('hidden');
        renderTransactionHistory(historyStartDateInput.value, historyEndDateInput.value);
    }

    async function deleteTransaction(transactionId) {
        const confirmed = await confirmAction("Apakah Anda yakin ingin menghapus transaksi ini? Stok produk terdaftar akan dikembalikan.");
        const userId = getCurrentUserId();
        if (!userId) {
            displayStatus("Error: Anda harus login untuk menghapus transaksi.", "error");
            return;
        }
        if (!confirmed) return;

        try {
            const transactionToDelete = transactionHistory.find(t => t.id === transactionId);
            if (!transactionToDelete || transactionToDelete.userId !== userId) {
                displayStatus("Error: Anda tidak memiliki akses untuk menghapus transaksi ini.", "error");
                return;
            }

            // Kembalikan stok untuk produk terdaftar
            for (const item of transactionToDelete.items) {
                if (!item.productId.startsWith('custom-')) {
                    const productDocRef = firebaseFunctions.doc(db, `artifacts/${appId}/products`, item.productId);
                    const productDocSnap = await firebaseFunctions.getDoc(productDocRef);
                    if (productDocSnap.exists()) {
                        const currentStock = productDocSnap.data().stock || 0;
                        await firebaseFunctions.updateDoc(productDocRef, { stock: currentStock + item.qty });
                    }
                }
            }

            // Hapus transaksi dari Firestore
            await firebaseFunctions.deleteDoc(firebaseFunctions.doc(db, `artifacts/${appId}/transactions`, transactionId));

            // Perbarui daily revenue di Firestore
            const today = getTodayDateString();
            const transactionDate = new Date(transactionToDelete.date).toISOString().slice(0, 10);
            if (transactionDate === today) {
                dailyRevenue -= transactionToDelete.totalAmount;
                if (dailyRevenue < 0) dailyRevenue = 0;
                await saveDailyRevenueToFirestore();
                updateHeaderDailyRevenue();
            }

            // Perbarui monthly net profit di Firestore
            const thisMonth = getThisMonthString();
            const transactionMonth = new Date(transactionToDelete.date).toISOString().slice(0, 7);
            if (transactionMonth === thisMonth && transactionToDelete.transactionNetProfit !== undefined) {
                monthlyNetProfit -= transactionToDelete.transactionNetProfit;
                await saveMonthlyFinancialDataToFirestore();
                renderMonthlyFinancialBar();
            }

            displayStatus("Transaksi berhasil dihapus dan stok dikembalikan!", "success");
            // renderTransactionHistory() akan otomatis dipanggil karena onSnapshot
        } catch (error) {
            console.error("Error menghapus transaksi dari Firestore:", error);
            displayStatus("Error: Gagal menghapus transaksi. " + error.message, "error");
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

    // --- User Management Functions ---

    async function loginUser() {
        const email = loginScreenUsernameInput.value.trim(); // Gunakan email sebagai username
        const password = loginScreenPasswordInput.value.trim();

        try {
            // Sign in dengan Firebase Auth
            const userCredential = await firebaseFunctions.signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("[Auth] User signed in:", user.uid);

            // Ambil data profil user dari Firestore
            loggedInUser = await loadUserDataFromFirestore(user.uid);

            // Jika user belum punya profil di Firestore (misal user baru yang register atau user yang profilnya terhapus)
            if (!loggedInUser) {
                console.warn("[Auth State] User logged in but Firestore profile is missing. Attempting to create one.");
                // Cek apakah ada admin yang sudah ada di koleksi 'users'
                const usersCollectionRef = firebaseFunctions.collection(db, `users`);
                const existingUsersSnapshot = await firebaseFunctions.getDocs(usersCollectionRef);
                const adminExists = existingUsersSnapshot.docs.some(doc => doc.data().role === 'admin');

                let roleToAssign = 'cashier'; // Default role
                // Jika belum ada admin dan ini bukan user anonim (berarti user register dengan email/password)
                if (!adminExists && !user.isAnonymous) {
                    roleToAssign = 'admin';
                    console.log("[Setup] First non-anonymous user, no existing admin. Assigning 'admin' role.");
                } else if (user.isAnonymous) {
                    // User anonim selalu 'cashier' atau role terbatas
                    roleToAssign = 'cashier';
                    console.log("[Setup] Anonymous user. Assigning 'cashier' role.");
                }

                const usernameForProfile = user.email || `user_${user.uid.substring(0, 8)}`;
                await createUserProfileInFirestore(user.uid, usernameForProfile, roleToAssign);
                // Setelah membuat profil, set loggedInUser dari data yang baru dibuat
                loggedInUser = { uid: user.uid, username: usernameForProfile, role: roleToAssign };
            }

            // Setelah loggedInUser PASTI terisi (baik baru dibuat atau dimuat dari Firestore)
            mainAppContainer.classList.remove('hidden');
            loginScreen.classList.add('hidden');
            updateCashierDisplay(); // Update display, termasuk visibilitas menu admin
            await loadDailyRevenueFromFirestore();
            await loadMonthlyFinancialDataFromFirestore();
            await checkAndResetDailyRevenue(); // Periksa dan reset pendapatan harian/bulanan
            await loadProductsFromFirestore(); // Muat produk dari Firestore
            await loadTransactionHistoryFromFirestore(); // Muat riwayat transaksi dari Firestore
            await loadExpensesFromFirestore(); // Muat pengeluaran dari Firestore
            await loadUsersFromFirestore(); // Muat daftar pengguna dari Firestore
            applyDarkMode(); // Apply dark mode state
            startNewTransaction(); // Start fresh transaction after all data loaded
            loginScreenUsernameInput.value = '';
            loginScreenPasswordInput.value = '';
            displayStatus("", "", loginScreenMessage);

        } catch (error) {
            let errorMessage = "Terjadi kesalahan saat login.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMessage = "Email atau password salah.";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Terlalu banyak percobaan login yang gagal. Silakan coba lagi nanti.";
            }
            displayStatus(`Error: ${errorMessage}`, "error", loginScreenMessage);
            console.error("Login error:", error);
        }
    }

    async function userSettingsLogin() {
        const email = userSettingsLoginUsernameInput.value.trim();
        const password = userSettingsLoginPasswordInput.value.trim();

        try {
            const userCredential = await firebaseFunctions.signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("[Auth] User signed in from settings:", user.uid);

            loggedInUser = await loadUserDataFromFirestore(user.uid);
            if (loggedInUser && loggedInUser.role === 'admin') {
                displayStatus(`Selamat datang, ${loggedInUser.username}! Anda login sebagai Admin.`, "success", userSettingsLoginStatusMessage);
                updateCashierDisplay();
                showUserManagementSection(); // Tampilkan bagian manajemen user jika admin
            } else {
                displayStatus("Error: Login berhasil, tapi Anda bukan Admin.", "error", userSettingsLoginStatusMessage);
                // Tidak perlu signOut di sini karena ini adalah login di modal, bukan login utama.
                // Cukup reset loggedInUser jika bukan admin yang dimaksud.
                loggedInUser = null; // Clear user if not admin role for this section
            }
        } catch (error) {
            let errorMessage = "Terjadi kesalahan saat login.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMessage = "Email atau password salah.";
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = "Terlalu banyak percobaan login yang gagal. Silakan coba lagi nanti.";
            }
            displayStatus(`Error: ${errorMessage}`, "error", userSettingsLoginStatusMessage);
            console.error("Login (User Settings) error:", error);
        }
    }

    async function logoutUser() {
        const confirmed = await confirmAction("Apakah Anda yakin ingin logout?");
        if (!confirmed) return;

        try {
            await firebaseFunctions.signOut(auth);
            displayStatus("Anda telah logout.", "info");
            // onAuthStateChanged listener akan menangani perubahan UI dan reset data lokal
        } catch (error) {
            console.error("Error logout:", error);
            displayStatus("Error: Gagal logout. " + error.message, "error");
        }
    }

    async function addNewUser() {
        const email = newUserNameInput.value.trim(); // Email sebagai username
        const password = newUserPasswordInput.value.trim();
        const role = newUserRoleSelect.value;
        const currentUserId = getCurrentUserId();

        if (!currentUserId || (loggedInUser && loggedInUser.role !== 'admin')) {
            displayStatus("Akses Ditolak: Hanya Admin yang bisa menambah pengguna baru.", "error", addUserStatusMessage);
            return;
        }

        if (!email || !password || password.length < 6) {
            displayStatus("Email dan password wajib diisi, password minimal 6 karakter!", "error", addUserStatusMessage);
            return;
        }

        try {
            // Buat user di Firebase Auth
            const userCredential = await firebaseFunctions.createUserWithEmailAndPassword(auth, email, password);
            const newUserUid = userCredential.user.uid;
            console.log(`[Auth] New user created: ${newUserUid}`);

            // Simpan data profil user ke Firestore
            await firebaseFunctions.setDoc(firebaseFunctions.doc(db, `users/${newUserUid}`), {
                username: email, // Simpan email sebagai username di profil
                role: role,
                createdAt: firebaseFunctions.serverTimestamp()
            });
            console.log(`[Firestore] User profile saved for ${newUserUid} with role ${role}.`);

            displayStatus("Pengguna baru berhasil ditambahkan!", "success", addUserStatusMessage);
            newUserNameInput.value = '';
            newUserPasswordInput.value = '';
            newUserRoleSelect.value = 'cashier';
            // renderUserList() akan otomatis dipanggil karena onSnapshot pada collection users
        } catch (error) {
            let errorMessage = "Terjadi kesalahan saat menambah pengguna.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Email sudah terdaftar. Gunakan email lain.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password terlalu lemah (minimal 6 karakter).";
            }
            displayStatus(`Error: ${errorMessage}`, "error", addUserStatusMessage);
            console.error("Add user error:", error);
        }
    }

    // Memuat user dari Firestore secara real-time dan merender listnya
    async function loadUsersFromFirestore() {
        const usersColRef = firebaseFunctions.collection(db, `users`); // Collection 'users' (profil user)
        // Gunakan onSnapshot untuk real-time updates
        firebaseFunctions.onSnapshot(usersColRef, (snapshot) => {
            users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
            console.log("[Firestore Load] Pengguna dimuat dari Firestore:", users);
            renderUserList();
        }, (error) => {
            console.error("Error memuat pengguna dari Firestore:", error);
            displayStatus("Error: Gagal memuat daftar pengguna.", "error", addUserStatusMessage);
        });
    }

    function renderUserList() {
        if (!userListBody || !emptyUserMessage) return;
        userListBody.innerHTML = '';

        if (users.length === 0) {
            emptyUserMessage.classList.remove('hidden');
        } else {
            emptyUserMessage.classList.add('hidden');
            users.forEach(user => {
                const row = document.createElement('tr');
                const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-50';
                const textClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';
                const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-200';

                row.className = hoverClass;
                row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${textClass} ${borderColor}">${user.username}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm ${textClass} ${borderColor}">${user.role}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${borderColor}">
                    ${(loggedInUser && loggedInUser.uid === user.uid) ? '<span class="text-gray-500">Aktif</span>' : `
                    ${user.role.toLowerCase() !== 'admin' ? `
                        <button class="delete-user-btn text-red-600 hover:text-red-900" data-uid="${user.uid}" title="Hapus Pengguna">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    ` : '<span class="text-gray-500">Admin Utama</span>'}
                    `}
                </td>
            `;
                userListBody.appendChild(row);
            });
        }
    }

    async function deleteUser(userUid) {
        const currentUserId = getCurrentUserId();
        if (!currentUserId || (loggedInUser && loggedInUser.role !== 'admin')) {
            displayStatus("Akses Ditolak: Hanya Admin yang bisa menghapus pengguna.", "error", addUserStatusMessage);
            return;
        }

        if (currentUserId === userUid) {
            displayStatus("Tidak dapat menghapus pengguna yang sedang login.", "error", addUserStatusMessage);
            return;
        }

        const userToDelete = users.find(u => u.uid === userUid);
        if (userToDelete && userToDelete.role.toLowerCase() === 'admin') {
            displayStatus("Tidak dapat menghapus pengguna 'admin' lainnya (demi keamanan).", "error", addUserStatusMessage);
            return;
        }


        const confirmed = await confirmAction(`Apakah Anda yakin ingin menghapus pengguna '${userToDelete ? userToDelete.username : 'Unknown User'}'?`);
        if (confirmed) {
            try {
                // Hapus user dari Firebase Auth
                // Note: Ini hanya bisa dilakukan dari Admin SDK di server, atau oleh user itu sendiri.
                // Untuk aplikasi client-side seperti ini, kita hanya bisa menghapus profil Firestore-nya.
                // UserAuth-nya tetap ada sampai dihapus manual dari Firebase Console.
                await firebaseFunctions.deleteDoc(firebaseFunctions.doc(db, `users`, userUid));
                console.log(`[Firestore] User profile deleted for UID: ${userUid}`);
                displayStatus("Profil pengguna berhasil dihapus (User Auth mungkin masih ada).", "success", addUserStatusMessage);
                // renderUserList() akan otomatis dipanggil
            } catch (error) {
                console.error("Error menghapus pengguna dari Firestore:", error);
                displayStatus("Error: Gagal menghapus pengguna. " + error.message, "error", addUserStatusMessage);
            }
        } else {
            displayStatus("Penghapusan pengguna dibatalkan.", "info", addUserStatusMessage);
        }
    }

    // NEW: Fungsi untuk membersihkan entri user duplikat di Firestore
    async function cleanupDuplicateUsers() {
        const currentUserId = getCurrentUserId();
        if (!currentUserId || (loggedInUser && loggedInUser.role !== 'admin')) {
            displayStatus("Akses Ditolak: Hanya Admin yang bisa melakukan cleanup user.", "error", addUserStatusMessage);
            return;
        }

        const confirmed = await confirmAction("Ini akan menghapus profil pengguna duplikat di Firestore (misal: dua entri dengan email yang sama tapi UID beda). Pastikan Anda tahu apa yang Anda lakukan! Lanjutkan?");
        if (!confirmed) {
            displayStatus("Cleanup user dibatalkan.", "info", addUserStatusMessage);
            return;
        }

        displayStatus("Memulai cleanup user...", "info", addUserStatusMessage);
        try {
            const usersCollectionRef = firebaseFunctions.collection(db, `users`);
            const snapshot = await firebaseFunctions.getDocs(usersCollectionRef);
            const usersByUsername = new Map(); // Map untuk menyimpan user berdasarkan username

            // Kelompokkan user berdasarkan username
            snapshot.docs.forEach(doc => {
                const userData = { uid: doc.id, ...doc.data() };
                const username = userData.username.toLowerCase();
                if (!usersByUsername.has(username)) {
                    usersByUsername.set(username, []);
                }
                usersByUsername.get(username).push(userData);
            });

            const deletePromises = [];
            for (const [username, userEntries] of usersByUsername.entries()) {
                if (userEntries.length > 1) { // Ada duplikat username
                    console.warn(`[Cleanup] Ditemukan duplikat untuk username: ${username}`);
                    let adminUser = null;
                    let currentUserEntry = null;
                    const otherUsersToDelete = [];

                    userEntries.forEach(user => {
                        if (user.role === 'admin') {
                            adminUser = user;
                        } else if (user.uid === currentUserId) {
                            currentUserEntry = user;
                        } else {
                            otherUsersToDelete.push(user);
                        }
                    });

                    if (adminUser) {
                        // Jika ada admin, hapus semua duplikat non-admin kecuali user yang sedang login
                        otherUsersToDelete.forEach(user => {
                            if (user.uid !== adminUser.uid) { // Pastikan tidak menghapus admin itu sendiri
                                console.log(`[Cleanup] Menghapus duplikat non-admin: ${user.username} (UID: ${user.uid})`);
                                deletePromises.push(firebaseFunctions.deleteDoc(firebaseFunctions.doc(db, `users`, user.uid)));
                            }
                        });
                        // Jika user yang sedang login adalah duplikat tapi bukan admin, dan ada admin lain, hapus dia juga
                        if (currentUserEntry && currentUserEntry.uid !== adminUser.uid) {
                             console.log(`[Cleanup] Menghapus profil login saat ini karena duplikat dan bukan admin utama: ${currentUserEntry.username} (UID: ${currentUserEntry.uid})`);
                             deletePromises.push(firebaseFunctions.deleteDoc(firebaseFunctions.doc(db, `users`, currentUserEntry.uid)));
                             // Setelah ini, user yang sedang login akan log out otomatis karena profilnya dihapus.
                        }
                    } else if (currentUserEntry) {
                        // Jika tidak ada admin tapi user yang sedang login adalah salah satu duplikat, simpan dia
                        otherUsersToDelete.forEach(user => {
                             if (user.uid !== currentUserEntry.uid) { // Pastikan tidak menghapus user yang sedang login
                                console.log(`[Cleanup] Menghapus duplikat (tidak ada admin): ${user.username} (UID: ${user.uid})`);
                                deletePromises.push(firebaseFunctions.deleteDoc(firebaseFunctions.doc(db, `users`, user.uid)));
                             }
                        });
                    } else {
                        // Jika tidak ada admin dan user yang sedang login bukan bagian dari duplikat ini,
                        // hapus semua kecuali satu (misal yang pertama ditemukan)
                        // Aturan: Simpan 1, hapus sisanya. Kalau ada user 'admin', dia yang disimpan.
                        // Kalau tidak ada 'admin', simpan yang pertama.
                        const userToKeep = userEntries[0]; // Simpan yang pertama by default
                        userEntries.forEach(user => {
                            if (user.uid !== userToKeep.uid) {
                                console.log(`[Cleanup] Menghapus duplikat (tidak ada admin, bukan current user): ${user.username} (UID: ${user.uid})`);
                                deletePromises.push(firebaseFunctions.deleteDoc(firebaseFunctions.doc(db, `users`, user.uid)));
                            }
                        });
                    }
                }
            }

            await Promise.all(deletePromises);
            displayStatus("Cleanup user selesai. Silakan refresh halaman jika Anda terlog out.", "success", addUserStatusMessage);
            // Re-fetch users to update UI
            await loadUsersFromFirestore();
            if (deletePromises.length > 0 && !loggedInUser) {
                 // If current loggedInUser profile was deleted, force a full logout to return to login screen
                 firebaseFunctions.signOut(auth);
            }
        } catch (error) {
            console.error("Error saat cleanup user:", error);
            displayStatus("Error: Gagal melakukan cleanup user. " + error.message, "error", addUserStatusMessage);
        }
    }


    function showUserManagementSection() {
        if (loggedInUser && loggedInUser.role === 'admin') {
            userSettingsLoginSection.classList.add('hidden');
            userManagementSection.classList.remove('hidden');
            renderUserList();
        } else {
            userSettingsLoginSection.classList.remove('hidden');
            userManagementSection.classList.add('hidden');
            userSettingsLoginUsernameInput.value = '';
            userSettingsLoginPasswordInput.value = '';
            displayStatus("", "", userSettingsLoginStatusMessage);
        }
    }

    function openUserSettingsModal() {
        userSettingsModal.classList.remove('hidden');
        adminMenuDropdown.classList.add('hidden');
        showUserManagementSection(); // Panggil ini untuk menentukan apakah bagian manajemen pengguna terlihat
    }

    function closeUserSettingsModal() {
        userSettingsModal.classList.add('hidden');
        displayStatus("", "", userSettingsLoginStatusMessage);
        displayStatus("", "", addUserStatusMessage);
    }

    // --- Bluetooth Printer Functions (New) ---

    function updatePrinterConnectionStatus(message, isConnected = false) {
        if (printerStatus) printerStatus.textContent = `Status: ${message}`;
        if (connectPrinterBtn) connectPrinterBtn.disabled = isConnected;
        if (disconnectPrinterBtn) disconnectPrinterBtn.disabled = !isConnected;
        if (testPrintBtn) testPrintBtn.disabled = !isConnected;
    }

    function savePrinterAddress(deviceId) {
        try {
            localStorage.setItem(LOCAL_STORAGE_PRINTER_ID_KEY, deviceId);
            console.log("Printer ID saved:", deviceId);
        } catch (error) {
            console.error("Gagal menyimpan ID printer ke localStorage:", error);
        }
    }

    function clearSavedPrinter() {
        try {
            localStorage.removeItem(LOCAL_STORAGE_PRINTER_ID_KEY);
            console.log("Printer ID dihapus dari localStorage.");
        } catch (error) {
            console.error("Gagal menghapus ID printer dari localStorage:", error);
        }
    }

    async function connectPrinter() {
        try {
            updatePrinterConnectionStatus("Mencari printer...", false);
            bluetoothPrinterDevice = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
            });

            if (!bluetoothPrinterDevice) {
                updatePrinterConnectionStatus("Pencarian printer dibatalkan.");
                return;
            }

            updatePrinterConnectionStatus("Menghubungkan ke printer...", false);
            const server = await bluetoothPrinterDevice.gatt.connect();

            bluetoothPrinterDevice.addEventListener('gattserverdisconnected', onPrinterDisconnected);

            const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
            printerCharacteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

            updatePrinterConnectionStatus(`Printer terhubung: ${bluetoothPrinterDevice.name || bluetoothPrinterDevice.id}`, true);
            savePrinterAddress(bluetoothPrinterDevice.id);

        } catch (error) {
            console.error("Koneksi printer error:", error);
            updatePrinterConnectionStatus(`Error: ${error.message}`);
            bluetoothPrinterDevice = null;
            printerCharacteristic = null;
            clearSavedPrinter();
        }
    }

    function disconnectPrinter() {
        if (bluetoothPrinterDevice && bluetoothPrinterDevice.gatt.connected) {
            try {
                bluetoothPrinterDevice.gatt.disconnect();
            } catch (error) {
                console.error("Gagal memutuskan printer:", error);
                updatePrinterConnectionStatus(`Gagal memutuskan: ${error.message}`);
            }
        } else {
            updatePrinterConnectionStatus("Printer tidak terhubung.");
        }
        bluetoothPrinterDevice = null;
        printerCharacteristic = null;
        clearSavedPrinter();
    }

    function onPrinterDisconnected(event) {
        const device = event.target;
        console.log(`Printer ${device.name || device.id} telah terputus.`);
        updatePrinterConnectionStatus("Printer terputus.");
        bluetoothPrinterDevice = null;
        printerCharacteristic = null;
        clearSavedPrinter();
    }

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
                "Cetak Berhasil!\n\n\n";

            const encoder = new TextEncoder();
            await printerCharacteristic.writeValue(encoder.encode(text));

            updatePrinterConnectionStatus("Test print berhasil!", true);
        } catch (error) {
            console.error("Test print error:", error);
            updatePrinterConnectionStatus(`Test print error: ${error.message}`);
        }
    }

    async function loadSavedPrinter() {
        const savedPrinterId = localStorage.getItem(LOCAL_STORAGE_PRINTER_ID_KEY);
        if (savedPrinterId) {
            updatePrinterConnectionStatus("Mencoba menghubungkan kembali ke printer terakhir...", false);
            try {
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
                    clearSavedPrinter();
                }
            } catch (error) {
                console.error("Gagal menghubungkan kembali ke printer tersimpan:", error);
                updatePrinterConnectionStatus(`Gagal menghubungkan kembali: ${error.message}`);
                bluetoothPrinterDevice = null;
                printerCharacteristic = null;
                clearSavedPrinter();
            }
        } else {
            updatePrinterConnectionStatus("Silahkan sambungkan printer");
        }
    }

    // --- Price Calculator Functions (NEW) ---
    function openPriceCalculatorModal() {
        priceCalculatorModal.classList.remove('hidden');
        adminMenuDropdown.classList.add('hidden');
        priceCalcProductCodeInput.value = '';
        priceCalcProductNameInput.value = '';
        priceCalcModalInput.value = '0';
        priceCalcMarginPercentInput.value = '0';
        priceCalcTaxPercentInput.value = '0';
        priceCalcDiscountPercentInput.value = '0';
        priceCalcSellingPriceInput.value = 'Rp 0';
        priceCalcProfitInput.value = 'Rp 0';
        priceCalcStatusMessage.classList.add('hidden');
    }

    function closePriceCalculatorModal() {
        priceCalculatorModal.classList.add('hidden');
        priceCalcStatusMessage.classList.add('hidden');
    }

    function calculateSellingPriceAndProfit() {
        const modal = parseFloat(priceCalcModalInput.value) || 0;
        const marginPercent = parseFloat(priceCalcMarginPercentInput.value) || 0;
        const taxPercent = parseFloat(priceCalcTaxPercentInput.value) || 0;
        const discountPercent = parseFloat(priceCalcDiscountPercentInput.value) || 0;
        const productCode = priceCalcProductCodeInput.value.trim();

        priceCalcStatusMessage.classList.add('hidden');

        if (isNaN(modal) || modal < 0 || isNaN(marginPercent) || marginPercent < 0 ||
            isNaN(taxPercent) || taxPercent < 0 || isNaN(discountPercent) || discountPercent < 0) {
            displayStatus("Error: Semua input angka harus valid dan tidak negatif.", "error", priceCalcStatusMessage);
            priceCalcSellingPriceInput.value = 'Rp 0';
            priceCalcProfitInput.value = 'Rp 0';
            return;
        }

        if (productCode) {
            const isCodeRegistered = products.some(p => p.id.toLowerCase() === productCode.toLowerCase());
            if (isCodeRegistered) {
                displayStatus(`Peringatan: Kode Barang '${productCode}' sudah terdaftar pada produk yang ada.`, "warning", priceCalcStatusMessage);
            }
        }

        const sellingPrice = modal * (1 + marginPercent / 100);

        const marginAmount = modal * (marginPercent / 100);
        const taxAmountOnModal = modal * (taxPercent / 100);
        const discountAmountOnModal = modal * (discountPercent / 100);

        const profit = marginAmount - taxAmountOnModal - discountAmountOnModal;

        priceCalcSellingPriceInput.value = `Rp ${sellingPrice.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        priceCalcProfitInput.value = `Rp ${profit.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }


    // --- Event Listeners (Moved inside DOMContentLoaded) ---
    document.addEventListener('DOMContentLoaded', async (event) => {
        // Assign Firebase instances from window
        auth = window.firebaseAuth;
        db = window.firebaseDb;
        appId = window.appId;
        firebaseFunctions = window.firebase; // Akses semua fungsi Firebase dari objek window.firebase

        // Assign DOM elements
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
        paymentMethodSelect = document.getElementById('paymentMethod');
        changeAmountHeader = document.getElementById('changeAmountHeader');
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
        darkModeToggle = document.getElementById('darkModeToggle');
        monthlyFinancialBarContainer = document.getElementById('monthly-financial-bar-container');
        monthlyProfitBar = document.getElementById('monthly-profit-bar');
        monthlyExpenseBar = document.getElementById('monthly-expense-bar');
        productCodeInput = document.getElementById('product-code');
        productNameInput = document.getElementById('product-name');
        priceInput = document.getElementById('price');
        quantityInput = document.getElementById('quantity');
        addRegisteredItemButton = document.getElementById('add-to-cart-btn-registered');
        customProductCodeInput = document.getElementById('custom-product-code');
        customProductNameInput = document.getElementById('custom-product-name');
        customProductPriceInput = document.getElementById('custom-price');
        customProductQtyInput = document.getElementById('custom-quantity');
        addCustomItemButton = document.getElementById('add-to-cart-btn-custom');
        showRegisteredProductsButton = document.getElementById('showRegisteredProducts');
        showCustomProductsButton = document.getElementById('showCustomProducts');
        customProductSection = document.getElementById('customProductSection');
        registeredProductSection = document.getElementById('registeredProductSection');
        adminMenuButton = document.getElementById('adminMenuButton');
        adminMenuDropdown = document.getElementById('admin-menu-dropdown');
        openStoreProductsModalBtn = document.getElementById('open-store-products-modal-btn');
        openAddProductModalBtn = document.getElementById('open-add-product-modal-btn');
        openFinancialReportModalBtn = document.getElementById('open-financial-report-modal-btn');
        openExpensesModalBtn = document.getElementById('open-expenses-modal-btn');
        openUserSettingsModalBtn = document.getElementById('open-user-settings-modal-btn');
        openPriceCalculatorModalBtn = document.getElementById('open-price-calculator-modal-btn');
        exportProductsBtn = document.getElementById('export-products-btn');
        importProductsFileInput = document.getElementById('import-products-file-input');
        importProductsBtn = document.getElementById('import-products-btn');
        exportDataBtn = document.getElementById('export-data-btn');
        importFileInput = document.getElementById('import-file-input');
        importDataBtn = document.getElementById('import-data-btn');
        resetAllDataBtn = document.getElementById('reset-all-data-btn');
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
        reprintReceiptBtn = document.getElementById('reprint-receipt-btn');
        historyFilterControls = document.getElementById('history-filter-controls');
        totalTransactionsAmount = document.getElementById('total-transactions-amount');
        confirmationModal = document.getElementById('confirmation-modal');
        confirmationMessage = document.getElementById('confirmation-message');
        confirmOkBtn = document.getElementById('confirm-ok-btn');
        confirmCancelBtn = document.getElementById('confirm-cancel-btn');
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
        openPrinterSettingsBtn = document.getElementById('open-printer-settings-btn');
        printerSettingsModal = document.getElementById('printer-settings-modal');
        closePrinterSettingsModalBtn = document.getElementById('close-printer-settings-modal');
        printerStatus = document.getElementById('printer-status');
        connectPrinterBtn = document.getElementById('connect-printer-btn');
        disconnectPrinterBtn = document.getElementById('disconnect-printer-btn');
        testPrintBtn = document.getElementById('test-print-btn');
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
        nominalButtonsContainer = document.getElementById('nominal-buttons-container');
        nominalButtons = document.querySelectorAll('.nominal-btn');
        coinSoundAudio = document.getElementById('coinSound');
        resetDataModal = document.getElementById('reset-data-modal');
        resetPasswordInput = document.getElementById('reset-password-input');
        resetDataConfirmBtn = document.getElementById('reset-data-confirm-btn');
        resetDataCancelBtn = document.getElementById('reset-data-cancel-btn');
        resetDataMessage = document.getElementById('reset-data-message');
        cleanupUsersBtn = document.getElementById('cleanup-users-btn'); // NEW: Inisialisasi tombol cleanup

    const chartJsScript = document.createElement('script');
    chartJsScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    chartJsScript.onload = () => {
        renderFinancialReportChart([]);
    };
    document.head.appendChild(chartJsScript);

        // --- Inisialisasi Firebase Auth dan Listener ---
        // Gunakan onAuthStateChanged untuk mengelola state login
        firebaseFunctions.onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in.
                console.log("[Auth State] Firebase user logged in:", user.uid);

                // Muat data profil user dari Firestore
                loggedInUser = await loadUserDataFromFirestore(user.uid);

                // Jika user belum punya profil di Firestore (misal user baru yang register atau user yang profilnya terhapus)
                if (!loggedInUser) {
                    console.warn("[Auth State] User logged in but Firestore profile is missing. Attempting to create one.");
                    // Cek apakah ada admin yang sudah ada di koleksi 'users'
                    const usersCollectionRef = firebaseFunctions.collection(db, `users`);
                    const existingUsersSnapshot = await firebaseFunctions.getDocs(usersCollectionRef);
                    const adminExists = existingUsersSnapshot.docs.some(doc => doc.data().role === 'admin');

                    let roleToAssign = 'cashier'; // Default role
                    // Jika belum ada admin dan ini bukan user anonim (berarti user register dengan email/password)
                    if (!adminExists && !user.isAnonymous) {
                        roleToAssign = 'admin';
                        console.log("[Setup] First non-anonymous user, no existing admin. Assigning 'admin' role.");
                    } else if (user.isAnonymous) {
                        // User anonim selalu 'cashier' atau role terbatas
                        roleToAssign = 'cashier';
                        console.log("[Setup] Anonymous user. Assigning 'cashier' role.");
                    }

                    const usernameForProfile = user.email || `user_${user.uid.substring(0, 8)}`;
                    await createUserProfileInFirestore(user.uid, usernameForProfile, roleToAssign);
                    // Setelah membuat profil, set loggedInUser dari data yang baru dibuat
                    loggedInUser = { uid: user.uid, username: usernameForProfile, role: roleToAssign };
                }

                // Setelah loggedInUser PASTI terisi (baik baru dibuat atau dimuat dari Firestore)
                mainAppContainer.classList.remove('hidden');
                loginScreen.classList.add('hidden');
                updateCashierDisplay(); // Update display, termasuk visibilitas menu admin
                await loadDailyRevenueFromFirestore();
                await loadMonthlyFinancialDataFromFirestore();
                await checkAndResetDailyRevenue(); // Periksa dan reset pendapatan harian/bulanan
                await loadProductsFromFirestore(); // Muat produk dari Firestore
                await loadTransactionHistoryFromFirestore(); // Muat riwayat transaksi dari Firestore
                await loadExpensesFromFirestore(); // Muat pengeluaran dari Firestore
                await loadUsersFromFirestore(); // Muat daftar pengguna dari Firestore
                applyDarkMode(); // Apply dark mode state
                startNewTransaction(); // Start fresh transaction after all data loaded
                loginScreenUsernameInput.value = '';
                loginScreenPasswordInput.value = '';
                displayStatus("", "", loginScreenMessage);

            } else {
                // User is signed out.
                console.log("[Auth State] Firebase user signed out.");
                loggedInUser = null; // Clear logged in user
                loginScreen.classList.remove('hidden');
                mainAppContainer.classList.add('hidden');
                updateCashierDisplay(); // Update cashier display to "Tidak Login"
                // Clear all local data upon logout
                products = [];
                currentTransactionItems = [];
                transactionHistory = [];
                expenses = [];
                users = [];
                dailyRevenue = 0;
                monthlyNetProfit = 0;
                monthlyExpenses = 0;
                renderStoreProducts(); // Clear product table
                renderTransactionHistory(); // Clear transaction table
                renderExpenses(); // Clear expenses table
                renderUserList(); // Clear user list in settings
            }
        });

        // Otentikasi awal saat aplikasi dimuat atau di-refresh
        // Bagian ini diubah untuk TIDAK melakukan signInAnonymously secara default
        if (!auth.currentUser) {
            if (window.initialAuthToken) {
                try {
                    console.log("[Auth Init] Signing in with custom token...");
                    await firebaseFunctions.signInWithCustomToken(auth, window.initialAuthToken);
                } catch (error) {
                    console.error("[Auth Init] Error signing in with custom token:", error);
                    // Jika token kustom gagal, kita tidak melakukan fallback ke anonim,
                    // karena user harus login manual. Tampilkan layar login.
                    loginScreen.classList.remove('hidden');
                    mainAppContainer.classList.add('hidden');
                    displayStatus("Autentikasi awal gagal. Silakan login.", "error", loginScreenMessage);
                }
            } else {
                console.log("[Auth Init] No initial auth token. Displaying login screen.");
                // Jika tidak ada token awal, langsung tampilkan layar login.
                loginScreen.classList.remove('hidden');
                mainAppContainer.classList.add('hidden');
            }
        }

        // Attempt to load and reconnect to previously saved printer ID
        // (Ini tidak bergantung pada login Firebase)
        loadSavedPrinter();

        // Event listener for product code input (registered products)
        if (productCodeInput) {
            productCodeInput.addEventListener('input', function() {
                const code = this.value.trim();
                const foundProduct = products.find(p => p.id === code);

                if (foundProduct) {
                    if (foundProduct.stock !== undefined && foundProduct.stock <= 0) {
                        displayStatus(`Error: Stok ${foundProduct.name} habis. Tidak bisa menjual produk ini.`, "error");
                        productNameInput.value = '';
                        priceInput.value = '0';
                        quantityInput.value = '1';
                        return;
                    }

                    productNameInput.value = foundProduct.name;
                    priceInput.value = foundProduct.price.toLocaleString('id-ID');
                    const id = code;
                    const name = foundProduct.name;
                    const price = foundProduct.price;
                    let qty = parseInt(quantityInput.value);
                    if (isNaN(qty) || qty <= 0) qty = 1;

                    if (foundProduct.stock !== undefined && foundProduct.stock < qty) {
                        displayStatus(`Error: Stok ${foundProduct.name} tidak cukup. Stok tersedia: ${foundProduct.stock}`, "error");
                        return;
                    }

                    addProductToTransaction(id, name, price, qty);
                    productCodeInput.value = '';
                    productNameInput.value = '';
                    priceInput.value = '0';
                    quantityInput.value = '1';
                    displayStatus("", "");
                    this.focus();
                } else {
                    productNameInput.value = '';
                    priceInput.value = '0';
                    displayStatus("", "");
                }
            });
        }

        if (addRegisteredItemButton) {
            addRegisteredItemButton.addEventListener('click', function() {
                const id = productCodeInput.value.trim();
                const name = productNameInput.value.trim();
                const price = parseFloat(priceInput.value.replace(/[^0-9,-]+/g, "").replace(",", ".")) || 0;
                let qty = parseInt(quantityInput.value);
                if (isNaN(qty) || qty <= 0) qty = 1;

                const product = products.find(p => p.id === id);

                if (!id || !name || price <= 0) {
                    displayStatus("Error: Pastikan Kode Produk terisi, Nama Produk & Harga muncul untuk Produk Terdaftar.", "error");
                    return;
                }
                if (isNaN(qty) || qty <= 0) {
                    displayStatus("Error: Jumlah valid diperlukan untuk Produk Terdaftar.", "error");
                    return;
                }

                if (product && product.stock !== undefined && product.stock <= 0) {
                    displayStatus(`Error: Stok ${product.name} habis. Tidak bisa menjual produk ini.`, "error");
                    return;
                }

                if (product && product.stock !== undefined && product.stock < qty) {
                    displayStatus(`Error: Stok ${product.name} tidak cukup. Stok tersedia: ${product.stock}`, "error");
                    return;
                }

                addProductToTransaction(id, name, price, qty);
                productCodeInput.value = '';
                productNameInput.value = '';
                priceInput.value = '0';
                quantityInput.value = '1';
                displayStatus("", "");
            });
        }

        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('item-qty-input')) {
                const index = e.target.dataset.itemIndex;
                const oldQty = currentTransactionItems[index].qty;
                let newQty = parseInt(e.target.value);

                if (isNaN(newQty) || newQty < 0) {
                    newQty = 0;
                    e.target.value = 0;
                }

                const itemProductId = currentTransactionItems[index].productId;
                if (!itemProductId.startsWith('custom-')) {
                    const product = products.find(p => p.id === itemProductId);
                    if (product && product.stock !== undefined) {
                        const quantityDifference = newQty - oldQty;

                        if (quantityDifference > 0 && product.stock < (currentTransactionItems[index].qty + quantityDifference)) {
                            displayStatus(`Error: Stok ${product.name} tidak cukup. Stok tersedia: ${product.stock}`, "error");
                            e.target.value = oldQty;
                            return;
                        }
                    }
                }

                currentTransactionItems[index].qty = newQty;

                if (newQty === 0) {
                    currentTransactionItems.splice(index, 1);
                }
                renderTransactionItems();
            }

            if (e.target.id === 'paymentAmount') {
                calculateChange();
            }

            if (e.target.id === 'discountAmount') {
                renderTransactionItems();
            }
        });

        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('removeItem')) {
                const index = e.target.dataset.itemIndex;
                currentTransactionItems.splice(index, 1);
                renderTransactionItems();
            }
        });

        if (newTransactionButton) newTransactionButton.addEventListener('click', startNewTransaction);
        if (showRegisteredProductsButton) showRegisteredProductsButton.addEventListener('click', () => showSection('registered'));
        if (showCustomProductsButton) showCustomProductsButton.addEventListener('click', () => showSection('custom'));

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

            if (code) {
                const isCodeRegistered = products.some(p => p.id.toLowerCase() === code.toLowerCase());
                if (isCodeRegistered) {
                    displayStatus("Error: Kode produk kustom tidak boleh sama dengan kode produk terdaftar.", "error");
                    return;
                }
            }

            addProductToTransaction(code || 'custom', name, price, qty, true);
            if (customProductCodeInput) customProductCodeInput.value = '';
            if (customProductNameInput) customProductNameInput.value = '';
            if (customProductPriceInput) customProductPriceInput.value = '0';
            if (customProductQtyInput) customProductQtyInput.value = '1';
            displayStatus("", "");
        });

        if (printReceiptButton) printReceiptButton.addEventListener('click', processAndPrintTransaction);
        if (processOnlyPaymentButton) {
            processOnlyPaymentButton.addEventListener('click', async function() {
                const transactionRecord = await createTransactionObjectAndDecrementStock();
                if (transactionRecord) {
                    await commitTransactionData(transactionRecord);
                }
            });
        }

        if (adminMenuButton) {
            adminMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (adminMenuDropdown) {
                    adminMenuDropdown.classList.toggle('hidden');
                } else {
                    console.error('Admin menu dropdown element is null inside click handler!');
                }
            });

            document.addEventListener('click', (e) => {
                if (adminMenuDropdown && !adminMenuDropdown.contains(e.target) && !adminMenuButton.contains(e.target)) {
                    adminMenuDropdown.classList.add('hidden');
                }
            });
        }

        if (openStoreProductsModalBtn) {
            openStoreProductsModalBtn.addEventListener('click', () => {
                if (loggedInUser && loggedInUser.role === 'admin') {
                    storeProductsModal.classList.remove('hidden');
                    // renderStoreProducts() akan otomatis dipanggil karena onSnapshot
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
        if (searchStoreProductsInput) {
            searchStoreProductsInput.addEventListener('input', (e) => {
                renderStoreProducts(e.target.value);
            });
        }

        if (saveProductEditBtn) {
            saveProductEditBtn.addEventListener('click', saveProductEdit);
        }

        if (cancelProductEditBtn) {
            cancelProductEditBtn.addEventListener('click', () => {
                editProductForm.classList.add('hidden');
                storeProductsTableContainer.classList.remove('hidden');
                searchStoreProductsInput.classList.remove('hidden');
                displayStatus("", "");
            });
        }

        if (openAddProductModalBtn) {
            openAddProductModalBtn.addEventListener('click', () => {
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

        if (openExpensesModalBtn) {
            openExpensesModalBtn.addEventListener('click', () => {
                if (loggedInUser && loggedInUser.role === 'admin') {
                    expensesModal.classList.remove('hidden');
                    adminMenuDropdown.classList.add('hidden');
                    expenseDateInput.value = getTodayDateString();
                    expenseSearchInput.value = '';
                    expenseFilterStartDate.value = '';
                    expenseFilterEndDate.value = '';
                    renderExpenses();
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
        if (expensesListBody) {
            expensesListBody.addEventListener('click', (e) => {
                if (e.target.closest('.delete-expense-btn')) {
                    const expenseId = e.target.closest('.delete-expense-btn').dataset.expenseId;
                    deleteExpense(expenseId);
                }
            });
        }
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
                renderExpenses();
            });
        }

        if (openFinancialReportModalBtn) {
            openFinancialReportModalBtn.addEventListener('click', () => {
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
                displayStatus("", "");
            });
        }
        if (applyFinancialFilterBtn) {
            applyFinancialFilterBtn.addEventListener('click', calculateFinancialReport);
        }
        if (clearFinancialFilterBtn) {
            clearFinancialFilterBtn.addEventListener('click', () => {
                reportStartDateInput.value = '';
                reportEndDateInput.value = '';
                calculateFinancialReport();
            });
        }

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
                totalTransactionsAmount.parentElement.classList.remove('hidden');
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
        if (reprintReceiptBtn) {
            reprintReceiptBtn.addEventListener('click', () => {
                const transactionId = reprintReceiptBtn.dataset.transactionId;
                if (transactionId) {
                    reprintTransactionReceipt(transactionId);
                } else {
                    displayStatus("Error: Tidak ada ID transaksi untuk dicetak ulang.", "error");
                }
            });
        }

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
        if (resetAllDataBtn) {
            resetAllDataBtn.addEventListener('click', openResetDataConfirmation);
        }

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

        if (resetDataConfirmBtn) {
            resetDataConfirmBtn.addEventListener('click', async () => {
                const enteredPassword = resetPasswordInput.value;
                const currentUserId = getCurrentUserId();
                if (!currentUserId || (loggedInUser && loggedInUser.role !== 'admin')) {
                    displayStatus("Akses Ditolak: Anda tidak memiliki hak untuk mereset data.", "error", resetDataMessage);
                    return;
                }
                try {
                    // Konfirmasi ulang password admin via Firebase Auth
                    // NOTE: `loggedInUser.username` diasumsikan adalah email yang digunakan untuk login.
                    if (loggedInUser && loggedInUser.username) {
                        await firebaseFunctions.signInWithEmailAndPassword(auth, loggedInUser.username, enteredPassword);
                        await performResetAllData();
                        resetDataModal.classList.add('hidden');
                        displayStatus("Semua data aplikasi telah direset!", "success");
                    } else {
                        displayStatus("Error: Informasi login admin tidak lengkap. Coba login ulang.", "error", resetDataMessage);
                    }
                } catch (error) {
                    let errorMessage = "Kata sandi salah atau error saat login. Reset data dibatalkan.";
                    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                        errorMessage = "Kata sandi admin salah.";
                    }
                    displayStatus(`Error: ${errorMessage}`, "error", resetDataMessage);
                    console.error("Reset data login error:", error);
                }
            });
        }
        if (resetDataCancelBtn) {
            resetDataCancelBtn.addEventListener('click', () => {
                resetDataModal.classList.add('hidden');
                displayStatus("Reset data dibatalkan.", "info");
            });
        }

        if (toggleDailyRevenueVisibilityButton) {
            toggleDailyRevenueVisibilityButton.addEventListener('click', () => {
                isRevenueVisible = !isRevenueVisible;
                localStorage.setItem('pos_revenue_visibility', JSON.stringify(isRevenueVisible)); // Tetap simpan di local storage
                updateHeaderDailyRevenue();
            });
        }

        if (openUserSettingsModalBtn) {
            openUserSettingsModalBtn.addEventListener('click', openUserSettingsModal);
        }
        if (closeUserSettingsModalBtn) {
            closeUserSettingsModalBtn.addEventListener('click', closeUserSettingsModal);
        }
        if (loginScreenBtn) {
            loginScreenBtn.addEventListener('click', loginUser);
        }
        if (userSettingsLoginButton) {
            userSettingsLoginButton.addEventListener('click', userSettingsLogin);
        }
        if (logoutButton) {
            logoutButton.addEventListener('click', logoutUser);
        }
        if (addUserButton) {
            addUserButton.addEventListener('click', addNewUser);
        }
        if (userListBody) {
            userListBody.addEventListener('click', (e) => {
                if (e.target.closest('.delete-user-btn')) {
                    const userUid = e.target.closest('.delete-user-btn').dataset.uid;
                    deleteUser(userUid);
                }
            });
        }
        if (cleanupUsersBtn) { // NEW: Event listener untuk tombol cleanup user
            cleanupUsersBtn.addEventListener('click', cleanupDuplicateUsers);
        }

        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                isDarkMode = !isDarkMode;
                localStorage.setItem('pos_dark_mode', JSON.stringify(isDarkMode)); // Tetap simpan di local storage
                applyDarkMode();
                renderTransactionItems();
                renderStoreProducts(searchStoreProductsInput.value);
                renderExpenses();
                calculateFinancialReport();
            });
        }

        if (openPrinterSettingsBtn) {
            openPrinterSettingsBtn.addEventListener('click', () => {
                printerSettingsModal.classList.remove('hidden');
                adminMenuDropdown.classList.add('hidden');
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

        if (openPriceCalculatorModalBtn) {
            openPriceCalculatorModalBtn.addEventListener('click', openPriceCalculatorModal);
        }
        if (closePriceCalculatorModalBtn) {
            closePriceCalculatorModalBtn.addEventListener('click', closePriceCalculatorModal);
        }
        if (calculatePriceBtn) {
            calculatePriceBtn.addEventListener('click', calculateSellingPriceAndProfit);
        }
        if (priceCalcModalInput) priceCalcModalInput.addEventListener('input', calculateSellingPriceAndProfit);
        if (priceCalcMarginPercentInput) priceCalcMarginPercentInput.addEventListener('input', calculateSellingPriceAndProfit);
        if (priceCalcTaxPercentInput) priceCalcTaxPercentInput.addEventListener('input', calculateSellingPriceAndProfit);
        if (priceCalcDiscountPercentInput) priceCalcDiscountPercentInput.addEventListener('input', calculateSellingPriceAndProfit);
        if (priceCalcProductCodeInput) {
            priceCalcProductCodeInput.addEventListener('input', calculateSellingPriceAndProfit);
        }

        if (copyProductCodeBtn) {
            copyProductCodeBtn.addEventListener('click', () => {
                copyTextToClipboard(priceCalcProductCodeInput.value, priceCalcStatusMessage);
            });
        }
        if (copySellingPriceBtn) {
            copySellingPriceBtn.addEventListener('click', () => {
                const sellingPriceNum = priceCalcSellingPriceInput.value.replace(/[^0-9]/g, '');
                copyTextToClipboard(sellingPriceNum, priceCalcStatusMessage);
            });
        }

        if (nominalButtonsContainer) {
            nominalButtonsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('nominal-btn')) {
                    const nominalValue = parseInt(e.target.dataset.nominal);
                    if (!isNaN(nominalValue)) {
                        let currentPayment = parseFloat(paymentAmountInput.value) || 0;
                        paymentAmountInput.value = currentPayment + nominalValue;
                        calculateChange();
                    }
                }
            });
        }

    });

    // Fungsi applyDarkMode, jika belum ada
    function applyDarkMode() {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // Event listener ini tidak lagi diperlukan karena semua data sudah di-handle oleh Firestore
    // dan onAuthStateChanged untuk status login
    /*
    window.addEventListener('beforeunload', () => {
        // Save state if needed (mostly for printer ID, dark mode, revenue visibility)
        // Firestore data is saved automatically via setDoc/updateDoc/addDoc
        // and real-time listeners.
    });
    */
})(); // Akhir dari IIFE
