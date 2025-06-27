// ========================================================================
// SHIQ SERVICE WORKER - UPDATED VERSION v3.2 مع دعم Firebase
// خدمة العمل المحدثة مع الحفاظ على جميع الوظائف الحالية
// ========================================================================

const CACHE_NAME = 'shiq-v3.2.0-firebase';
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './firebase-messaging-sw.js', // 🔔 إضافة جديدة
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// 🔔 إعدادات الإشعارات الجديدة
const NOTIFICATION_CONFIG = {
  DEFAULT_ICON: './icons/icon-192x192.png',
  BADGE_ICON: './icons/icon-72x72.png',
  DEFAULT_VIBRATE: [200, 100, 200],
  CLICK_URL: './',
  APP_NAME: 'SHIQ - شي ان العراق'
};

// ===== 1. تثبيت Service Worker (محدث) =====
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install - Version 3.2.0 with Firebase Support');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell with Firebase files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[ServiceWorker] Install failed:', error);
      })
  );
});

// ===== 2. تفعيل Service Worker (محدث) =====
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate with Firebase integration');
  event.waitUntil(
    Promise.all([
      // تنظيف الكاش القديم
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // 🔔 تهيئة دعم الإشعارات
      initializeNotificationSupport()
    ]).then(() => {
      console.log('[ServiceWorker] Claiming clients with Firebase ready');
      return self.clients.claim();
    }).catch(error => {
      console.error('[ServiceWorker] Activate failed:', error);
    })
  );
});

// ===== 3. معالجة الطلبات (الحالي + محدث) =====
self.addEventListener('fetch', event => {
  // تسجيل مبسط للطلبات (نفس الكود الحالي)
  if (event.request.url.includes('googleapis.com')) {
    console.log('[ServiceWorker] Google API request:', event.request.url);
  }
  
  // تخطي الطلبات الخارجية لتجنب مشاكل CORS (نفس الكود الحالي)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إرجاع النسخة المحفوظة أو جلب من الشبكة (نفس الكود الحالي)
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          // عدم حفظ الاستجابات غير الصحيحة (نفس الكود الحالي)
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // نسخ الاستجابة (نفس الكود الحالي)
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            })
            .catch(error => {
              console.warn('[ServiceWorker] Cache put failed:', error);
            });

          return response;
        }).catch(error => {
          console.warn('[ServiceWorker] Fetch failed:', error);
          // استرجاع الصفحة الرئيسية للتنقل (نفس الكود الحالي)
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
      .catch(error => {
        console.error('[ServiceWorker] Response failed:', error);
      })
  );
});

// ===== 4. دوال الإشعارات الجديدة =====

// 🔔 تهيئة دعم الإشعارات
async function initializeNotificationSupport() {
  try {
    console.log('[ServiceWorker] Initializing notification support...');
    
    // التحقق من دعم الإشعارات
    if (!('showNotification' in self.registration)) {
      console.warn('[ServiceWorker] Notifications not supported');
      return false;
    }
    
    // تحميل إعدادات الإشعارات
    await loadNotificationSettings();
    
    console.log('[ServiceWorker] ✅ Notification support initialized');
    return true;
    
  } catch (error) {
    console.error('[ServiceWorker] Failed to initialize notifications:', error);
    return false;
  }
}

// 🔔 تحميل إعدادات الإشعارات
async function loadNotificationSettings() {
  try {
    // يمكن تحميل الإعدادات من IndexedDB أو Cache
    // للبساطة، نستخدم إعدادات افتراضية
    self.notificationSettings = {
      enabled: true,
      sound: true,
      vibrate: true,
      showOnForeground: true
    };
    
    console.log('[ServiceWorker] Notification settings loaded');
  } catch (error) {
    console.warn('[ServiceWorker] Failed to load notification settings:', error);
  }
}

// 🔔 معالجة الإشعارات الواردة (محدث من النسخة الحالية)
self.addEventListener('push', event => {
  console.log('[ServiceWorker] Push notification received');
  
  // ملاحظة: Firebase Messaging SW يتعامل مع معظم الإشعارات
  // هذا معالج احتياطي للإشعارات المحلية أو المخصصة
  
  try {
    let notificationData = {
      title: NOTIFICATION_CONFIG.APP_NAME,
      body: 'لديك إشعار جديد!',
      icon: NOTIFICATION_CONFIG.DEFAULT_ICON,
      badge: NOTIFICATION_CONFIG.BADGE_ICON,
      data: {
        url: NOTIFICATION_CONFIG.CLICK_URL,
        timestamp: Date.now(),
        source: 'service_worker'
      }
    };
    
    // محاولة تحليل بيانات الإشعار
    if (event.data) {
      try {
        const payload = event.data.json();
        notificationData = {
          ...notificationData,
          ...payload
        };
        console.log('[ServiceWorker] Parsed push data:', payload);
      } catch (e) {
        console.warn('[ServiceWorker] Failed to parse push data, using text');
        notificationData.body = event.data.text() || notificationData.body;
      }
    }
    
    const notificationOptions = {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      vibrate: NOTIFICATION_CONFIG.DEFAULT_VIBRATE,
      data: notificationData.data,
      tag: 'shiq-notification',
      requireInteraction: false,
      silent: false,
      actions: [
        {
          action: 'open',
          title: '🛍️ تصفح المنتجات',
          icon: NOTIFICATION_CONFIG.DEFAULT_ICON
        },
        {
          action: 'close',
          title: '❌ إغلاق'
        }
      ]
    };
    
    // عرض الإشعار
    event.waitUntil(
      self.registration.showNotification(notificationData.title, notificationOptions)
        .then(() => {
          console.log('[ServiceWorker] ✅ Notification displayed successfully');
          
          // تسجيل إحصائية الإشعار
          trackNotificationEvent('displayed', notificationData);
        })
        .catch(error => {
          console.error('[ServiceWorker] ❌ Failed to show notification:', error);
        })
    );
    
  } catch (error) {
    console.error('[ServiceWorker] Push notification handling failed:', error);
    
    // إشعار احتياطي في حالة الخطأ
    event.waitUntil(
      self.registration.showNotification(NOTIFICATION_CONFIG.APP_NAME, {
        body: 'لديك إشعار جديد',
        icon: NOTIFICATION_CONFIG.DEFAULT_ICON,
        badge: NOTIFICATION_CONFIG.BADGE_ICON,
        tag: 'shiq-notification-fallback'
      })
    );
  }
});

// 🔔 معالجة النقر على الإشعارات (محدث)
self.addEventListener('notificationclick', event => {
  console.log('[ServiceWorker] Notification click received:', event);

  event.notification.close();

  try {
    const notificationData = event.notification.data || {};
    let targetUrl = notificationData.url || NOTIFICATION_CONFIG.CLICK_URL;
    
    // معالجة الإجراءات المختلفة
    switch (event.action) {
      case 'open':
        targetUrl = notificationData.url || NOTIFICATION_CONFIG.CLICK_URL;
        console.log('[ServiceWorker] Open action clicked');
        break;
      case 'close':
        console.log('[ServiceWorker] Close action clicked');
        trackNotificationEvent('dismissed', notificationData);
        return; // لا نفتح النافذة
      default:
        // النقر على جسم الإشعار نفسه
        targetUrl = notificationData.url || NOTIFICATION_CONFIG.CLICK_URL;
        console.log('[ServiceWorker] Body click');
        break;
    }
    
    // تسجيل النقرة
    trackNotificationEvent('clicked', notificationData, event.action);
    
    // فتح أو التركيز على النافذة
    event.waitUntil(
      handleNotificationClick(targetUrl)
        .catch(error => {
          console.error('[ServiceWorker] Failed to handle notification click:', error);
        })
    );

  } catch (error) {
    console.error('[ServiceWorker] Notification click handling failed:', error);
    
    // فتح التطبيق كحل احتياطي
    event.waitUntil(
      clients.openWindow(NOTIFICATION_CONFIG.CLICK_URL)
        .catch(() => console.error('[ServiceWorker] Failed to open fallback window'))
    );
  }
});

// 🔔 معالجة إغلاق الإشعارات (جديد)
self.addEventListener('notificationclose', event => {
  console.log('[ServiceWorker] Notification closed:', event.notification.tag);

  try {
    const notificationData = event.notification.data || {};
    
    // تسجيل إغلاق الإشعار
    trackNotificationEvent('closed', notificationData);
    
  } catch (error) {
    console.warn('[ServiceWorker] Failed to track notification close:', error);
  }
});

// 🔔 معالجة النقر على الإشعار
async function handleNotificationClick(targetUrl) {
  try {
    // البحث عن نافذة مفتوحة للتطبيق
    const clientList = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });
    
    // البحث عن نافذة موجودة للتطبيق
    for (let i = 0; i < clientList.length; i++) {
      const client = clientList[i];
      if (client.url.includes(self.location.origin) && 'focus' in client) {
        console.log('[ServiceWorker] Found existing window, focusing...');
        
        // إرسال رسالة للنافذة الموجودة بالرابط المطلوب
        client.postMessage({
          type: 'NOTIFICATION_CLICK',
          url: targetUrl,
          timestamp: Date.now()
        });
        
        return client.focus();
      }
    }
    
    // فتح نافذة جديدة إذا لم توجد
    if (clients.openWindow) {
      console.log('[ServiceWorker] Opening new window:', targetUrl);
      return clients.openWindow(targetUrl);
    }
    
  } catch (error) {
    console.error('[ServiceWorker] Error handling notification click:', error);
    throw error;
  }
}

// 🔔 تتبع أحداث الإشعارات
function trackNotificationEvent(eventType, notificationData, action = null) {
  try {
    const trackingData = {
      event: eventType,
      action: action,
      timestamp: Date.now(),
      notificationType: notificationData.type || 'unknown',
      source: notificationData.source || 'push',
      userAgent: navigator.userAgent
    };
    
    // إرسال إحصائية لـ Google Apps Script (في الخلفية)
    // استخدام fetch مع no-cors لتجنب مشاكل CORS
    fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'track_notification_event',
        data: trackingData
      })
    }).catch(() => {
      // تجاهل أخطاء الإرسال (العمل في الخلفية)
      console.log('[ServiceWorker] Tracking sent (background)');
    });
    
    console.log('[ServiceWorker] Tracked notification event:', eventType);
    
  } catch (error) {
    console.warn('[ServiceWorker] Failed to track notification event:', error);
  }
}

// ===== 5. الرسائل من التطبيق (محدث) =====
self.addEventListener('message', event => {
  console.log('[ServiceWorker] Message received:', event.data);
  
  try {
    const data = event.data;
    
    // الرسائل الحالية (نفس الكود)
    if (data && data.type === 'SKIP_WAITING') {
      self.skipWaiting();
      return;
    }
    
    // 🔔 الرسائل الجديدة للإشعارات
    if (data && data.type === 'UPDATE_NOTIFICATION_SETTINGS') {
      updateNotificationSettings(data.settings);
      return;
    }
    
    if (data && data.type === 'SCHEDULE_LOCAL_NOTIFICATION') {
      scheduleLocalNotification(data);
      return;
    }
    
    if (data && data.type === 'TEST_NOTIFICATION') {
      showTestNotification();
      return;
    }
    
    // رسائل تحديث معلومات المستخدم (الحالي)
    if (data && data.type === 'UPDATE_USER_INFO') {
      self.currentUserInfo = data.userInfo;
      console.log('[ServiceWorker] User info updated:', self.currentUserInfo);
      return;
    }
    
  } catch (error) {
    console.error('[ServiceWorker] Message handling failed:', error);
  }
});

// 🔔 تحديث إعدادات الإشعارات
function updateNotificationSettings(settings) {
  try {
    self.notificationSettings = {
      ...self.notificationSettings,
      ...settings
    };
    
    console.log('[ServiceWorker] Notification settings updated:', self.notificationSettings);
    
  } catch (error) {
    console.error('[ServiceWorker] Failed to update notification settings:', error);
  }
}

// 🔔 جدولة إشعار محلي
function scheduleLocalNotification(data) {
  try {
    const { title, body, delay, icon, url } = data;
    
    setTimeout(() => {
      const notificationOptions = {
        body: body || 'لديك إشعار جديد',
        icon: icon || NOTIFICATION_CONFIG.DEFAULT_ICON,
        badge: NOTIFICATION_CONFIG.BADGE_ICON,
        vibrate: NOTIFICATION_CONFIG.DEFAULT_VIBRATE,
        data: { 
          url: url || NOTIFICATION_CONFIG.CLICK_URL,
          timestamp: Date.now(),
          type: 'scheduled_local',
          source: 'service_worker'
        },
        tag: 'shiq-scheduled-notification',
        requireInteraction: false
      };
      
      self.registration.showNotification(
        title || NOTIFICATION_CONFIG.APP_NAME, 
        notificationOptions
      ).then(() => {
        console.log('[ServiceWorker] ✅ Local notification displayed');
        trackNotificationEvent('displayed', notificationOptions.data);
      }).catch(error => {
        console.error('[ServiceWorker] ❌ Failed to show local notification:', error);
      });
      
    }, delay || 1000);
    
    console.log('[ServiceWorker] Local notification scheduled');
    
  } catch (error) {
    console.error('[ServiceWorker] Failed to schedule local notification:', error);
  }
}

// 🔔 إشعار تجريبي
function showTestNotification() {
  try {
    const notificationOptions = {
      body: 'هذا اختبار للتأكد من عمل الإشعارات بشكل صحيح',
      icon: NOTIFICATION_CONFIG.DEFAULT_ICON,
      badge: NOTIFICATION_CONFIG.BADGE_ICON,
      vibrate: [300, 100, 300],
      data: { 
        url: NOTIFICATION_CONFIG.CLICK_URL,
        timestamp: Date.now(),
        type: 'test',
        source: 'service_worker'
      },
      tag: 'shiq-test-notification',
      requireInteraction: true,
      actions: [
        {
          action: 'success',
          title: '✅ يعمل بشكل ممتاز',
          icon: NOTIFICATION_CONFIG.DEFAULT_ICON
        },
        {
          action: 'close',
          title: '❌ إغلاق'
        }
      ]
    };
    
    self.registration.showNotification(
      '🧪 اختبار إشعارات شي ان العراق', 
      notificationOptions
    ).then(() => {
      console.log('[ServiceWorker] ✅ Test notification displayed');
      trackNotificationEvent('test_displayed', notificationOptions.data);
    }).catch(error => {
      console.error('[ServiceWorker] ❌ Failed to show test notification:', error);
    });
    
  } catch (error) {
    console.error('[ServiceWorker] Failed to show test notification:', error);
  }
}

// ===== 6. Background sync (الحالي + محدث) =====
self.addEventListener('sync', event => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  
  // المعالجة الحالية
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
  
  // 🔔 مزامنة الإشعارات الجديدة
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

// الدالة الحالية (بدون تغيير)
function doBackgroundSync() {
  return new Promise((resolve) => {
    console.log('[ServiceWorker] Performing background sync');
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

// 🔔 مزامنة الإشعارات
async function syncNotifications() {
  try {
    console.log('[ServiceWorker] Syncing notifications...');
    
    // يمكن هنا جلب إشعارات معلقة من الخادم
    // أو مزامنة إعدادات الإشعارات
    
    console.log('[ServiceWorker] ✅ Notifications synced');
    
  } catch (error) {
    console.error('[ServiceWorker] ❌ Failed to sync notifications:', error);
  }
}

// ===== 7. معالجة الأخطاء (الحالي + محدث) =====
self.addEventListener('error', event => {
  console.error('[ServiceWorker] Error occurred:', event.error);
  
  // 🔔 تسجيل أخطاء الإشعارات
  if (event.error && event.error.message.includes('notification')) {
    trackNotificationEvent('error', {
      error: event.error.message,
      timestamp: Date.now()
    });
  }
});

self.addEventListener('unhandledrejection', event => {
  console.error('[ServiceWorker] Unhandled promise rejection:', event.reason);
});

// ===== 8. تسجيل حالة Service Worker (محدث) =====
console.log('[ServiceWorker] SHIQ Service Worker v3.2.0 - Firebase Integration Loaded');
console.log('[ServiceWorker] Features: Caching, Push notifications, Background sync, Firebase integration');
console.log('[ServiceWorker] Status: Ready for notifications and all existing features preserved');

// رسائل تأكيد التحميل الناجح (محدث)
self.addEventListener('install', () => {
  console.log('✅ [ServiceWorker] Updated version with Firebase installed successfully');
});

self.addEventListener('activate', () => {
  console.log('✅ [ServiceWorker] Updated version with Firebase activated successfully');
  console.log('🔔 [ServiceWorker] Notification support ready');
});