// PWA Installation Logic
let deferredPrompt;
const installBanner = document.getElementById('installBanner');

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBanner.classList.add('show');
});

installBanner.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installBanner.classList.remove('show');
        }
        deferredPrompt = null;
    }
});

// Categories Configuration
const categories = {
    'اكسسوارات نسائية': {
        sheetId: '1Tf1B4HqO5lnwxP8oSqzRMwmvegnIDJam-DMhQc8s5S8',
        sheets: ['تراجي', 'ساعات', 'سوار', 'كلادة', 'محابس', 'قراصات', 'اكسسوار جسم', 'شفقات', 'احزمة', 'مداليات', 'نضارات', 'مهفات'],
        imageCol: 'F',
        priceCol: 'I'
    },
    'احذية وحقائب متنوعة': {
        sheetId: '1saUoR7Z7xYI-WCUZNTs3YRZ6jEdnM6S03M15tgw-QiQ',
        sheets: ['جزدان', 'حقائب', 'سلبر نسائي', 'احذية نسائي', 'اكسسوارات اطفال', 'احذية اطفال'],
        imageCol: 'F',
        priceCol: 'I',
        sizeCol: 'G'
    },
    'ربطات وشالات': {
        sheetId: '17mlV_BaJFQZoz-Cof1wJG6e-2X1QCRs9usoIWXmQGI8',
        sheets: ['جواريب', 'اكمام كفوف', 'شالات', 'شال كتف', 'سكارف', 'بروشات', 'ياخه'],
        imageCol: 'F',
        priceCol: 'I'
    },
    'شيكلام': {
        sheetId: '1K08r0X7XQ6ZUkUYjR8QI_91X1hX6v7K8e6181Vuz4os',
        sheets: ['اظافر', 'صبغ اظافر', 'شعر', 'فرش', 'مكياج', 'وشم', 'حقائب مكياج', 'منوع'],
        imageCol: 'F',
        priceCol: 'I'
    },
    'منزلية': {
        sheetId: '1aLXBPsxTixs28wFi55P9ZRNU2RhqzFfjxg8Cbp4m8Rw',
        sheets: ['منوع', 'ديكورات', 'ادوات منزلية'],
        imageCol: 'F',
        priceCol: 'I',
        sizeCol: 'J'
    },
    'مفروشات': {
        sheetId: '1s1WVVjA--0BqHfzE-ANm5pq43xkRD1vaDyNeGUAXFLk',
        sheets: ['شراشف', 'ستائر', 'ارضيات', 'وجه كوشات', 'مناشف', 'تلبيسه لحاف', 'اغطية', 'مقاعد تلبيس', 'اخرى'],
        imageCol: 'F',
        priceCol: 'I',
        sizeCol: 'J'
    },
    'اطفالي صيفي': {
        sheetId: '1Rhbilfz7VaHTR-qCxdjNK_5zk52kdglYd-ADK2Mn2po',
        sheets: ['3 - 0 M', '6 - 3 M', '9 - 6 M', '12 - 9 M', '18 - 12 M', '24 - 18 M', '1 Y', '2 Y', '3 Y', '4 Y', '5 Y', '6 Y', '7 Y', '8 Y', '9 Y', '10 Y', '11 Y', '12 Y', '13 Y', '14 Y'],
        imageCol: 'F',
        priceCol: 'H',
        sizeCol: 'I'
    },
    'اطفالي شتائي': {
        sheetId: '1JAI7pfkQiPAL-6H6DBjryPHGAPoRacY3TTajEJHy8HQ',
        sheets: ['3 - 0 M', '6 - 3 M', '9 - 6 M', '12 - 9 M', '18 - 12 M', '24 - 18 M', '1 Y', '2 Y', '3 Y', '4 Y', '5 Y', '6 Y', '7 Y', '8 Y', '9 Y', '10 Y', '11 Y', '12 Y', '13 Y', '14 Y'],
        imageCol: 'F',
        priceCol: 'H',
        sizeCol: 'I'
    },
    'نسائي شتائي': {
        sheetId: '1cXt49H5Wy1jGB0jrutp8JviLq3qSHo7VQuCoBclDRAI',
        sheets: ['5XL', '4XL', '3XL', '2XL', '1XL', '0XL', 'XL', 'L', 'M', 'S', 'XS', 'one size'],
        imageCol: 'F',
        priceCol: 'H',
        sizeCol: 'D'
    },
    'نسائي صيفي': {
        sheetId: '1POUe8K4EadYctDbTr1hnpKJ_r6slAVaX6VWyfbGYBFE',
        sheets: ['5XL', '4XL', '3XL', '2XL', '1XL', '0XL', 'XL', 'L', 'M', 'S', 'XS', 'one size'],
        imageCol: 'F',
        priceCol: 'H',
        sizeCol: 'D'
    },
    'مستلزمات موبايل': {
        sheetId: '1xMFXIY4EjjbEnGVK-8m_Q8G9Ng-2NJ93kPkdpfVQuGk',
        sheets: ['كفرات موبايل', 'ملحقات اخرى'],
        imageCol: 'F',
        priceCol: 'I',
        sizeCol: 'G'
    }
};

// Global Variables
const apiKey = 'AIzaSyATs-nWgTonTFEKCi_4F5lQ_Ao0vnJ5Xmk';
const phoneNumber = '9647862799748';
const categoryContainer = document.getElementById('category-container');
const categoryNav = document.getElementById('category-nav');
const workbookContainer = document.getElementById('workbook-container');
const productContainer = document.getElementById('product-container');
const searchBox = document.getElementById('searchBox');
let selectedProducts = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    createCategoryNav();
    loadCategoryImages();
    
    // Hide search box initially
    searchBox.style.display = 'none';
    
    // Add event listeners
    setupEventListeners();
});

// Create category navigation
function createCategoryNav() {
    Object.keys(categories).forEach((categoryName, index) => {
        const navBtn = document.createElement('button');
        navBtn.className = 'nav-category-btn';
        navBtn.textContent = categoryName;
        navBtn.onclick = () => {
            // Remove active class from all buttons
            document.querySelectorAll('.nav-category-btn').forEach(btn => 
                btn.classList.remove('active'));
            // Add active class to clicked button
            navBtn.classList.add('active');
            // Load workbooks for this category
            loadWorkbooks(categoryName);
        };
        categoryNav.appendChild(navBtn);
    });
}

// Load category images
function loadCategoryImages() {
    Object.keys(categories).forEach(categoryName => {
        const category = categories[categoryName];
        const sheetId = category.sheetId;

        const randomImageRange = `A2:${category.imageCol}2`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${randomImageRange}?key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const imageUrl = data.values && data.values[0] ? data.values[0][category.imageCol.charCodeAt(0) - 65] : '';
                createCategoryElement(categoryName, imageUrl);
            })
            .catch(error => {
                console.error(`Error fetching data for ${categoryName}:`, error);
                createCategoryElement(categoryName, '');
            });
    });
}

// Create category element
function createCategoryElement(categoryName, imageUrl) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7YtdmI2LHYqTwvdGV4dD48L3N2Zz4=';
    
    categoryDiv.innerHTML = `
        <img src="${imageUrl || defaultImage}" alt="${categoryName}" onerror="this.src='${defaultImage}'">
        <div class="category-name">${categoryName}</div>
    `;
    categoryDiv.onclick = () => loadWorkbooks(categoryName);
    categoryContainer.appendChild(categoryDiv);
}

// Load workbooks for a category
function loadWorkbooks(categoryName) {
    workbookContainer.innerHTML = '';
    productContainer.innerHTML = '<div class="default-message">اختر قسماً من الأقسام أعلاه لعرض المنتجات <span class="emoji-icon">👆</span></div>';
    
    // Clear previous search
    searchBox.value = '';
    
    // Show search box only for specific categories
    if (categoryName === 'احذية وحقائب متنوعة') {
        searchBox.style.display = 'block';
        searchBox.placeholder = '🔍 ابحث بالمقاس أو نوع الحذاء...';
    } else if (categoryName === 'مستلزمات موبايل') {
        searchBox.style.display = 'block';
        searchBox.placeholder = '🔍 ابحث بنوع الموبايل أو الاكسسوار...';
    } else {
        searchBox.style.display = 'none';
    }

    const workbooks = categories[categoryName].sheets;
    workbooks.forEach(workbook => {
        const workbookDiv = document.createElement('button');
        workbookDiv.className = 'workbook-button';
        workbookDiv.textContent = workbook;
        workbookDiv.onclick = () => loadProducts(categoryName, workbook);
        workbookContainer.appendChild(workbookDiv);
    });

    // Smooth scroll to workbooks section
    workbookContainer.scrollIntoView({ behavior: 'smooth' });
}

// Load products for a workbook
function loadProducts(categoryName, workbook) {
    const sheetId = categories[categoryName].sheetId;
    const range = `${workbook}!A1:O`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const imageCol = categories[categoryName].imageCol;
    const priceCol = categories[categoryName].priceCol;
    const sizeCol = categories[categoryName].sizeCol || null;

    productContainer.innerHTML = '<div class="loading"></div>';
    
    // Clear previous search
    searchBox.value = '';
    
    // Show search box only for specific categories
    if (categoryName === 'احذية وحقائب متنوعة') {
        searchBox.style.display = 'block';
        searchBox.placeholder = '🔍 ابحث بالمقاس أو نوع الحذاء...';
    } else if (categoryName === 'مستلزمات موبايل') {
        searchBox.style.display = 'block';
        searchBox.placeholder = '🔍 ابحث بنوع الموبايل أو الاكسسوار...';
    } else {
        searchBox.style.display = 'none';
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const products = data.values ? data.values.slice(1) : [];
            productContainer.innerHTML = '';

            if (products.length === 0) {
                productContainer.innerHTML = '<div class="default-message">لا توجد منتجات في هذا القسم حالياً <span class="emoji-icon">😔</span></div>';
                return;
            }

            products.forEach(product => {
                if (!product[0] || !product[imageCol.charCodeAt(0) - 65]) return;

                createProductElement(product, imageCol, priceCol, sizeCol);
            });

            // Smooth scroll to products section
            productContainer.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productContainer.innerHTML = '<div class="default-message">حدث خطأ في تحميل المنتجات <span class="emoji-icon">😞</span></div>';
        });
}

// Create product element
function createProductElement(product, imageCol, priceCol, sizeCol) {
    const defaultProductImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7YtdmI2LHYqSDYrdin2YTZiNeKPC90ZXh0Pjwvc3ZnPic=';
    
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    productDiv.innerHTML = `
        <img src="${product[imageCol.charCodeAt(0) - 65]}" alt="Product Image" 
             onclick="enlargeImage('${product[imageCol.charCodeAt(0) - 65]}')"
             onerror="this.src='${defaultProductImage}'">
        <div class="product-info">
            <div class="product-code">${product[0]}</div>
            <div class="product-price">
                <span class="price-icon">💰</span>
                ${product[priceCol.charCodeAt(0) - 65]} دينار
            </div>
            ${sizeCol ? `<div class="product-size">
                <span class="size-icon">📏</span>
                المقاس: ${product[sizeCol.charCodeAt(0) - 65] || 'غير محدد'}
            </div>` : ''}
            <button class="add-to-cart-btn" onclick="toggleProduct('${product[0]}', '${product[priceCol.charCodeAt(0) - 65]}', '${product[imageCol.charCodeAt(0) - 65]}', this)">
                إضافة للسلة
            </button>
        </div>
    `;
    productContainer.appendChild(productDiv);
}

// Toggle product selection
function toggleProduct(name, price, imageUrl, button) {
    const productIndex = selectedProducts.findIndex(p => p.name === name);
    if (productIndex > -1) {
        selectedProducts.splice(productIndex, 1);
        button.classList.remove('selected');
        button.textContent = 'إضافة للسلة';
    } else {
        selectedProducts.push({ name, price, imageUrl });
        button.classList.add('selected');
        button.textContent = '✓ تمت الإضافة';
    }
}

// Search products
function searchProduct() {
    const query = searchBox.value.toLowerCase();
    const productDivs = productContainer.getElementsByClassName('product');

    Array.from(productDivs).forEach(div => {
        const allText = div.textContent.toLowerCase();
        
        if (allText.includes(query)) {
            div.style.display = 'block';
        } else {
            div.style.display = 'none';
        }
    });
}

// Enlarge image
function enlargeImage(src) {
    const overlay = document.getElementById('overlay');
    const enlargedImage = document.getElementById('enlargedImage');
    enlargedImage.src = src;
    overlay.style.display = 'flex';
    
    // Prevent body scroll when overlay is open
    document.body.style.overflow = 'hidden';
}

// Close enlarged image
function closeEnlargedImage() {
    document.getElementById('overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Open cart and prepare WhatsApp message
function openCart() {
    if (selectedProducts.length === 0) {
        alert('لم تختر أي منتجات بعد! 🛒');
        return;
    }

    let message = '🛍️ المنتجات التي اخترتها:\n\n';
    let imagesHtml = '';
    let total = 0;

    selectedProducts.forEach((product, index) => {
        message += `📦 رقم المنتج: ${product.name}\n💰 السعر: ${product.price} دينار\n🔗 رابط الصورة: ${product.imageUrl}\n\n`;
        imagesHtml += `
            <div class="image-preview" id="preview-item-${index}">
                <img src="${product.imageUrl}" alt="Product Image">
                <h2>${product.name}</h2>
                <p>💰 ${product.price} دينار</p>
                <button class="remove-button" onclick="removeFromCart('${product.name}', ${index})">إزالة</button>
            </div>
        `;
        total += parseFloat(product.price) || 0;
    });

    const deliveryFee = 5000;
    total += deliveryFee;
    message += `📊 المجموع الكلي: ${total} دينار (شامل مبلغ التوصيل)\n\n`;
    message += '✅ يرجى تأكيد الطلب وتزويدي بعنوانك لتأكيد الطلب.';

    imagesHtml += `<div class="total">📊 المجموع الكلي: ${total} دينار (شامل مبلغ التوصيل)</div>`;

    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    // Create order preview window
    createOrderPreviewWindow(imagesHtml, whatsappLink);
}

// Create order preview window
function createOrderPreviewWindow(imagesHtml, whatsappLink) {
    const previewWindow = window.open('', '_blank', 'width=700,height=600');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>مراجعة الطلب وإرسال</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    direction: rtl; 
                    margin: 0;
                }
                .container { 
                    background: white; 
                    border-radius: 20px; 
                    padding: 25px; 
                    max-width: 800px; 
                    margin: 0 auto; 
                    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                }
                .image-preview { 
                    width: 32%; 
                    margin: 1%; 
                    border: 2px solid #e5e7eb; 
                    padding: 15px; 
                    box-sizing: border-box; 
                    text-align: center; 
                    display: inline-block; 
                    vertical-align: top; 
                    border-radius: 15px; 
                    background: #f9fafb; 
                    transition: all 0.3s ease;
                }
                .image-preview:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .image-preview img { 
                    width: 100%; 
                    height: 120px; 
                    object-fit: cover; 
                    margin-bottom: 10px; 
                    border-radius: 10px; 
                }
                .image-preview h2 {
                    font-size: 1.1rem;
                    margin: 10px 0;
                    color: #374151;
                }
                .image-preview p {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #ef4444;
                    margin: 8px 0;
                }
                .total { 
                    font-weight: bold; 
                    margin-top: 25px; 
                    clear: both; 
                    font-size: 1.3rem; 
                    color: #1f2937; 
                    text-align: center; 
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); 
                    padding: 20px; 
                    border-radius: 15px; 
                    border: 2px solid #8B5CF6; 
                }
                .remove-button { 
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                    color: white; 
                    border: none; 
                    padding: 8px 15px; 
                    cursor: pointer; 
                    border-radius: 20px; 
                    margin-top: 8px; 
                    transition: all 0.3s ease; 
                    font-weight: 600; 
                    font-size: 0.9rem;
                }
                .remove-button:hover { 
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
                    transform: translateY(-2px); 
                }
                .send-button { 
                    display: block; 
                    width: 100%; 
                    text-align: center; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 50px; 
                    margin-top: 25px; 
                    font-size: 1.1rem; 
                    font-weight: 700; 
                    transition: all 0.3s ease; 
                    text-transform: uppercase; 
                    letter-spacing: 1px; 
                }
                .send-button:hover { 
                    background: linear-gradient(135deg, #128C7E 0%, #25D366 100%); 
                    transform: translateY(-3px); 
                    box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4); 
                }
                h1 { 
                    text-align: center; 
                    color: #1f2937; 
                    margin-bottom: 30px; 
                    font-size: 2rem; 
                }
                @media (max-width: 768px) {
                    .image-preview {
                        width: 48%;
                        margin: 1%;
                    }
                    .container {
                        padding: 15px;
                        margin: 10px;
                    }
                    h1 {
                        font-size: 1.5rem;
                    }
                }
                @media (max-width: 480px) {
                    .image-preview {
                        width: 100%;
                        margin: 5px 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🛍️ مراجعة طلبك</h1>
                ${imagesHtml}
                <a class="send-button" href="${whatsappLink}" target="_blank">📱 إرسال الطلب عبر واتساب</a>
            </div>
        </body>
        </html>
    `);
}

// Remove product from cart
function removeFromCart(name, index) {
    selectedProducts = selectedProducts.filter(p => p.name !== name);
    const previewItem = document.getElementById(`preview-item-${index}`);
    if (previewItem) previewItem.remove();
    
    // Update buttons in main window
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        if (button.onclick && button.onclick.toString().includes(name)) {
            button.classList.remove('selected');
            button.textContent = 'إضافة للسلة';
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Close overlay when clicking anywhere
    document.getElementById('overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEnlargedImage();
        }
    });

    // Close overlay when clicking on image
    document.getElementById('enlargedImage').addEventListener('click', function(e) {
        e.stopPropagation();
        closeEnlargedImage();
    });

    // Close overlay when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEnlargedImage();
        }
    });

    // Handle app state changes
    window.addEventListener('appinstalled', () => {
        installBanner.classList.remove('show');
        console.log('PWA was installed');
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
        console.log('App is online');
    });

    window.addEventListener('offline', () => {
        console.log('App is offline');
    });
}