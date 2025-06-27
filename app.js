// ========================================================================
// SHIQ E-COMMERCE APPLICATION - FIXED VERSION v3.2
// التطبيق الموحد للتسوق الإلكتروني - الإصدار المُصحح
// ========================================================================

// ===== 1. الإعدادات المُصححة =====
const SHIQ_CONFIG = {
    // معلومات التطبيق
    APP_NAME: 'SHIQ - شي ان العراق',
    APP_VERSION: '3.2.0-FIXED',
    APP_URL: 'https://peacepanel.github.io/shein-baghdad/',
    
    // إعدادات Google Sheets API
    GOOGLE_API_KEY: 'AIzaSyATs-nWgTonTFEKCi_4F5lQ_Ao0vnJ5Xmk',
    
    // ⚠️ تعطيل Google Apps Script مؤقتاً حتى إعداده بشكل صحيح
    WEB_APP_URL: null, // سيتم تفعيله لاحقاً
    MAIN_SHEET_ID: '1ap6gkoczUsqvf0KMoxXroo2uP_wycDGxyg6r-UPFgBQ',
    
    // باقي الإعدادات...
    ECOMMERCE: {
        FREE_DELIVERY_THRESHOLD: 50000,
        DELIVERY_FEE: 5000,
        CURRENCY: 'د.ع',
        WHATSAPP_NUMBER: '9647862799748',
        PHONE_NUMBER: '07862799748'
    },
    
    STORAGE_KEYS: {
        CART_DATA: 'shiq_cart_v3',
        USER_DATA: 'shiq_user_data_v3',
        DEVICE_ID: 'shiq_device_id_v3',
        CATEGORY_IMAGES: 'shiq_category_images_v3',
        NOTIFICATIONS_STATUS: 'shiq_notifications_status_v3',
        ANALYTICS_DATA: 'shiq_analytics_v3'
    },
    
    PERFORMANCE: {
        IMAGE_CACHE_DURATION: 24 * 60 * 60 * 1000,
        API_TIMEOUT: 8000, // تقليل timeout
        RETRY_ATTEMPTS: 2 // تقليل المحاولات
    },
    
    NOTIFICATIONS: {
        ENABLED: false, // تعطيل مؤقت
        DEFAULT_ICON: './icons/icon-192x192.png',
        PERMISSION_TIMEOUT: 5000
    },
    
    GOVERNORATES: [
        'بغداد', 'البصرة', 'نينوى', 'أربيل', 'النجف', 'كربلاء',
        'بابل', 'الأنبار', 'ذي قار', 'القادسية', 'كركوك', 'واسط',
        'صلاح الدين', 'المثنى', 'ديالى', 'ميسان', 'دهوك', 'السليمانية'
    ],
    
    INTERESTS: [
        'اكسسوارات نسائية', 'احذية وحقائب', 'ملابس نسائية', 'ملابس اطفال',
        'مستلزمات منزلية', 'مستلزمات موبايل', 'مكياج وعناية', 'مفروشات'
    ]
};

// ===== 2. فئات المنتجات (بدون تغيير) =====
const PRODUCT_CATEGORIES = {
    'اكسسوارات نسائية': {
        id: 'women_accessories',
        sheetId: '1Tf1B4HqO5lnwxP8oSqzRMwmvegnIDJam-DMhQc8s5S8',
        sheets: ['تراجي', 'ساعات', 'سوار', 'كلادة', 'محابس', 'قراصات', 'اكسسوار جسم', 'شفقات', 'احزمة', 'مداليات', 'نضارات', 'مهفات'],
        columns: { image: 'F', price: 'I', code: 'A' },
        icon: '💍',
        searchable: true
    },
    'احذية وحقائب متنوعة': {
        id: 'shoes_bags',
        sheetId: '1saUoR7Z7xYI-WCUZNTs3YRZ6jEdnM6S03M15tgw-QiQ',
        sheets: ['جزدان', 'حقائب', 'سلبر نسائي', 'احذية نسائي', 'اكسسوارات اطفال', 'احذية اطفال'],
        columns: { image: 'F', price: 'I', code: 'A', size: 'G' },
        icon: '👠',
        searchable: true,
        searchPlaceholder: '🔍 ابحث بالمقاس أو نوع الحذاء...'
    },
    'ربطات وشالات': {
        id: 'scarves_ties',
        sheetId: '17mlV_BaJFQZoz-Cof1wJG6e-2X1QCRs9usoIWXmQGI8',
        sheets: ['جواريب', 'اكمام كفوف', 'شالات', 'شال كتف', 'سكارف', 'بروشات', 'ياخه'],
        columns: { image: 'F', price: 'I', code: 'A' },
        icon: '🧣',
        searchable: false
    },
    'شيكلام': {
        id: 'beauty_cosmetics',
        sheetId: '1K08r0X7XQ6ZUkUYjR8QI_91X1hX6v7K8e6181Vuz4os',
        sheets: ['اظافر', 'صبغ اظافر', 'شعر', 'فرش', 'مكياج', 'وشم', 'حقائب مكياج', 'منوع'],
        columns: { image: 'F', price: 'I', code: 'A' },
        icon: '💄',
        searchable: false
    },
    'منزلية': {
        id: 'home_items',
        sheetId: '1aLXBPsxTixs28wFi55P9ZRNU2RhqzFfjxg8Cbp4m8Rw',
        sheets: ['منوع', 'ديكورات', 'ادوات منزلية'],
        columns: { image: 'F', price: 'I', code: 'A', size: 'J' },
        icon: '🏠',
        searchable: false
    },
    'مفروشات': {
        id: 'furnishings',
        sheetId: '1s1WVVjA--0BqHfzE-ANm5pq43xkRD1vaDyNeGUAXFLk',
        sheets: ['شراشف', 'ستائر', 'ارضيات', 'وجه كوشات', 'مناشف', 'تلبيسه لحاف', 'اغطية', 'مقاعد تلبيس', 'اخرى'],
        columns: { image: 'F', price: 'I', code: 'A', size: 'J' },
        icon: '🛏️',
        searchable: false
    },
    'اطفالي صيفي': {
        id: 'kids_summer',
        sheetId: '1Rhbilfz7VaHTR-qCxdjNK_5zk52kdglYd-ADK2Mn2po',
        sheets: ['3 - 0 M', '6 - 3 M', '9 - 6 M', '12 - 9 M', '18 - 12 M', '24 - 18 M', '1 Y', '2 Y', '3 Y', '4 Y', '5 Y', '6 Y', '7 Y', '8 Y', '9 Y', '10 Y', '11 Y', '12 Y', '13 Y', '14 Y'],
        columns: { image: 'F', price: 'H', code: 'A', size: 'I' },
        icon: '👶',
        searchable: false
    },
    'اطفالي شتائي': {
        id: 'kids_winter',
        sheetId: '1JAI7pfkQiPAL-6H6DBjryPHGAPoRacY3TTajEJHy8HQ',
        sheets: ['3 - 0 M', '6 - 3 M', '9 - 6 M', '12 - 9 M', '18 - 12 M', '24 - 18 M', '1 Y', '2 Y', '3 Y', '4 Y', '5 Y', '6 Y', '7 Y', '8 Y', '9 Y', '10 Y', '11 Y', '12 Y', '13 Y', '14 Y'],
        columns: { image: 'F', price: 'H', code: 'A', size: 'I' },
        icon: '🧥',
        searchable: false
    },
    'نسائي شتائي': {
        id: 'women_winter',
        sheetId: '1cXt49H5Wy1jGB0jrutp8JviLq3qSHo7VQuCoBclDRAI',
        sheets: ['5XL', '4XL', '3XL', '2XL', '1XL', '0XL', 'XL', 'L', 'M', 'S', 'XS', 'one size'],
        columns: { image: 'F', price: 'H', code: 'A', size: 'D' },
        icon: '🧥',
        searchable: false
    },
    'نسائي صيفي': {
        id: 'women_summer',
        sheetId: '1POUe8K4EadYctDbTr1hnpKJ_r6slAVaX6VWyfbGYBFE',
        sheets: ['5XL', '4XL', '3XL', '2XL', '1XL', '0XL', 'XL', 'L', 'M', 'S', 'XS', 'one size'],
        columns: { image: 'F', price: 'H', code: 'A', size: 'D' },
        icon: '👗',
        searchable: false
    },
    'مستلزمات موبايل': {
        id: 'mobile_accessories',
        sheetId: '1xMFXIY4EjjbEnGVK-8m_Q8G9Ng-2NJ93kPkdpfVQuGk',
        sheets: ['كفرات موبايل', 'ملحقات اخرى'],
        columns: { image: 'F', price: 'I', code: 'A', size: 'G' },
        icon: '📱',
        searchable: true,
        searchPlaceholder: '🔍 ابحث بنوع الموبايل أو الاكسسوار...'
    }
};

// ===== 3. سلة التسوق المُصححة =====
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }
    
    addItem(product) {
        try {
            const existingIndex = this.items.findIndex(item => item.code === product.code);
            if (existingIndex !== -1) {
                this.items[existingIndex].quantity += 1;
                this.items[existingIndex].lastUpdated = new Date().toISOString();
            } else {
                this.items.push({
                    id: this.generateItemId(),
                    code: product.code,
                    name: product.name,
                    price: parseFloat(product.price) || 0,
                    imageUrl: product.imageUrl,
                    size: product.size || null,
                    quantity: 1,
                    addedAt: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                });
            }
            this.saveToStorage();
            this.updateUI();
            
            // تتبع مبسط بدون خطأ
            console.log('تم إضافة منتج للسلة:', product.name);
            
            return true;
        } catch (error) {
            console.error('خطأ في إضافة منتج للسلة:', error);
            return false;
        }
    }
    
    removeItem(itemId) {
        try {
            this.items = this.items.filter(item => item.id !== itemId);
            this.saveToStorage();
            this.updateUI();
        } catch (error) {
            console.error('خطأ في حذف منتج من السلة:', error);
        }
    }
    
    updateQuantity(itemId, newQuantity) {
        try {
            if (newQuantity <= 0) {
                this.removeItem(itemId);
                return;
            }
            
            const item = this.items.find(item => item.id === itemId);
            if (item) {
                item.quantity = newQuantity;
                item.lastUpdated = new Date().toISOString();
                this.saveToStorage();
                this.updateUI();
            }
        } catch (error) {
            console.error('خطأ في تحديث كمية المنتج:', error);
        }
    }
    
    clear() {
        try {
            this.items = [];
            this.saveToStorage();
            this.updateUI();
        } catch (error) {
            console.error('خطأ في تفريغ السلة:', error);
        }
    }
    
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    getTotalPrice() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    getDeliveryFee() {
        const subtotal = this.getTotalPrice();
        return subtotal >= SHIQ_CONFIG.ECOMMERCE.FREE_DELIVERY_THRESHOLD ? 0 : SHIQ_CONFIG.ECOMMERCE.DELIVERY_FEE;
    }
    
    getFinalTotal() {
        return this.getTotalPrice() + this.getDeliveryFee();
    }
    
    generateItemId() {
        return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    saveToStorage() {
        try {
            const cartData = {
                items: this.items,
                lastUpdated: new Date().toISOString(),
                version: SHIQ_CONFIG.APP_VERSION
            };
            localStorage.setItem(SHIQ_CONFIG.STORAGE_KEYS.CART_DATA, JSON.stringify(cartData));
        } catch (error) {
            console.error('خطأ في حفظ السلة:', error);
        }
    }
    
    loadFromStorage() {
        try {
            const cartData = localStorage.getItem(SHIQ_CONFIG.STORAGE_KEYS.CART_DATA);
            if (cartData) {
                const parsed = JSON.parse(cartData);
                this.items = parsed.items || [];
            }
        } catch (error) {
            console.error('خطأ في تحميل السلة:', error);
            this.items = [];
        }
    }
    
    updateUI() {
        this.updateCartButton();
        this.updateProductButtons();
    }
    
    updateCartButton() {
        const cartButton = document.querySelector('.cart-button');
        if (cartButton) {
            const totalItems = this.getTotalItems();
            const totalPrice = this.getTotalPrice();
            
            if (totalItems > 0) {
                cartButton.innerHTML = `
                    <span>🛒</span>
                    <span>السلة (${totalItems})</span>
                    <span style="font-size: 0.9em; opacity: 0.9;">${totalPrice.toLocaleString()} ${SHIQ_CONFIG.ECOMMERCE.CURRENCY}</span>
                `;
                cartButton.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            } else {
                cartButton.innerHTML = `
                    <span>🛒</span>
                    <span>السلة فارغة</span>
                `;
                cartButton.style.background = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';
            }
        }
    }
    
    updateProductButtons() {
        const buttons = document.querySelectorAll('.add-to-cart-btn');
        buttons.forEach(btn => {
            const productCode = btn.getAttribute('data-product-code');
            const isInCart = this.items.some(item => item.code === productCode);
            
            if (isInCart) {
                btn.classList.add('selected');
                btn.innerHTML = '✅ في السلة';
            } else {
                btn.classList.remove('selected');
                btn.innerHTML = '🛒 أضف للسلة';
            }
        });
    }
}

// ===== 4. إدارة المستخدمين المُصححة =====
class UserManager {
    constructor() {
        this.currentUser = null;
        this.deviceId = null;
        this.isInitializing = false; // منع التهيئة المتكررة
    }
    
    async initialize() {
        if (this.isInitializing) {
            console.warn('UserManager يتم تهيئته بالفعل');
            return;
        }
        
        this.isInitializing = true;
        
        try {
            this.deviceId = this.getOrCreateDeviceId();
            this.currentUser = this.loadUserData();
            
            if (this.currentUser) {
                this.updateLastActivity();
                this.showWelcomeBack();
                this.updateUI();
            }
            
            console.log('👤 نظام إدارة المستخدمين جاهز');
        } catch (error) {
            console.error('خطأ في تهيئة إدارة المستخدمين:', error);
        } finally {
            this.isInitializing = false;
        }
    }
    
    getOrCreateDeviceId() {
        let deviceId = localStorage.getItem(SHIQ_CONFIG.STORAGE_KEYS.DEVICE_ID);
        
        if (!deviceId) {
            deviceId = this.generateDeviceId();
            localStorage.setItem(SHIQ_CONFIG.STORAGE_KEYS.DEVICE_ID, deviceId);
        }
        
        return deviceId;
    }
    
    generateDeviceId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        const fingerprint = this.createFingerprint();
        return `SHIQ_DEVICE_${timestamp}_${fingerprint}_${random}`;
    }
    
    createFingerprint() {
        try {
            const data = [
                navigator.userAgent,
                navigator.language,
                screen.width,
                screen.height,
                new Date().getTimezoneOffset()
            ].join('|');
            
            return btoa(data).slice(0, 8);
        } catch (error) {
            return 'DEFAULT';
        }
    }
    
    loadUserData() {
        try {
            const userData = localStorage.getItem(SHIQ_CONFIG.STORAGE_KEYS.USER_DATA);
            if (userData) {
                const user = JSON.parse(userData);
                return this.validateUserData(user) ? user : null;
            }
        } catch (error) {
            console.error('خطأ في تحميل بيانات المستخدم:', error);
        }
        return null;
    }
    
    validateUserData(user) {
        const required = ['id', 'name', 'phone', 'governorate'];
        return required.every(field => user[field]);
    }
    
    async saveUserData(userData) {
        try {
            const user = {
                id: userData.id || this.generateUserId(),
                name: userData.name.trim(),
                phone: userData.phone.trim(),
                governorate: userData.governorate,
                address: userData.address?.trim() || '',
                gender: userData.gender || '',
                interests: Array.isArray(userData.interests) ? userData.interests : [],
                notificationsEnabled: userData.notificationsEnabled || false,
                registrationDate: userData.registrationDate || new Date().toISOString(),
                lastActive: new Date().toISOString(),
                version: SHIQ_CONFIG.APP_VERSION,
                deviceId: this.deviceId
            };
            
            if (!this.validateUserData(user)) {
                throw new Error('بيانات المستخدم غير مكتملة');
            }
            
            // حفظ محلياً (الأولوية الوحيدة حالياً)
            localStorage.setItem(SHIQ_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
            this.currentUser = user;
            
            console.log('✅ تم حفظ بيانات المستخدم محلياً');
            
            // ملاحظة: إرسال للخادم معطل مؤقتاً
            if (SHIQ_CONFIG.WEB_APP_URL) {
                console.log('⚠️ إرسال البيانات للخادم معطل مؤقتاً');
            }
            
            this.updateUI();
            
            return { success: true, user: user };
            
        } catch (error) {
            console.error('❌ خطأ في حفظ بيانات المستخدم:', error);
            return { success: false, error: error.message };
        }
    }
    
    generateUserId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `SHIQ_USER_${timestamp}_${random}`;
    }
    
    updateLastActivity() {
        if (this.currentUser) {
            this.currentUser.lastActive = new Date().toISOString();
            localStorage.setItem(SHIQ_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(this.currentUser));
        }
    }
    
    showWelcomeBack() {
        if (this.currentUser) {
            const firstName = this.currentUser.name.split(' ')[0];
            const welcomeMessage = `أهلاً بعودتك ${firstName} من ${this.currentUser.governorate} 👋`;
            
            setTimeout(() => {
                this.showToast(welcomeMessage, 'success');
            }, 1000);
        }
    }
    
    updateUI() {
        const welcomeDiv = document.getElementById('userWelcome');
        const profileBtn = document.getElementById('userProfileBtn');
        
        if (this.currentUser && welcomeDiv) {
            const firstName = this.currentUser.name.split(' ')[0];
            welcomeDiv.innerHTML = `مرحباً ${firstName} من ${this.currentUser.governorate} 👋`;
            welcomeDiv.style.display = 'inline-block';
        }
        
        if (profileBtn) {
            profileBtn.classList.add('show');
        }
    }
    
    showRegistrationForm() {
        const modal = this.createRegistrationModal();
        document.body.appendChild(modal);
        modal.classList.add('show');
    }
    
    createRegistrationModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'unified-user-registration';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🙋‍♀️ مرحباً بك في شي ان العراق</h2>
                    <p>نحتاج بعض المعلومات لتحسين تجربة التسوق</p>
                    <button type="button" class="close-modal-btn" onclick="this.closest('.modal').remove()" style="position: absolute; top: 15px; left: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">×</button>
                </div>
                
                <form id="unified-registration-form">
                    <div class="form-group">
                        <label for="userName">الاسم الكامل *</label>
                        <input type="text" id="userName" class="form-control" placeholder="مثال: أحمد محمد" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="userPhone">رقم الهاتف *</label>
                        <input type="tel" id="userPhone" class="form-control" placeholder="مثال: 07901234567" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="userGovernorate">المحافظة *</label>
                        <select id="userGovernorate" class="form-control" required>
                            <option value="">اختر المحافظة</option>
                            ${SHIQ_CONFIG.GOVERNORATES.map(gov => `<option value="${gov}">${gov}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="userAddress">العنوان التفصيلي *</label>
                        <textarea id="userAddress" class="form-control" rows="3" placeholder="مثال: حي الجامعة، شارع الكندي، بناية رقم 15" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="userGender">الجنس</label>
                        <select id="userGender" class="form-control">
                            <option value="">اختياري</option>
                            <option value="female">أنثى</option>
                            <option value="male">ذكر</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>الاهتمامات (اختر ما يناسبك)</label>
                        <div class="interests-grid">
                            ${SHIQ_CONFIG.INTERESTS.map(interest => `
                                <label class="interest-item">
                                    <input type="checkbox" value="${interest}">
                                    <span>${interest}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        💾 حفظ البيانات والمتابعة
                    </button>
                </form>
            </div>
        `;
        
        // إضافة أنماط التصميم
        this.addModalStyles();
        
        // إضافة الأحداث
        const form = modal.querySelector('#unified-registration-form');
        form.addEventListener('submit', (e) => this.handleRegistrationSubmit(e));
        
        return modal;
    }
    
    addModalStyles() {
        if (document.querySelector('#unified-modal-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'unified-modal-styles';
        style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 3000;
                backdrop-filter: blur(5px);
            }
            
            .modal.show {
                display: flex;
            }
            
            .modal-content {
                background: white;
                border-radius: 20px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                max-height: 85vh;
                overflow-y: auto;
                animation: modalSlideIn 0.3s ease;
                position: relative;
            }
            
            @keyframes modalSlideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .modal-header {
                text-align: center;
                margin-bottom: 25px;
            }
            
            .modal-header h2 {
                color: #8B5CF6;
                font-size: 1.8rem;
                margin-bottom: 10px;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #374151;
            }
            
            .form-control {
                width: 100%;
                padding: 12px 15px;
                border: 2px solid #E5E7EB;
                border-radius: 10px;
                font-size: 1rem;
                transition: all 0.3s ease;
                font-family: inherit;
            }
            
            .form-control:focus {
                outline: none;
                border-color: #8B5CF6;
                box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
            }
            
            .interests-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 10px;
                margin-top: 10px;
            }
            
            .interest-item {
                display: flex;
                align-items: center;
                font-weight: normal;
                cursor: pointer;
                padding: 5px;
                border-radius: 5px;
                transition: background 0.2s;
            }
            
            .interest-item:hover {
                background: #f3f4f6;
            }
            
            .interest-item input {
                margin-left: 8px;
            }
            
            .btn {
                background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
                color: white;
                border: none;
                padding: 15px 25px;
                border-radius: 10px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
                margin-top: 10px;
            }
            
            .btn:hover {
                background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    padding: 20px;
                }
                
                .interests-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    async handleRegistrationSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '⏳ جاري الحفظ...';
        submitButton.disabled = true;
        
        try {
            const interests = Array.from(event.target.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.value);
            
            const userData = {
                name: document.getElementById('userName').value.trim(),
                phone: document.getElementById('userPhone').value.trim(),
                governorate: document.getElementById('userGovernorate').value,
                address: document.getElementById('userAddress').value.trim(),
                gender: document.getElementById('userGender').value,
                interests: interests,
                notificationsEnabled: false // معطل مؤقتاً
            };
            
            if (!this.validateFormData(userData)) {
                return;
            }
            
            const result = await this.saveUserData(userData);
            
            if (result.success) {
                this.closeRegistrationModal();
                this.showToast('🎉 مرحباً بك! تم تسجيلك بنجاح', 'success');
            } else {
                this.showToast('❌ ' + result.error, 'error');
            }
            
        } catch (error) {
            console.error('خطأ في معالجة النموذج:', error);
            this.showToast('❌ حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى', 'error');
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    }
    
    validateFormData(userData) {
        const name = (userData.name || '').trim();

        if (name.length === 0 || name.length > 40) {
            this.showToast('❌ يرجى إدخال اسم صحيح (حتى 40 حرفًا)', 'error');
            return false;
        }

        if (!userData.phone || !/^07[0-9]{9}$/.test(userData.phone)) {
            this.showToast('❌ رقم الهاتف غير صحيح. يجب أن يبدأ بـ 07 ويتكون من 11 رقم', 'error');
            return false;
        }

        if (!userData.governorate) {
            this.showToast('❌ يرجى اختيار المحافظة', 'error');
            return false;
        }

        if (!userData.address || userData.address.length < 10) {
            this.showToast('❌ يرجى إدخال عنوان تفصيلي', 'error');
            return false;
        }

        return true;
    }
    
    closeRegistrationModal() {
        const modal = document.getElementById('unified-user-registration');
        if (modal) {
            modal.remove();
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: ${colors[type]};
            color: white; padding: 15px 20px; border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 10001;
            font-weight: 600; max-width: 350px; font-family: 'Segoe UI', sans-serif;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 4000);
    }
}

// ===== 5. إدارة الصور (بدون تغيير كبير) =====
class ImageManager {
    constructor() {
        this.cache = {};
        this.loadCache();
    }
    
    async getCategoryImage(categoryName, categoryConfig) {
        if (this.cache[categoryName] && this.isCacheValid(categoryName)) {
            return this.cache[categoryName].url;
        }
        
        for (const sheetName of categoryConfig.sheets) {
            try {
                const imageUrl = await this.searchImageInSheet(categoryConfig.sheetId, sheetName, categoryConfig.columns);
                if (imageUrl) {
                    this.setCacheItem(categoryName, imageUrl);
                    return imageUrl;
                }
            } catch (error) {
                console.warn(`خطأ في البحث في ورقة ${sheetName}:`, error);
                continue;
            }
        }
        
        return null;
    }
    
    async searchImageInSheet(sheetId, sheetName, columns) {
        const range = `${sheetName}!${columns.image}2:${columns.price}20`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${SHIQ_CONFIG.GOOGLE_API_KEY}`;
        
        const response = await this.fetchWithRetry(url);
        const data = await response.json();
        
        if (data.values && data.values.length > 0) {
            for (const row of data.values) {
                const imageUrl = row[0];
                const price = this.getPriceFromRow(row, columns);
                
                if (imageUrl && price && this.isValidImageUrl(imageUrl)) {
                    return this.convertToDirectLink(imageUrl);
                }
            }
        }
        
        return null;
    }
    
    async fetchWithRetry(url, retries = SHIQ_CONFIG.PERFORMANCE.RETRY_ATTEMPTS) {
        for (let i = 0; i < retries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), SHIQ_CONFIG.PERFORMANCE.API_TIMEOUT);
                
                const response = await fetch(url, {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    return response;
                }
                
                if (i === retries - 1) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                if (i === retries - 1) {
                    throw error;
                }
                await this.delay(1000 * (i + 1));
            }
        }
    }
    
    getPriceFromRow(row, columns) {
        const imageColIndex = this.getColumnIndex(columns.image);
        const priceColIndex = this.getColumnIndex(columns.price);
        const relativePriceIndex = priceColIndex - imageColIndex;
        return row[relativePriceIndex];
    }
    
    getColumnIndex(colLetter) {
        return colLetter.charCodeAt(0) - 65;
    }
    
    isValidImageUrl(url) {
        if (!url || typeof url !== 'string') return false;
        if (!url.toLowerCase().includes('http')) return false;
        
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const hasImageExtension = imageExtensions.some(ext => url.toLowerCase().includes(ext));
        const isGoogleDrive = url.includes('drive.google.com') || url.includes('googleusercontent.com');
        
        return hasImageExtension || isGoogleDrive;
    }
    
    convertToDirectLink(url) {
        if (url.includes('drive.google.com/file/d/')) {
            const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (fileIdMatch && fileIdMatch[1]) {
                return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
            }
        }
        return url;
    }
    
    setCacheItem(key, url) {
        this.cache[key] = {
            url: url,
            timestamp: Date.now()
        };
        this.saveCache();
    }
    
    isCacheValid(key) {
        const item = this.cache[key];
        if (!item) return false;
        
        const age = Date.now() - item.timestamp;
        return age < SHIQ_CONFIG.PERFORMANCE.IMAGE_CACHE_DURATION;
    }
    
    loadCache() {
        try {
            const cached = localStorage.getItem(SHIQ_CONFIG.STORAGE_KEYS.CATEGORY_IMAGES);
            if (cached) {
                const parsed = JSON.parse(cached);
                this.cache = parsed.images || {};
            }
        } catch (error) {
            console.error('خطأ في تحميل كاش الصور:', error);
            this.cache = {};
        }
    }
    
    saveCache() {
        try {
            const cacheData = {
                images: this.cache,
                timestamp: Date.now(),
                version: SHIQ_CONFIG.APP_VERSION
            };
            localStorage.setItem(SHIQ_CONFIG.STORAGE_KEYS.CATEGORY_IMAGES, JSON.stringify(cacheData));
        } catch (error) {
            console.error('خطأ في حفظ كاش الصور:', error);
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== 6. واجهة المستخدم =====
class UIManager {
    constructor(cart, imageManager) {
        this.cart = cart;
        this.imageManager = imageManager;
        this.currentCategory = '';
        this.currentSheet = '';
        this.initializeElements();
    }
    
    initializeElements() {
        this.categoryContainer = document.getElementById('categoryContainer');
        this.categoryNav = document.getElementById('category-nav');
        this.workbookContainer = document.getElementById('workbook-container');
        this.productContainer = document.getElementById('product-container');
        this.searchBox = document.getElementById('searchBox');
        this.overlay = document.getElementById('overlay');
    }
    
    async renderCategories() {
        if (!this.categoryContainer) return;
        
        this.categoryContainer.innerHTML = '';
        
        for (const [categoryName, config] of Object.entries(PRODUCT_CATEGORIES)) {
            const categoryElement = await this.createCategoryElement(categoryName, config);
            this.categoryContainer.appendChild(categoryElement);
        }
    }
    
    async createCategoryElement(categoryName, config) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        
        const defaultImage = this.getDefaultCategoryImage();
        
        categoryDiv.innerHTML = `
            <img src="${defaultImage}" alt="${categoryName}" loading="lazy" onerror="this.src='${defaultImage}'">
            <div class="category-name">${config.icon} ${categoryName}</div>
        `;
        
        this.loadCategoryImageAsync(categoryName, config, categoryDiv);
        
        categoryDiv.onclick = () => {
            this.selectCategory(categoryName, config);
            console.log('تم اختيار فئة:', categoryName);
        };
        
        return categoryDiv;
    }
    
    async loadCategoryImageAsync(categoryName, config, element) {
        try {
            const imageUrl = await this.imageManager.getCategoryImage(categoryName, config);
            if (imageUrl) {
                const imgElement = element.querySelector('img');
                if (imgElement) {
                    imgElement.src = imageUrl;
                }
            }
        } catch (error) {
            console.warn(`لا يمكن تحميل صورة الفئة ${categoryName}:`, error);
        }
    }
    
    createCategoryNavigation() {
        if (!this.categoryNav) return;
        
        this.categoryNav.innerHTML = '';
        
        Object.entries(PRODUCT_CATEGORIES).forEach(([categoryName, config]) => {
            const navBtn = document.createElement('button');
            navBtn.className = 'nav-category-btn';
            navBtn.textContent = `${config.icon} ${categoryName}`;
            navBtn.onclick = () => {
                this.setActiveNavButton(navBtn);
                this.selectCategory(categoryName, config);
                console.log('تم اختيار فئة من الشريط:', categoryName);
            };
            this.categoryNav.appendChild(navBtn);
        });
    }
    
    setActiveNavButton(activeBtn) {
        document.querySelectorAll('.nav-category-btn').forEach(btn => 
            btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    
    selectCategory(categoryName, config) {
        this.currentCategory = categoryName;
        this.showWorkbooks(config);
        this.setupSearch(config);
        this.clearProducts();
    }
    
    showWorkbooks(config) {
        if (!this.workbookContainer) return;
        
        this.workbookContainer.innerHTML = '';
        
        config.sheets.forEach(sheetName => {
            const workbookBtn = document.createElement('button');
            workbookBtn.className = 'workbook-button';
            workbookBtn.textContent = sheetName;
            workbookBtn.onclick = () => this.loadProducts(config, sheetName);
            this.workbookContainer.appendChild(workbookBtn);
        });
        
        this.workbookContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    setupSearch(config) {
        if (!this.searchBox) return;
        
        if (config.searchable) {
            this.searchBox.style.display = 'block';
            this.searchBox.placeholder = config.searchPlaceholder || '🔍 ابحث في المنتجات...';
            this.searchBox.value = '';
        } else {
            this.searchBox.style.display = 'none';
        }
    }
    
    async loadProducts(config, sheetName) {
        this.currentSheet = sheetName;
        this.showLoadingState();
        
        try {
            const products = await this.fetchProducts(config, sheetName);
            this.renderProducts(products, config);
        } catch (error) {
            this.showErrorState(error.message);
            console.error('خطأ في تحميل المنتجات:', error);
        }
    }
    
    async fetchProducts(config, sheetName) {
        const range = `${sheetName}!A1:O`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${range}?key=${SHIQ_CONFIG.GOOGLE_API_KEY}`;
        
        const response = await this.imageManager.fetchWithRetry(url);
        const data = await response.json();
        
        if (!data.values || data.values.length < 2) {
            throw new Error('لا توجد منتجات في هذا القسم');
        }
        
        return data.values.slice(1).filter(row => row[0] && row[this.imageManager.getColumnIndex(config.columns.image)]);
    }
    
    renderProducts(products, config) {
        if (!this.productContainer) return;
        
        this.productContainer.innerHTML = '';
        
        if (products.length === 0) {
            this.showEmptyState();
            return;
        }
        
        products.forEach(productRow => {
            const product = this.parseProductData(productRow, config);
            if (product) {
                product.category = this.currentCategory;
                const productElement = this.createProductElement(product);
                this.productContainer.appendChild(productElement);
            }
        });
        
        this.productContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    parseProductData(row, config) {
        const cols = config.columns;
        
        return {
            code: row[this.imageManager.getColumnIndex(cols.code)] || '',
            name: row[0] || '',
            price: row[this.imageManager.getColumnIndex(cols.price)] || '',
            imageUrl: row[this.imageManager.getColumnIndex(cols.image)] || '',
            size: cols.size ? row[this.imageManager.getColumnIndex(cols.size)] : null
        };
    }
    
    createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        
        const defaultProductImage = this.getDefaultProductImage();
        const isInCart = this.cart.items.some(item => item.code === product.code);
        
        productDiv.innerHTML = `
            <img src="${product.imageUrl || defaultProductImage}" 
                 alt="${product.name}" 
                 onclick="ui.enlargeImage('${product.imageUrl}')"
                 onerror="this.src='${defaultProductImage}'" 
                 loading="lazy">
            <div class="product-info">
                <div class="product-code">${product.name}</div>
                <div class="product-price">
                    <span class="price-icon">💰</span>
                    ${parseInt(product.price || 0).toLocaleString()} ${SHIQ_CONFIG.ECOMMERCE.CURRENCY}
                </div>
                ${product.size ? `
                    <div class="product-size">
                        <span class="size-icon">📏</span>
                        المقاس: ${product.size}
                    </div>
                ` : ''}
                <button class="add-to-cart-btn ${isInCart ? 'selected' : ''}" 
                        data-product-code="${product.code}"
                        onclick="ui.addToCart('${product.code}', '${product.name}', '${product.price}', '${product.imageUrl}', '${product.size || ''}', '${product.category || ''}')">
                    ${isInCart ? '✅ في السلة' : '🛒 أضف للسلة'}
                </button>
            </div>
        `;
        
        return productDiv;
    }
    
    addToCart(code, name, price, imageUrl, size, category) {
        const success = this.cart.addItem({
            code, name, price, imageUrl, size, category
        });
        
        if (success) {
            this.showToast(`✅ تم إضافة "${name}" للسلة`, 'success');
        }
    }
    
    openCart() {
        if (this.cart.getTotalItems() === 0) {
            this.showToast('🛒 السلة فارغة! أضف بعض المنتجات أولاً', 'warning');
            return;
        }
        
        // التحقق من وجود بيانات المستخدم
        if (window.userManager && !window.userManager.currentUser) {
            this.showToast('📝 يرجى تسجيل بياناتك أولاً لإكمال الطلب', 'info');
            setTimeout(() => {
                window.userManager.showRegistrationForm();
            }, 500);
            return;
        }
        
        this.createCartWindow();
    }
    
    createCartWindow() {
        const subtotal = this.cart.getTotalPrice();
        const deliveryFee = this.cart.getDeliveryFee();
        const total = this.cart.getFinalTotal();
        const user = window.userManager?.currentUser;
        
        let itemsHtml = '';
        this.cart.items.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            itemsHtml += `
                <div class="cart-item" style="display: flex; align-items: center; padding: 15px; border: 2px solid #e5e7eb; margin: 10px 0; border-radius: 15px; background: #f9fafb;">
                    <img src="${item.imageUrl}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px; margin-left: 15px;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; color: #1f2937;">${item.name}</h4>
                        <p style="margin: 0; color: #ef4444; font-weight: bold;">${item.price.toLocaleString()} ${SHIQ_CONFIG.ECOMMERCE.CURRENCY} × ${item.quantity}</p>
                        <p style="margin: 5px 0 0 0; color: #059669; font-weight: bold;">المجموع: ${itemTotal.toLocaleString()} ${SHIQ_CONFIG.ECOMMERCE.CURRENCY}</p>
                        ${item.size ? `<p style="margin: 2px 0; color: #6b7280;">المقاس: ${item.size}</p>` : ''}
                    </div>
                    <div style="text-align: center;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <button onclick="window.opener.cart.updateQuantity('${item.id}', ${item.quantity - 1}); window.close(); window.opener.ui.openCart();" 
                                    style="width: 30px; height: 30px; border: none; background: #ef4444; color: white; border-radius: 50%; cursor: pointer;">-</button>
                            <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.quantity}</span>
                            <button onclick="window.opener.cart.updateQuantity('${item.id}', ${item.quantity + 1}); window.close(); window.opener.ui.openCart();" 
                                    style="width: 30px; height: 30px; border: none; background: #10b981; color: white; border-radius: 50%; cursor: pointer;">+</button>
                        </div>
                        <button onclick="window.opener.cart.removeItem('${item.id}'); window.close(); window.opener.ui.openCart();" 
                                style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 10px; cursor: pointer;">🗑️ حذف</button>
                    </div>
                </div>
            `;
        });
        
        const cartWindow = window.open('', '_blank', 'width=800,height=700,scrollbars=yes');
        cartWindow.document.write(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>🛒 مراجعة السلة - ${SHIQ_CONFIG.APP_NAME}</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); direction: rtl; margin: 0; min-height: 100vh; }
                    .container { background: white; border-radius: 20px; padding: 25px; max-width: 900px; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
                    h1 { text-align: center; color: #1f2937; margin-bottom: 30px; font-size: 2rem; }
                    .user-info { background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%); color: white; padding: 15px; border-radius: 15px; margin-bottom: 20px; }
                    .summary { background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); padding: 20px; border-radius: 15px; margin: 20px 0; border: 2px solid #8B5CF6; }
                    .summary-row { display: flex; justify-content: space-between; margin: 10px 0; font-size: 1.1rem; }
                    .total-row { font-weight: bold; font-size: 1.3rem; color: #1f2937; border-top: 2px solid #8B5CF6; padding-top: 10px; margin-top: 15px; }
                    .btn-primary { display: block; width: 100%; text-align: center; padding: 20px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; text-decoration: none; border-radius: 50px; margin: 25px 0; font-size: 1.2rem; font-weight: 700; border: none; cursor: pointer; }
                    .btn-secondary { background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; margin: 0 5px; }
                    .delivery-note { background: #fef3c7; border: 2px solid #f59e0b; color: #92400e; padding: 10px; border-radius: 10px; margin: 10px 0; text-align: center; }
                    .free-delivery-note { background: #d1fae5; border: 2px solid #10b981; color: #047857; padding: 10px; border-radius: 10px; margin: 10px 0; text-align: center; }
                </style>
            </head>
            
            <body>
                <div class="container">
                    <h1>🛒 مراجعة السلة - ${SHIQ_CONFIG.APP_NAME}</h1>
                    
                    ${user ? `
                        <div class="user-info">
                            <h3>👤 معلومات العميل</h3>
                            <p><strong>الاسم:</strong> ${user.name}</p>
                            <p><strong>الهاتف:</strong> ${user.phone}</p>
                            <p><strong>المحافظة:</strong> ${user.governorate}</p>
                            <p><strong>العنوان:</strong> ${user.address}</p>
                        </div>
                    ` : ''}
                    
                    <div style="margin: 20px 0;">
                        <h3>📦 المنتجات المطلوبة (${this.cart.items.length} منتج)</h3>
                        ${itemsHtml}
                    </div>
                    
                    <div class="summary">
                        <h3 style="color: #8B5CF6; margin-bottom: 15px;">📊 ملخص الطلب</h3>
                        <div class="summary-row">
                            <span>المجموع الفرعي:</span>
                            <span>${subtotal.toLocaleString()} ${SHIQ_CONFIG.ECOMMERCE.CURRENCY}</span>
                        </div>
                        <div class="summary-row">
                            <span>رسوم التوصيل:</span>
                            <span>${deliveryFee === 0 ? 'مجاني 🎉' : deliveryFee.toLocaleString() + ' ' + SHIQ_CONFIG.ECOMMERCE.CURRENCY}</span>
                        </div>
                        ${deliveryFee === 0 
                            ? '<div class="free-delivery-note">🎉 تم تفعيل التوصيل المجاني!</div>' 
                            : `<div class="delivery-note">💡 أضف ${(SHIQ_CONFIG.ECOMMERCE.FREE_DELIVERY_THRESHOLD - subtotal).toLocaleString()} ${SHIQ_CONFIG.ECOMMERCE.CURRENCY} للحصول على توصيل مجاني!</div>`
                        }
                        <div class="summary-row total-row">
                            <span>المجموع الكلي:</span>
                            <span>${total.toLocaleString()} ${SHIQ_CONFIG.ECOMMERCE.CURRENCY}</span>
                        </div>
                    </div>
                    
                    <button class="btn-primary" onclick="sendToWhatsApp()">
                        📱 إرسال الطلب عبر واتساب
                    </button>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button class="btn-secondary" onclick="window.opener.cart.clear(); window.close();">🧹 تفريغ السلة</button>
                        <button class="btn-secondary" onclick="window.close();">❌ إغلاق</button>
                    </div>
                </div>
                
                <script>
                    function sendToWhatsApp() {
                        const message = createWhatsAppMessage();
                        const whatsappUrl = 'https://api.whatsapp.com/send?phone=${SHIQ_CONFIG.ECOMMERCE.WHATSAPP_NUMBER}&text=' + encodeURIComponent(message);
                        window.open(whatsappUrl, '_blank');
                        window.close();
                    }
                    
                    function createWhatsAppMessage() {
                        let message = '🛍️ طلب جديد من ${SHIQ_CONFIG.APP_NAME}\\n\\n';
                        
                        ${user ? `
                            message += '👤 معلومات العميل:\\n';
                            message += '📛 الاسم: ${user.name}\\n';
                            message += '📞 الهاتف: ${user.phone}\\n';
                            message += '🏠 المحافظة: ${user.governorate}\\n';
                            message += '📍 العنوان: ${user.address}\\n\\n';
                        ` : ''}
                        
                        message += '📦 المنتجات المطلوبة:\\n';
                        
                        const items = ${JSON.stringify(this.cart.items)};
                        items.forEach((item, index) => {
                            message += '\\n' + (index + 1) + '. ' + item.name;
                            message += '\\n   💰 السعر: ' + item.price.toLocaleString() + ' ${SHIQ_CONFIG.ECOMMERCE.CURRENCY}';
                            message += '\\n   📦 الكمية: ' + item.quantity;
                            if (item.size) message += '\\n   📏 المقاس: ' + item.size;
                            message += '\\n   🖼️ رابط الصورة: ' + item.imageUrl;
                            message += '\\n   💵 المجموع الفرعي: ' + (item.price * item.quantity).toLocaleString() + ' ${SHIQ_CONFIG.ECOMMERCE.CURRENCY}';
                            message += '\\n';
                        });
                        
                        message += '\\n📊 ملخص الطلب:\\n';
                        message += '💰 المجموع الفرعي: ${subtotal.toLocaleString()} ${SHIQ_CONFIG.ECOMMERCE.CURRENCY}\\n';
                        message += '🚚 رسوم التوصيل: ${deliveryFee === 0 ? 'مجاني 🎉' : deliveryFee.toLocaleString() + ' ' + SHIQ_CONFIG.ECOMMERCE.CURRENCY}\\n';
                        message += '💵 المجموع الكلي: ${total.toLocaleString()} ${SHIQ_CONFIG.ECOMMERCE.CURRENCY}\\n\\n';
                        message += '📞 للتواصل: ${SHIQ_CONFIG.ECOMMERCE.PHONE_NUMBER}\\n';
                        message += '🌐 الموقع: ${SHIQ_CONFIG.APP_URL}';
                        
                        return message;
                    }
                </script>
            </body>
            </html>
        `);
    }
    
    enlargeImage(src) {
        if (!this.overlay || !src) return;
        
        const enlargedImage = document.getElementById('enlargedImage');
        if (enlargedImage) {
            enlargedImage.src = src;
            this.overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeEnlargedImage() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    searchProducts() {
        if (!this.searchBox || !this.productContainer) return;
        
        const query = this.searchBox.value.toLowerCase().trim();
        const products = this.productContainer.querySelectorAll('.product');
        
        products.forEach(product => {
            const text = product.textContent.toLowerCase();
            product.style.display = text.includes(query) ? 'block' : 'none';
        });
        
        console.log('البحث عن:', query);
    }
    
    showLoadingState() {
        if (this.productContainer) {
            this.productContainer.innerHTML = '<div class="loading">جار التحميل...</div>';
        }
    }
    
    showErrorState(message) {
        if (this.productContainer) {
            this.productContainer.innerHTML = `<div class="default-message">❌ خطأ: ${message}</div>`;
        }
    }
    
    showEmptyState() {
        if (this.productContainer) {
            this.productContainer.innerHTML = '<div class="default-message">لا توجد منتجات في هذا القسم حالياً 😔</div>';
        }
    }
    
    clearProducts() {
        if (this.productContainer) {
            this.productContainer.innerHTML = '<div class="default-message">اختر قسماً من الأقسام أعلاه لعرض المنتجات 👆</div>';
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: 'linear-gradient(135deg, #10B981, #059669)',
            error: 'linear-gradient(135deg, #EF4444, #DC2626)',
            warning: 'linear-gradient(135deg, #F59E0B, #D97706)',
            info: 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
        };
        
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: ${colors[type]};
            color: white; padding: 15px 20px; border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 10000;
            font-weight: 600; animation: slideInRight 0.3s ease;
            max-width: 350px; font-family: 'Segoe UI', sans-serif;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    getDefaultCategoryImage() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiPvCfm43vuI88L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiPtin2YjYrdipINmB2YPYqTwvdGV4dD48L3N2Zz4=';
    }
    
    getDefaultProductImage() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7YtdmI2LHYqSDYrdin2YTZiNeKPC90ZXh0Pjwvc3ZnPg==';
    }
}

// ===== 7. إدارة الأحداث المُبسط =====
class EventManager {
    constructor() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        try {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (window.ui) {
                        window.ui.closeEnlargedImage();
                    }
                }
            });
            
            const searchBox = document.getElementById('searchBox');
            if (searchBox) {
                searchBox.addEventListener('input', () => {
                    if (window.ui) {
                        window.ui.searchProducts();
                    }
                });
            }
            
            window.addEventListener('online', () => {
                if (window.ui) {
                    window.ui.showToast('🌐 تم استعادة الاتصال بالإنترنت', 'success');
                }
            });
            
            window.addEventListener('offline', () => {
                if (window.ui) {
                    window.ui.showToast('📡 انقطع الاتصال بالإنترنت', 'warning');
                }
            });
            
            const overlay = document.getElementById('overlay');
            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay && window.ui) {
                        window.ui.closeEnlargedImage();
                    }
                });
            }
            
            console.log('✅ تم إعداد مستمعي الأحداث');
        } catch (error) {
            console.error('خطأ في إعداد الأحداث:', error);
        }
    }
}

// ===== 8. تهيئة التطبيق المُصححة =====
let cart, imageManager, ui, eventManager, userManager;

document.addEventListener('DOMContentLoaded', async function() {
    console.log(`🚀 ${SHIQ_CONFIG.APP_NAME} v${SHIQ_CONFIG.APP_VERSION} - بدء التحميل...`);
    
    try {
        // إظهار حالة التحميل
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'app-loading';
        loadingDiv.innerHTML = `
            <div style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                display: flex; align-items: center; justify-content: center; 
                z-index: 9999; color: white; font-family: 'Segoe UI', sans-serif;
            ">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🛍️</div>
                    <div style="font-size: 1.5rem; font-weight: bold;">جار تحميل شي ان العراق...</div>
                    <div style="margin-top: 20px;">
                        <div style="
                            width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.3);
                            border-top: 3px solid white; border-radius: 50%;
                            animation: spin 1s linear infinite; margin: 0 auto;
                        "></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(loadingDiv);
        
        // إضافة CSS للتحميل
        const loadingStyle = document.createElement('style');
        loadingStyle.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(loadingStyle);
        
        // تهيئة المكونات بترتيب آمن
        console.log('📦 تهيئة سلة التسوق...');
        cart = new ShoppingCart();
        
        console.log('🖼️ تهيئة إدارة الصور...');
        imageManager = new ImageManager();
        
        console.log('🎨 تهيئة واجهة المستخدم...');
        ui = new UIManager(cart, imageManager);
        
        console.log('⚡ تهيئة إدارة الأحداث...');
        eventManager = new EventManager();
        
        console.log('👤 تهيئة إدارة المستخدمين...');
        userManager = new UserManager();
        
        // انتظار التهيئة الكاملة
        await userManager.initialize();
        
        // عرض الواجهة
        console.log('🎯 إنشاء شريط التنقل...');
        ui.createCategoryNavigation();
        
        console.log('📋 عرض الفئات...');
        await ui.renderCategories();
        
        // إخفاء صندوق البحث في البداية
        if (ui.searchBox) {
            ui.searchBox.style.display = 'none';
        }
        
        // إضافة للنافذة العامة
        window.ui = ui;
        window.cart = cart;
        window.userManager = userManager;
        
        // دوال للتوافق العكسي
        window.openCart = () => ui.openCart();
        window.enlargeImage = (src) => ui.enlargeImage(src);
        window.closeEnlargedImage = () => ui.closeEnlargedImage();
        window.addToCart = (code, name, price, imageUrl, size = '', category = '') => ui.addToCart(code, name, price, imageUrl, size, category);
        window.searchProduct = () => ui.searchProducts();
        window.showUserProfile = () => showUserProfile();
        window.closeUserProfile = () => closeUserProfile();
        
        // إخفاء شاشة التحميل
        setTimeout(() => {
            const loadingDiv = document.getElementById('app-loading');
            if (loadingDiv) {
                loadingDiv.style.animation = 'fadeOut 0.5s ease';
                setTimeout(() => loadingDiv.remove(), 500);
            }
        }, 2000);
        
        console.log(`✅ ${SHIQ_CONFIG.APP_NAME} v${SHIQ_CONFIG.APP_VERSION} - جاهز للاستخدام!`);
        console.log('📱 النظام يعمل بحفظ محلي فقط - لا توجد أخطاء شبكة');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error);
        
        // إخفاء شاشة التحميل في حالة الخطأ
        const loadingDiv = document.getElementById('app-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
        
        // عرض رسالة خطأ
        document.body.innerHTML = `
            <div style="
                display: flex; align-items: center; justify-content: center; 
                min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; text-align: center; font-family: 'Segoe UI', sans-serif;
            ">
                <div>
                    <div style="font-size: 4rem; margin-bottom: 20px;">😔</div>
                    <h2>عذراً، حدث خطأ في تحميل التطبيق</h2>
                    <p style="margin: 20px 0; font-size: 1.1rem;">${error.message}</p>
                    <button onclick="location.reload()" style="
                        padding: 15px 30px; background: #8B5CF6; color: white; 
                        border: none; border-radius: 25px; font-size: 1.1rem; 
                        cursor: pointer; font-weight: bold;
                    ">🔄 إعادة المحاولة</button>
                </div>
            </div>
        `;
    }
});

// ===== 9. دوال مساعدة =====
function showUserProfile() {
    if (!userManager?.currentUser) {
        userManager?.showRegistrationForm();
        return;
    }
    
    try {
        const modal = createUserProfileModal();
        document.body.appendChild(modal);
        modal.classList.add('show');
    } catch (error) {
        console.error('خطأ في عرض الملف الشخصي:', error);
    }
}

function createUserProfileModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'unified-user-profile';
    
    const user = userManager.currentUser;
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>👤 الملف الشخصي</h2>
                <button onclick="closeUserProfile()" style="position: absolute; top: 15px; left: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            
            <div class="profile-sections">
                <div class="profile-section">
                    <h3>📋 المعلومات الأساسية</h3>
                    <p><strong>الاسم:</strong> ${user.name}</p>
                    <p><strong>الهاتف:</strong> ${user.phone}</p>
                    <p><strong>المحافظة:</strong> ${user.governorate}</p>
                    <p><strong>العنوان:</strong> ${user.address}</p>
                    <p><strong>الجنس:</strong> ${user.gender || 'غير محدد'}</p>
                </div>
                
                <div class="profile-section">
                    <h3>🎯 الاهتمامات</h3>
                    <div class="interests-display">
                        ${user.interests && user.interests.length > 0 
                            ? user.interests.map(interest => `<span class="interest-badge">${interest}</span>`).join('')
                            : '<p>لا توجد اهتمامات محددة</p>'
                        }
                    </div>
                </div>
                
                <div class="profile-section">
                    <h3>📊 إحصائيات الحساب</h3>
                    <p><strong>تاريخ التسجيل:</strong> ${new Date(user.registrationDate).toLocaleDateString('ar-IQ')}</p>
                    <p><strong>آخر نشاط:</strong> ${new Date(user.lastActive).toLocaleDateString('ar-IQ')}</p>
                    <p><strong>معرف العميل:</strong> ${user.id}</p>
                </div>
            </div>
            
            <div class="profile-actions">
                <button class="btn btn-primary" onclick="editUserProfile()">📝 تعديل البيانات</button>
                <button class="btn btn-secondary" onclick="closeUserProfile()">إغلاق</button>
            </div>
        </div>
    `;
    
    return modal;
}

function closeUserProfile() {
    const modal = document.getElementById('unified-user-profile');
    if (modal) {
        modal.remove();
    }
}

function editUserProfile() {
    closeUserProfile();
    if (userManager) {
        userManager.showRegistrationForm();
        
        // ملء النموذج بالبيانات الحالية
        setTimeout(() => {
            const user = userManager.currentUser;
            if (user) {
                const fields = {
                    'userName': user.name,
                    'userPhone': user.phone,
                    'userGovernorate': user.governorate,
                    'userAddress': user.address,
                    'userGender': user.gender || ''
                };
                
                Object.entries(fields).forEach(([id, value]) => {
                    const field = document.getElementById(id);
                    if (field) field.value = value;
                });
                
                // الاهتمامات
                if (user.interests && Array.isArray(user.interests)) {
                    user.interests.forEach(interest => {
                        const checkbox = document.querySelector(`input[type="checkbox"][value="${interest}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }
            }
        }, 100);
    }
}

// ===== 10. CSS الإضافي =====
if (!document.querySelector('#unified-animations')) {
    const style = document.createElement('style');
    style.id = 'unified-animations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .profile-sections {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .profile-section {
            padding: 15px;
            background: #f9fafb;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
        }
        
        .profile-section h3 {
            color: #8B5CF6;
            margin-bottom: 10px;
        }
        
        .interests-display {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .interest-badge {
            background: #8B5CF6;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.9rem;
        }
        
        .profile-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn-secondary {
            background: #6b7280;
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            background: #4b5563;
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .profile-actions {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(style);
}

console.log('📦 تم تحميل النظام المُصحح - Fixed System Ready!');

// ========================================================================
// إصلاح الملف الشخصي الكامل والنهائي - Complete User Profile Fix
// ========================================================================
// يمكن لصق هذا الكود في الكونسل أو إضافته لنهاية ملف app.js
// ========================================================================

(function() {
    'use strict';
    
    console.log('🔧 بدء تطبيق إصلاح الملف الشخصي الكامل...');
    
    // ===== 1. إزالة الدوال المتضاربة =====
    try {
        // حذف جميع الدوال القديمة المعطوبة
        if (window.showUserProfile) {
            delete window.showUserProfile;
            console.log('🗑️ تم حذف showUserProfile القديمة');
        }
        if (window.openUserProfile) {
            delete window.openUserProfile;
            console.log('🗑️ تم حذف openUserProfile القديمة');
        }
        if (window.closeUserProfile) {
            delete window.closeUserProfile;
            console.log('🗑️ تم حذف closeUserProfile القديمة');
        }
        if (window.editUserProfile) {
            delete window.editUserProfile;
            console.log('🗑️ تم حذف editUserProfile القديمة');
        }
    } catch (error) {
        console.warn('⚠️ خطأ في حذف الدوال القديمة:', error);
    }
    
    // ===== 2. إضافة الأنماط CSS =====
    function addProfileStyles() {
        // التحقق من وجود الأنماط
        if (document.querySelector('#complete-profile-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'complete-profile-styles';
        style.textContent = `
            /* أنماط نافذة الملف الشخصي الكاملة */
            .user-profile-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                backdrop-filter: blur(8px);
                animation: fadeIn 0.3s ease;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .user-profile-content {
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                border-radius: 20px;
                padding: 35px;
                max-width: 550px;
                width: 92%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
                animation: slideUp 0.4s ease;
                border: 1px solid rgba(139, 92, 246, 0.1);
            }
            
            .profile-close-btn {
                position: absolute;
                top: 20px;
                left: 20px;
                background: rgba(107, 114, 128, 0.1);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 1.8rem;
                cursor: pointer;
                color: #6b7280;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                font-weight: bold;
            }
            
            .profile-close-btn:hover {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                transform: scale(1.1);
            }
            
            .profile-header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid rgba(139, 92, 246, 0.1);
            }
            
            .profile-header h2 {
                background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: 2.2rem;
                margin: 0;
                font-weight: 900;
                letter-spacing: 1px;
            }
            
            .profile-header p {
                color: #6b7280;
                font-size: 1.1rem;
                margin: 10px 0 0 0;
                font-weight: 500;
            }
            
            .profile-sections {
                display: flex;
                flex-direction: column;
                gap: 25px;
                margin-bottom: 30px;
            }
            
            .profile-section {
                background: rgba(139, 92, 246, 0.03);
                padding: 25px;
                border-radius: 15px;
                border: 2px solid rgba(139, 92, 246, 0.08);
                transition: all 0.3s ease;
            }
            
            .profile-section:hover {
                border-color: rgba(139, 92, 246, 0.15);
                background: rgba(139, 92, 246, 0.05);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.1);
            }
            
            .profile-section h3 {
                background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin: 0 0 15px 0;
                font-size: 1.4rem;
                font-weight: 800;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .profile-section p {
                margin: 12px 0;
                line-height: 1.7;
                color: #374151;
                font-size: 1.05rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid rgba(139, 92, 246, 0.05);
            }
            
            .profile-section p:last-child {
                border-bottom: none;
            }
            
            .profile-section strong {
                color: #1f2937;
                font-weight: 700;
                min-width: 100px;
            }
            
            .interests-display {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }
            
            .interest-badge {
                background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.95rem;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
                transition: all 0.3s ease;
            }
            
            .interest-badge:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
            }
            
            .no-interests {
                color: #6b7280;
                font-style: italic;
                text-align: center;
                padding: 20px;
                background: rgba(107, 114, 128, 0.05);
                border-radius: 10px;
                border: 2px dashed rgba(107, 114, 128, 0.2);
            }
            
            .profile-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-top: 25px;
            }
            
            .profile-btn {
                padding: 18px 25px;
                border: none;
                border-radius: 15px;
                font-size: 1.1rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            
            .btn-edit {
                background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
                color: white;
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
            }
            
            .btn-edit:hover {
                background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%);
                transform: translateY(-3px);
                box-shadow: 0 12px 35px rgba(139, 92, 246, 0.4);
            }
            
            .btn-close {
                background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
                color: white;
                box-shadow: 0 8px 25px rgba(107, 114, 128, 0.2);
            }
            
            .btn-close:hover {
                background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
                transform: translateY(-3px);
                box-shadow: 0 12px 35px rgba(107, 114, 128, 0.3);
            }
            
            /* الرسوم المتحركة */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { 
                    transform: translateY(50px); 
                    opacity: 0; 
                    scale: 0.95;
                }
                to { 
                    transform: translateY(0); 
                    opacity: 1; 
                    scale: 1;
                }
            }
            
            /* التجاوب مع الشاشات الصغيرة */
            @media (max-width: 768px) {
                .user-profile-content {
                    width: 95%;
                    padding: 25px;
                    margin: 10px;
                }
                
                .profile-actions {
                    grid-template-columns: 1fr;
                    gap: 12px;
                }
                
                .profile-btn {
                    padding: 16px 20px;
                    font-size: 1rem;
                }
                
                .profile-header h2 {
                    font-size: 1.8rem;
                }
                
                .interests-display {
                    gap: 8px;
                }
                
                .interest-badge {
                    padding: 6px 12px;
                    font-size: 0.9rem;
                }
            }
            
            @media (max-width: 480px) {
                .user-profile-content {
                    width: 98%;
                    padding: 20px;
                }
                
                .profile-section {
                    padding: 20px;
                }
                
                .profile-section p {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 تم إضافة أنماط CSS');
    }
    
    // ===== 3. دالة إنشاء نافذة الملف الشخصي =====
    function createProfileModal(user) {
        // إزالة أي نافذة موجودة
        const existingModal = document.getElementById('user-profile-modal-complete');
        if (existingModal) {
            existingModal.remove();
        }
        
        // إضافة الأنماط
        addProfileStyles();
        
        const modal = document.createElement('div');
        modal.id = 'user-profile-modal-complete';
        modal.className = 'user-profile-modal';
        
        // تحديد تاريخ التسجيل وآخر نشاط
        const registrationDate = user.registrationDate ? 
            new Date(user.registrationDate).toLocaleDateString('ar-IQ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'غير متوفر';
            
        const lastActive = user.lastActive ? 
            new Date(user.lastActive).toLocaleDateString('ar-IQ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'الآن';
        
        modal.innerHTML = `
            <div class="user-profile-content">
                <button class="profile-close-btn" onclick="closeUserProfileComplete()" title="إغلاق">
                    ×
                </button>
                
                <div class="profile-header">
                    <h2>👤 الملف الشخصي</h2>
                    <p>معلومات حسابك في شي ان العراق</p>
                </div>
                
                <div class="profile-sections">
                    <div class="profile-section">
                        <h3>📋 المعلومات الأساسية</h3>
                        <p>
                            <strong>الاسم:</strong>
                            <span>${user.name || 'غير محدد'}</span>
                        </p>
                        <p>
                            <strong>الهاتف:</strong>
                            <span>${user.phone || 'غير محدد'}</span>
                        </p>
                        <p>
                            <strong>المحافظة:</strong>
                            <span>${user.governorate || 'غير محدد'}</span>
                        </p>
                        <p>
                            <strong>العنوان:</strong>
                            <span>${user.address || 'غير محدد'}</span>
                        </p>
                        <p>
                            <strong>الجنس:</strong>
                            <span>${user.gender === 'female' ? 'أنثى' : user.gender === 'male' ? 'ذكر' : 'غير محدد'}</span>
                        </p>
                    </div>
                    
                    <div class="profile-section">
                        <h3>🎯 الاهتمامات والتفضيلات</h3>
                        <div class="interests-display">
                            ${user.interests && user.interests.length > 0 
                                ? user.interests.map(interest => 
                                    `<span class="interest-badge">${interest}</span>`
                                  ).join('')
                                : '<div class="no-interests">😔 لا توجد اهتمامات محددة<br><small>يمكنك إضافة اهتماماتك عند التعديل</small></div>'
                            }
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h3>📊 إحصائيات الحساب</h3>
                        <p>
                            <strong>تاريخ التسجيل:</strong>
                            <span>${registrationDate}</span>
                        </p>
                        <p>
                            <strong>آخر نشاط:</strong>
                            <span>${lastActive}</span>
                        </p>
                        <p>
                            <strong>معرف العميل:</strong>
                            <span style="font-family: monospace; font-size: 0.9em; color: #8B5CF6;">${user.id || 'غير متوفر'}</span>
                        </p>
                        <p>
                            <strong>حالة الإشعارات:</strong>
                            <span>${user.notificationsEnabled ? '🔔 مفعلة' : '🔕 غير مفعلة'}</span>
                        </p>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button class="profile-btn btn-edit" onclick="editUserProfileComplete()">
                        📝 تعديل البيانات
                    </button>
                    <button class="profile-btn btn-close" onclick="closeUserProfileComplete()">
                        ❌ إغلاق
                    </button>
                </div>
            </div>
        `;
        
        // إضافة النافذة للصفحة
        document.body.appendChild(modal);
        
        // منع التمرير في الخلفية
        document.body.style.overflow = 'hidden';
        
        // إضافة حدث الإغلاق عند النقر خارج النافذة
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeUserProfileComplete();
            }
        });
        
        // إضافة حدث الإغلاق بزر Escape
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                closeUserProfileComplete();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        console.log('✅ تم إنشاء نافذة الملف الشخصي بنجاح');
        return modal;
    }
    
    // ===== 4. دالة عرض الملف الشخصي الرئيسية =====
    window.showUserProfile = function() {
        console.log('👤 showUserProfile - النسخة الكاملة والنهائية');
        
        try {
            // التحقق من وجود نظام إدارة المستخدمين
            if (!window.userManager) {
                console.error('❌ نظام إدارة المستخدمين غير متوفر');
                alert('خطأ: نظام إدارة المستخدمين غير متاح. يرجى إعادة تحميل الصفحة.');
                return;
            }
            
            // التحقق من وجود مستخدم مسجل
            if (!window.userManager.currentUser) {
                console.log('📝 لا يوجد مستخدم مسجل - عرض نموذج التسجيل');
                
                // عرض رسالة ترحيبية
                if (window.ui && window.ui.showToast) {
                    window.ui.showToast('📝 يرجى تسجيل بياناتك أولاً للوصول للملف الشخصي', 'info');
                }
                
                // إظهار نموذج التسجيل
                window.userManager.showRegistrationForm();
                return;
            }
            
            // عرض نافذة الملف الشخصي
            console.log('✅ عرض الملف الشخصي للمستخدم:', window.userManager.currentUser.name);
            createProfileModal(window.userManager.currentUser);
            
        } catch (error) {
            console.error('❌ خطأ في عرض الملف الشخصي:', error);
            alert('حدث خطأ في عرض الملف الشخصي. يرجى المحاولة مرة أخرى.');
        }
    };
    
    // ===== 5. دالة إغلاق الملف الشخصي =====
    window.closeUserProfileComplete = function() {
        try {
            const modal = document.getElementById('user-profile-modal-complete');
            if (modal) {
                // إضافة تأثير الإغلاق
                modal.style.animation = 'fadeOut 0.3s ease';
                
                setTimeout(() => {
                    modal.remove();
                    // استعادة التمرير
                    document.body.style.overflow = 'auto';
                    console.log('🗑️ تم إغلاق نافذة الملف الشخصي');
                }, 300);
            }
        } catch (error) {
            console.error('❌ خطأ في إغلاق الملف الشخصي:', error);
        }
    };
    
    // ===== 6. دالة تعديل الملف الشخصي =====
    window.editUserProfileComplete = function() {
        try {
            console.log('📝 فتح نموذج تعديل الملف الشخصي');
            
            // إغلاق نافذة الملف الشخصي
            closeUserProfileComplete();
            
            // التحقق من وجود نظام إدارة المستخدمين
            if (!window.userManager) {
                console.error('❌ نظام إدارة المستخدمين غير متوفر');
                alert('خطأ: نظام إدارة المستخدمين غير متاح');
                return;
            }
            
            // إظهار نموذج التسجيل للتعديل
            window.userManager.showRegistrationForm();
            
            // ملء النموذج بالبيانات الحالية
            setTimeout(() => {
                fillFormWithUserData();
            }, 200);
            
        } catch (error) {
            console.error('❌ خطأ في فتح نموذج التعديل:', error);
            alert('حدث خطأ في فتح نموذج التعديل');
        }
    };
    
    // ===== 7. دالة ملء النموذج بالبيانات الحالية =====
    function fillFormWithUserData() {
        try {
            const user = window.userManager.currentUser;
            if (!user) {
                console.warn('⚠️ لا توجد بيانات مستخدم لملء النموذج');
                return;
            }
            
            console.log('📋 ملء النموذج ببيانات المستخدم:', user.name);
            
            // ملء الحقول النصية
            const formFields = {
                'userName': user.name || '',
                'userPhone': user.phone || '',
                'userGovernorate': user.governorate || '',
                'userAddress': user.address || '',
                'userGender': user.gender || ''
            };
            
            // ملء كل حقل
            Object.entries(formFields).forEach(([fieldId, value]) => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = value;
                    console.log(`✅ تم ملء ${fieldId}: ${value}`);
                } else {
                    console.warn(`⚠️ لم يتم العثور على الحقل: ${fieldId}`);
                }
            });
            
            // ملء الاهتمامات
            if (user.interests && Array.isArray(user.interests)) {
                user.interests.forEach(interest => {
                    const checkbox = document.querySelector(`input[type="checkbox"][value="${interest}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                        console.log(`✅ تم تحديد الاهتمام: ${interest}`);
                    }
                });
            }
            
            // عرض رسالة نجاح
            if (window.ui && window.ui.showToast) {
                window.ui.showToast('✅ تم تحميل بياناتك الحالية في النموذج', 'success');
            }
            
            console.log('✅ تم ملء النموذج بنجاح');
            
        } catch (error) {
            console.error('❌ خطأ في ملء النموذج:', error);
        }
    }
    
    // ===== 8. ربط الدوال بالواجهة =====
    
    // ربط دالة openUserProfile (للتوافق مع HTML)
    window.openUserProfile = window.showUserProfile;
    
    // ربط دالة closeUserProfile (للتوافق)
    window.closeUserProfile = window.closeUserProfileComplete;
    
    // ربط دالة editUserProfile (للتوافق)
    window.editUserProfile = window.editUserProfileComplete;
    
    // ===== 9. إعداد أحداث أيقونة المستخدم =====
    function setupProfileButtonEvents() {
        try {
            const profileButton = document.getElementById('userProfileBtn');
            if (profileButton) {
                // إزالة الأحداث القديمة
                profileButton.replaceWith(profileButton.cloneNode(true));
                
                // الحصول على الزر الجديد وربط الحدث
                const newProfileButton = document.getElementById('userProfileBtn');
                if (newProfileButton) {
                    newProfileButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('👤 تم النقر على أيقونة الملف الشخصي');
                        window.showUserProfile();
                    });
                    
                    // إضافة title للزر
                    newProfileButton.title = 'الملف الشخصي';
                    
                    console.log('✅ تم ربط أحداث أيقونة الملف الشخصي');
                } else {
                    console.warn('⚠️ لم يتم العثور على أيقونة الملف الشخصي بعد الاستبدال');
                }
            } else {
                console.warn('⚠️ لم يتم العثور على أيقونة الملف الشخصي');
            }
        } catch (error) {
            console.error('❌ خطأ في إعداد أحداث أيقونة الملف الشخصي:', error);
        }
    }
    
    // ===== 10. التهيئة النهائية =====
    
    // إعداد الأحداث عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(setupProfileButtonEvents, 1000);
        });
    } else {
        setTimeout(setupProfileButtonEvents, 1000);
    }
    
    // إضافة CSS للرسوم المتحركة الإضافية
    const additionalStyle = document.createElement('style');
    additionalStyle.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(additionalStyle);
    
    // ===== 11. رسائل النجاح النهائية =====
    console.log('✅ تم تطبيق إصلاح الملف الشخصي الكامل بنجاح!');
    console.log('🎯 الميزات المتاحة:');
    console.log('   - عرض الملف الشخصي الكامل');
    console.log('   - تعديل البيانات');
    console.log('   - تصميم متجاوب وجميل');
    console.log('   - إغلاق بطرق متعددة');
    console.log('   - معالجة شاملة للأخطاء');
    console.log('🚀 يمكنك الآن النقر على أيقونة المستخدم (👤) لاختبار النظام!');
    
    // عرض رسالة نجاح للمستخدم
    if (window.ui && window.ui.showToast) {
        window.ui.showToast('🎉 تم إصلاح الملف الشخصي بنجاح! جرب النقر على أيقونة المستخدم', 'success');
    }
    
})();

// ========================================================================
// انتهى الكود - يمكنك الآن النقر على أيقونة المستخدم (👤) لاختبار النظام
// ========================================================================


// ========================================================================
// إضافة نظام الإشعارات لـ SHIQ - بدون تغيير الكود الحالي
// يتم إضافة هذا الكود في نهاية ملف app.js الحالي
// ========================================================================

// ===== إضافة إعدادات Firebase للإشعارات =====
// (يضاف في SHIQ_CONFIG الموجود)
SHIQ_CONFIG.FIREBASE = {
    apiKey: "AIzaSyDnXthgmxNk4fzPbAdaix5R7yOClD33_S8",
    authDomain: "shiq-notifications.firebaseapp.com",
    projectId: "shiq-notifications",
    storageBucket: "shiq-notifications.firebasestorage.app",
    messagingSenderId: "826765783989",
    appId: "1:826765783989:web:097095ac64878cfd195ffc"
};

SHIQ_CONFIG.NOTIFICATIONS = {
    ENABLED: true, // تم تفعيل الإشعارات
    VAPID_KEY: 'BDQedkxbNvXT48XS9ivcQdfDkQ-qGJPAXai0ayiQ3qc8DNP2NffNrn9h0HbkpDJPe1Dmu15Y_hJotdGy1gjdMQ8',
    DEFAULT_ICON: './icons/icon-192x192.png',
    PERMISSION_TIMEOUT: 5000,
    FCM_TOKEN_KEY: 'shiq_fcm_token_v1',
    NOTIFICATION_SETTINGS_KEY: 'shiq_notification_settings_v1'
};

// ===== كلاس إدارة الإشعارات الجديد =====
class NotificationManager {
    constructor() {
        this.isSupported = false;
        this.permission = 'default';
        this.fcmToken = null;
        this.messaging = null;
        this.isInitialized = false;
        
        console.log('🔔 بدء تهيئة نظام الإشعارات...');
    }
    
    async initialize() {
        if (this.isInitialized) {
            console.log('⚠️ نظام الإشعارات مُهيأ مسبقاً');
            return;
        }
        
        try {
            // التحقق من الدعم
            this.checkSupport();
            
            if (!this.isSupported) {
                console.warn('❌ المتصفح لا يدعم الإشعارات');
                return;
            }
            
            // تحميل Firebase SDK إذا لم يكن محملاً
            await this.loadFirebaseSDK();
            
            // تهيئة Firebase
            await this.initializeFirebase();
            
            // تحميل الإعدادات المحفوظة
            this.loadSettings();
            
            // تسجيل Service Worker
            await this.registerServiceWorker();
            
            // تهيئة معالج الرسائل
            this.setupMessageHandler();
            
            this.isInitialized = true;
            console.log('✅ نظام الإشعارات جاهز للعمل');
            
        } catch (error) {
            console.error('❌ خطأ في تهيئة نظام الإشعارات:', error);
        }
    }
    
    checkSupport() {
        this.isSupported = (
            'serviceWorker' in navigator &&
            'Notification' in window &&
            'PushManager' in window
        );
        
        console.log('🔍 فحص دعم الإشعارات:', this.isSupported ? 'مدعوم ✅' : 'غير مدعوم ❌');
    }
    
    async loadFirebaseSDK() {
        // التحقق من وجود Firebase
        if (typeof firebase !== 'undefined') {
            console.log('✅ Firebase SDK محمل مسبقاً');
            return;
        }
        
        return new Promise((resolve, reject) => {
            // تحميل Firebase App
            const scriptApp = document.createElement('script');
            scriptApp.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
            scriptApp.onload = () => {
                // تحميل Firebase Messaging
                const scriptMessaging = document.createElement('script');
                scriptMessaging.src = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js';
                scriptMessaging.onload = () => {
                    console.log('✅ تم تحميل Firebase SDK');
                    resolve();
                };
                scriptMessaging.onerror = reject;
                document.head.appendChild(scriptMessaging);
            };
            scriptApp.onerror = reject;
            document.head.appendChild(scriptApp);
        });
    }
    
    async initializeFirebase() {
        try {
            // تهيئة Firebase إذا لم يكن مُهيأ
            if (!firebase.apps.length) {
                firebase.initializeApp(SHIQ_CONFIG.FIREBASE);
                console.log('🔥 تم تهيئة Firebase');
            }
            
            // الحصول على خدمة الرسائل
            this.messaging = firebase.messaging();
            
            // تعيين VAPID key
            this.messaging.usePublicVapidKey(SHIQ_CONFIG.NOTIFICATIONS.VAPID_KEY);
            
            console.log('📬 خدمة الرسائل جاهزة');
            
        } catch (error) {
            console.error('❌ خطأ في تهيئة Firebase:', error);
            throw error;
        }
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem(SHIQ_CONFIG.NOTIFICATIONS.NOTIFICATION_SETTINGS_KEY);
            if (saved) {
                const settings = JSON.parse(saved);
                console.log('📋 تم تحميل إعدادات الإشعارات المحفوظة');
                return settings;
            }
        } catch (error) {
            console.warn('⚠️ خطأ في تحميل إعدادات الإشعارات:', error);
        }
        
        // الإعدادات الافتراضية
        return {
            enabled: true,
            newProducts: true,
            offers: true,
            governorateSpecific: true,
            interestBased: true
        };
    }
    
    saveSettings(settings) {
        try {
            localStorage.setItem(SHIQ_CONFIG.NOTIFICATIONS.NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
            console.log('💾 تم حفظ إعدادات الإشعارات');
        } catch (error) {
            console.warn('⚠️ خطأ في حفظ إعدادات الإشعارات:', error);
        }
    }
    
    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('./firebase-messaging-sw.js');
            console.log('👷 تم تسجيل Service Worker للإشعارات:', registration.scope);
            return registration;
        } catch (error) {
            console.error('❌ خطأ في تسجيل Service Worker:', error);
            throw error;
        }
    }
    
    setupMessageHandler() {
        if (!this.messaging) return;
        
        try {
            // معالج الرسائل في المقدمة
            this.messaging.onMessage((payload) => {
                console.log('📬 تم استلام إشعار في المقدمة:', payload);
                this.handleForegroundMessage(payload);
            });
            
            console.log('🔧 تم إعداد معالج الرسائل');
        } catch (error) {
            console.error('❌ خطأ في إعداد معالج الرسائل:', error);
        }
    }
    
    handleForegroundMessage(payload) {
        try {
            // عرض إشعار مخصص في المقدمة
            const title = payload.notification?.title || 'شي ان العراق';
            const options = {
                body: payload.notification?.body || 'لديك إشعار جديد',
                icon: payload.notification?.icon || SHIQ_CONFIG.NOTIFICATIONS.DEFAULT_ICON,
                image: payload.notification?.image,
                badge: './icons/icon-72x72.png',
                tag: 'shiq-foreground-notification',
                requireInteraction: false,
                data: payload.data
            };
            
            // عرض الإشعار
            if (Notification.permission === 'granted') {
                const notification = new Notification(title, options);
                
                notification.onclick = () => {
                    window.focus();
                    notification.close();
                    
                    // معالجة النقر
                    if (payload.data?.url) {
                        window.location.href = payload.data.url;
                    }
                };
                
                // إغلاق تلقائي بعد 5 ثوانِ
                setTimeout(() => notification.close(), 5000);
            }
            
        } catch (error) {
            console.error('❌ خطأ في معالجة إشعار المقدمة:', error);
        }
    }
    
    async requestPermission() {
        try {
            console.log('🔐 طلب إذن الإشعارات...');
            
            this.permission = await Notification.requestPermission();
            
            if (this.permission === 'granted') {
                console.log('✅ تم منح إذن الإشعارات');
                await this.getToken();
                return true;
            } else {
                console.warn('❌ تم رفض إذن الإشعارات');
                return false;
            }
            
        } catch (error) {
            console.error('❌ خطأ في طلب إذن الإشعارات:', error);
            return false;
        }
    }
    
    async getToken() {
        if (!this.messaging) {
            console.warn('⚠️ خدمة الرسائل غير متاحة');
            return null;
        }
        
        try {
            // محاولة الحصول على token محفوظ
            const savedToken = localStorage.getItem(SHIQ_CONFIG.NOTIFICATIONS.FCM_TOKEN_KEY);
            if (savedToken) {
                this.fcmToken = savedToken;
                console.log('📋 تم استرجاع FCM token محفوظ');
                return savedToken;
            }
            
            // الحصول على token جديد
            const token = await this.messaging.getToken({
                vapidKey: SHIQ_CONFIG.NOTIFICATIONS.VAPID_KEY
            });
            
            if (token) {
                this.fcmToken = token;
                localStorage.setItem(SHIQ_CONFIG.NOTIFICATIONS.FCM_TOKEN_KEY, token);
                console.log('🔑 تم الحصول على FCM token جديد');
                
                // إرسال Token إلى الخادم
                await this.sendTokenToServer(token);
                
                return token;
            } else {
                console.warn('⚠️ لم يتم الحصول على FCM token');
                return null;
            }
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على FCM token:', error);
            return null;
        }
    }
    
    async sendTokenToServer(token) {
        try {
            if (!window.userManager?.currentUser) {
                console.log('📤 حفظ Token محلياً (لا يوجد مستخدم مسجل)');
                return;
            }
            
            const user = window.userManager.currentUser;
            
            const tokenData = {
                action: 'save_fcm_token',
                tokenData: {
                    userId: user.id,
                    fcmToken: token,
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    governorate: user.governorate,
                    interests: user.interests || [],
                    timestamp: new Date().toISOString(),
                    appVersion: SHIQ_CONFIG.APP_VERSION
                }
            };
            
            // إرسال إلى Google Apps Script
            if (SHIQ_CONFIG.WEB_APP_URL) {
                const response = await fetch(SHIQ_CONFIG.WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tokenData)
                });
                
                console.log('📤 تم إرسال FCM token إلى الخادم');
            } else {
                console.log('📤 حفظ FCM token محلياً (Google Apps Script غير مُعد)');
            }
            
        } catch (error) {
            console.warn('⚠️ خطأ في إرسال Token للخادم:', error);
        }
    }
    
    async enableNotifications() {
        try {
            if (!this.isSupported) {
                throw new Error('الإشعارات غير مدعومة في هذا المتصفح');
            }
            
            if (!this.isInitialized) {
                await this.initialize();
            }
            
            const permitted = await this.requestPermission();
            if (permitted) {
                const settings = this.loadSettings();
                settings.enabled = true;
                this.saveSettings(settings);
                
                console.log('🔔 تم تفعيل الإشعارات بنجاح');
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('❌ خطأ في تفعيل الإشعارات:', error);
            return false;
        }
    }
    
    disableNotifications() {
        try {
            const settings = this.loadSettings();
            settings.enabled = false;
            this.saveSettings(settings);
            
            // حذف Token المحفوظ
            localStorage.removeItem(SHIQ_CONFIG.NOTIFICATIONS.FCM_TOKEN_KEY);
            this.fcmToken = null;
            
            console.log('🔕 تم تعطيل الإشعارات');
            return true;
            
        } catch (error) {
            console.error('❌ خطأ في تعطيل الإشعارات:', error);
            return false;
        }
    }
    
    getStatus() {
        return {
            supported: this.isSupported,
            permission: this.permission,
            enabled: this.loadSettings().enabled,
            hasToken: !!this.fcmToken,
            initialized: this.isInitialized
        };
    }
    
    // دالة لاختبار الإشعار
    async testNotification() {
        if (Notification.permission === 'granted') {
            const notification = new Notification('اختبار إشعار شي ان العراق', {
                body: 'هذا اختبار للتأكد من عمل الإشعارات',
                icon: SHIQ_CONFIG.NOTIFICATIONS.DEFAULT_ICON,
                badge: './icons/icon-72x72.png',
                tag: 'shiq-test-notification'
            });
            
            setTimeout(() => notification.close(), 3000);
            console.log('🧪 تم إرسال إشعار تجريبي');
        }
    }
}

// ===== تحديث UserManager لدعم الإشعارات =====
// (يضاف في كلاس UserManager الموجود - لا يستبدل)

// إضافة دالة في UserManager
UserManager.prototype.setupNotifications = async function() {
    try {
        if (!window.notificationManager) {
            console.log('🔔 تهيئة نظام الإشعارات للمستخدم...');
            window.notificationManager = new NotificationManager();
            await window.notificationManager.initialize();
        }
        
        // عرض طلب تفعيل الإشعارات للمستخدمين الجدد
        if (this.currentUser && window.notificationManager.getStatus().supported) {
            setTimeout(() => {
                this.showNotificationPrompt();
            }, 3000); // بعد 3 ثوانِ من التسجيل
        }
        
    } catch (error) {
        console.error('❌ خطأ في إعداد الإشعارات للمستخدم:', error);
    }
};

UserManager.prototype.showNotificationPrompt = function() {
    const status = window.notificationManager.getStatus();
    
    if (status.permission === 'default' && status.supported) {
        const modal = this.createNotificationPromptModal();
        document.body.appendChild(modal);
        modal.classList.add('show');
    }
};

UserManager.prototype.createNotificationPromptModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'notification-prompt-modal';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header" style="text-align: center;">
                <h2>🔔 تفعيل الإشعارات</h2>
                <p style="color: #6b7280; margin: 10px 0;">احصل على آخر العروض والمنتجات الجديدة</p>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
                <div style="font-size: 4rem; margin-bottom: 15px;">📲</div>
                <p style="line-height: 1.6; color: #374151;">
                    <strong>لماذا تفعل الإشعارات؟</strong><br>
                    • إشعارات بالعروض الخاصة 🔥<br>
                    • المنتجات الجديدة أولاً 👗<br>
                    • عروض حصرية لمحافظتك 📍<br>
                    • لن نزعجك كثيراً - وعد! 😊
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button class="btn btn-primary" onclick="enableNotificationsFromPrompt()" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%);">
                    ✅ تفعيل الإشعارات
                </button>
                <button class="btn btn-secondary" onclick="closeNotificationPrompt()" style="background: #6b7280;">
                    ❌ ليس الآن
                </button>
            </div>
            
            <p style="font-size: 0.8rem; color: #9ca3af; text-align: center; margin-top: 15px;">
                يمكنك تغيير هذا الإعداد لاحقاً من الملف الشخصي
            </p>
        </div>
    `;
    
    return modal;
};

// ===== الدوال المساعدة الجديدة =====
window.enableNotificationsFromPrompt = async function() {
    try {
        const success = await window.notificationManager.enableNotifications();
        if (success && window.ui) {
            window.ui.showToast('🔔 تم تفعيل الإشعارات بنجاح!', 'success');
        }
    } catch (error) {
        if (window.ui) {
            window.ui.showToast('❌ خطأ في تفعيل الإشعارات', 'error');
        }
    }
    closeNotificationPrompt();
};

window.closeNotificationPrompt = function() {
    const modal = document.getElementById('notification-prompt-modal');
    if (modal) {
        modal.remove();
    }
};

window.testNotification = function() {
    if (window.notificationManager) {
        window.notificationManager.testNotification();
    }
};

// ===== تحديث تهيئة التطبيق =====
// (يضاف في نهاية دالة DOMContentLoaded الموجودة)

// إضافة في نهاية DOMContentLoaded
document.addEventListener('DOMContentLoaded', async function() {
    // ... الكود الحالي يبقى كما هو ...
    
    // إضافة تهيئة نظام الإشعارات في النهاية
    try {
        console.log('🔔 بدء تهيئة نظام الإشعارات...');
        
        // إنشاء مدير الإشعارات
        window.notificationManager = new NotificationManager();
        
        // تهيئة النظام
        await window.notificationManager.initialize();
        
        // ربط مع إدارة المستخدمين
        if (window.userManager && window.userManager.currentUser) {
            await window.userManager.setupNotifications();
        }
        
        console.log('✅ نظام الإشعارات جاهز للعمل');
        
    } catch (error) {
        console.warn('⚠️ خطأ في تهيئة نظام الإشعارات:', error);
        console.log('📱 التطبيق يعمل بدون إشعارات');
    }
});

// إضافة دوال للنوافذ العامة
window.enableNotifications = async function() {
    if (window.notificationManager) {
        const success = await window.notificationManager.enableNotifications();
        if (success && window.ui) {
            window.ui.showToast('🔔 تم تفعيل الإشعارات!', 'success');
        }
        return success;
    }
    return false;
};

window.disableNotifications = function() {
    if (window.notificationManager) {
        const success = window.notificationManager.disableNotifications();
        if (success && window.ui) {
            window.ui.showToast('🔕 تم تعطيل الإشعارات', 'info');
        }
        return success;
    }
    return false;
};

window.getNotificationStatus = function() {
    if (window.notificationManager) {
        return window.notificationManager.getStatus();
    }
    return { supported: false, enabled: false };
};

console.log('🔔 تم إضافة نظام الإشعارات إلى SHIQ بنجاح - جميع الوظائف الحالية محفوظة!');
