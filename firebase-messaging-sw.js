// ========================================================================
// FIREBASE MESSAGING SERVICE WORKER - SHIQ NOTIFICATIONS
// خدمة الإشعارات المخصصة لتطبيق شي ان العراق
// ========================================================================

// تكوين Firebase (نفس الإعدادات من التطبيق الرئيسي)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDnXthgmxNk4fzPbAdaix5R7yOClD33_S8",
  authDomain: "shiq-notifications.firebaseapp.com",
  projectId: "shiq-notifications",
  storageBucket: "shiq-notifications.firebasestorage.app",
  messagingSenderId: "826765783989",
  appId: "1:826765783989:web:097095ac64878cfd195ffc"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// الحصول على خدمة الرسائل
const messaging = firebase.messaging();

// ===== معالجة الإشعارات في الخلفية =====
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] استلام إشعار خلفي:', payload);

  try {
    // استخراج البيانات من الحمولة
    const notificationTitle = payload.notification?.title || payload.data?.title || 'شي ان العراق';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'لديك إشعار جديد',
      icon: payload.notification?.icon || payload.data?.icon || './icons/icon-192x192.png',
      badge: './icons/icon-72x72.png',
      image: payload.notification?.image || payload.data?.image || null,
      data: {
        click_action: payload.notification?.click_action || payload.data?.click_action || './',
        url: payload.data?.url || './',
        type: payload.data?.type || 'general',
        timestamp: Date.now(),
        ...payload.data
      },
      vibrate: [200, 100, 200, 100, 200],
      tag: 'shiq-notification',
      requireInteraction: false,
      silent: false,
      actions: [
        {
          action: 'open',
          title: '🛍️ تصفح المنتجات',
          icon: './icons/icon-72x72.png'
        },
        {
          action: 'close',
          title: '❌ إغلاق'
        }
      ]
    };

    // إضافة خصائص متقدمة حسب نوع الإشعار
    if (payload.data?.type === 'offer') {
      notificationOptions.actions = [
        {
          action: 'view_offer',
          title: '🔥 عرض الخصم',
          icon: './icons/icon-72x72.png'
        },
        {
          action: 'close',
          title: '❌ إغلاق'
        }
      ];
      notificationOptions.vibrate = [300, 100, 300, 100, 300];
      notificationOptions.requireInteraction = true;
    }

    if (payload.data?.type === 'new_products') {
      notificationOptions.actions = [
        {
          action: 'view_products',
          title: '👗 شاهد الجديد',
          icon: './icons/icon-72x72.png'
        },
        {
          action: 'close',
          title: '❌ إغلاق'
        }
      ];
    }

    // عرض الإشعار
    self.registration.showNotification(notificationTitle, notificationOptions);

  } catch (error) {
    console.error('[firebase-messaging-sw.js] خطأ في معالجة الإشعار:', error);
    
    // إشعار احتياطي في حالة الخطأ
    self.registration.showNotification('شي ان العراق', {
      body: 'لديك إشعار جديد',
      icon: './icons/icon-192x192.png',
      badge: './icons/icon-72x72.png',
      data: { url: './' },
      tag: 'shiq-notification-fallback'
    });
  }
});

// ===== معالجة النقر على الإشعار =====
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] تم النقر على الإشعار:', event);

  event.notification.close();

  try {
    const notificationData = event.notification.data || {};
    let targetUrl = notificationData.url || './';

    // معالجة الإجراءات المختلفة
    switch (event.action) {
      case 'open':
      case 'view_offer':
      case 'view_products':
        targetUrl = notificationData.url || './';
        break;
      case 'close':
        console.log('تم إغلاق الإشعار بواسطة المستخدم');
        return;
      default:
        // النقر على جسم الإشعار نفسه
        targetUrl = notificationData.url || './';
        break;
    }

    // فتح أو التركيز على النافذة
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      }).then((clientList) => {
        // البحث عن نافذة مفتوحة للتطبيق
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            console.log('تم العثور على نافذة مفتوحة، التركيز عليها');
            return client.focus();
          }
        }

        // فتح نافذة جديدة إذا لم توجد
        if (clients.openWindow) {
          console.log('فتح نافذة جديدة:', targetUrl);
          return clients.openWindow(targetUrl);
        }
      }).catch((error) => {
        console.error('[firebase-messaging-sw.js] خطأ في معالجة النقر:', error);
      })
    );

    // تتبع النقرات (إرسال إحصائية)
    try {
      const trackingData = {
        action: 'notification_click',
        type: notificationData.type || 'unknown',
        timestamp: Date.now(),
        userAction: event.action || 'body_click'
      };

      // إرسال إحصائية النقر لـ Google Apps Script
      fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'track_notification_click',
          data: trackingData
        })
      }).catch(() => {
        // تجاهل أخطاء التتبع
        console.log('تم النقر على الإشعار (التتبع غير متاح)');
      });
    } catch (error) {
      console.warn('خطأ في تتبع النقر:', error);
    }

  } catch (error) {
    console.error('[firebase-messaging-sw.js] خطأ عام في معالجة النقر:', error);
    
    // فتح التطبيق كحل احتياطي
    if (clients.openWindow) {
      clients.openWindow('./');
    }
  }
});

// ===== معالجة إغلاق الإشعار =====
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] تم إغلاق الإشعار:', event.notification.tag);

  try {
    // تتبع إغلاق الإشعار
    const trackingData = {
      action: 'notification_close',
      type: event.notification.data?.type || 'unknown',
      timestamp: Date.now()
    };

    // إرسال إحصائية الإغلاق
    fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'track_notification_close',
        data: trackingData
      })
    }).catch(() => {
      // تجاهل أخطاء التتبع
    });
  } catch (error) {
    console.warn('خطأ في تتبع إغلاق الإشعار:', error);
  }
});

// ===== دوال مساعدة =====

// دالة لتسجيل الأخطاء
function logError(operation, error) {
  console.error(`[firebase-messaging-sw.js] خطأ في ${operation}:`, error);
  
  try {
    // إرسال تقرير خطأ مبسط
    fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'log_error',
        data: {
          operation: operation,
          error: error.message,
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        }
      })
    }).catch(() => {
      // تجاهل أخطاء الإرسال
    });
  } catch (e) {
    // تجاهل أخطاء التسجيل
  }
}

// معالجة الأخطاء العامة
self.addEventListener('error', (event) => {
  logError('general_error', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  logError('unhandled_rejection', new Error(event.reason));
});

// تسجيل نجاح التحميل
console.log('[firebase-messaging-sw.js] ✅ خدمة إشعارات شي ان العراق جاهزة');
console.log('[firebase-messaging-sw.js] 🔔 الميزات: إشعارات خلفية، معالجة النقرات، تتبع الإحصائيات');
console.log('[firebase-messaging-sw.js] 🚀 النسخة: 1.0.0 - متوافق مع SHIQ v3.2.0');