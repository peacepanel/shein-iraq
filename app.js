// =============================================================
// SHIQ APP.JS (معدل للعمل مع Google Apps Script + User Profile)
// =============================================================

// ===== CONFIG =====
const GAS_URL = "https://script.google.com/macros/s/AKfycbzc9ojokNkOcmtINeXR9ijzc5HCfq5Ljgcp_4WIpW5JLGSnJryRvnyZqH8EEwB7tbHk/exec";

// ===== USER MANAGER =====
window.userManager = {
  currentUser: null,

  saveUser: async function (userData) {
    const payload = {
      action: "save_user",
      userData: userData
    };

    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    console.log("Save user result:", data);
    return data;
  },

  showRegistrationForm: function () {
    alert("📝 هنا سيظهر نموذج التسجيل (بإمكانك استبداله بمودال HTML).");
    // يمكنك هنا استدعاء نافذة تسجيل فعلية إذا كانت لديك
  }
};

// ===== ORDER MANAGER =====
window.orderManager = {
  saveOrder: async function (orderData) {
    const payload = {
      action: "save_order",
      orderData: orderData
    };

    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    console.log("Save order result:", data);
    return data;
  }
};

// ===== ANALYTICS MANAGER =====
window.analytics = {
  trackEvent: async function (eventName, details) {
    const payload = {
      action: "track_event",
      eventData: {
        event: eventName,
        details: details
      }
    };

    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    console.log("Track event result:", data);
    return data;
  }
};

// ===== نافذة الملف الشخصي =====
window.showUserProfile = function() {
  console.log('👤 عرض الملف الشخصي الكامل');
  
  try {
      if (!window.userManager) {
          console.log('تهيئة نظام إدارة المستخدمين...');
          return;
      }
      
      if (!window.userManager.currentUser) {
          console.log('لا يوجد مستخدم - عرض نموذج التسجيل');
          if (window.ui && window.ui.showToast) {
              window.ui.showToast('📝 يرجى تسجيل بياناتك أولاً للوصول للملف الشخصي', 'info');
          }
          window.userManager.showRegistrationForm();
          return;
      }
      
      // إنشاء نافذة الملف الشخصي
      createUserProfileModal(window.userManager.currentUser);
      
  } catch (error) {
      console.error('خطأ في عرض الملف الشخصي:', error);
      alert('حدث خطأ في عرض الملف الشخصي');
  }
};

function createUserProfileModal(user) {
  const existingModal = document.getElementById('user-profile-modal');
  if (existingModal) {
      existingModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.id = 'user-profile-modal';
  modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; justify-content: center;
      align-items: center; z-index: 10000; font-family: 'Segoe UI', sans-serif;
  `;
  
  modal.innerHTML = `
      <div style="
          background: white; border-radius: 20px; padding: 30px;
          max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;
          position: relative;
      ">
          <button onclick="closeUserProfile()" style="
              position: absolute; top: 15px; left: 15px; background: #ef4444;
              color: white; border: none; width: 30px; height: 30px;
              border-radius: 50%; cursor: pointer; font-size: 18px;
          ">×</button>
          
          <h2 style="text-align: center; color: #8B5CF6; margin-bottom: 25px;">
              👤 الملف الشخصي
          </h2>
          
          <div style="margin-bottom: 20px;">
              <h3 style="color: #8B5CF6; margin-bottom: 15px;">📋 المعلومات الأساسية</h3>
              <p><strong>الاسم:</strong> ${user.name}</p>
              <p><strong>الهاتف:</strong> ${user.phone}</p>
              <p><strong>المحافظة:</strong> ${user.governorate}</p>
              <p><strong>العنوان:</strong> ${user.address || 'غير محدد'}</p>
              <p><strong>الجنس:</strong> ${user.gender === 'female' ? 'أنثى' : user.gender === 'male' ? 'ذكر' : 'غير محدد'}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
              <h3 style="color: #8B5CF6; margin-bottom: 15px;">🎯 الاهتمامات</h3>
              <div>
                  ${user.interests && user.interests.length > 0 
                      ? user.interests.map(interest => 
                          `<span style="
                              background: #8B5CF6; color: white; padding: 5px 10px;
                              border-radius: 15px; margin: 5px; display: inline-block;
                              font-size: 0.9rem;
                          ">${interest}</span>`
                        ).join('')
                      : '<p style="color: #666;">لا توجد اهتمامات محددة</p>'
                  }
              </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 25px;">
              <button onclick="editUserProfile()" style="
                  background: linear-gradient(135deg, #8B5CF6, #A855F7); color: white;
                  border: none; padding: 15px; border-radius: 10px; cursor: pointer;
                  font-weight: bold;
              ">📝 تعديل البيانات</button>
              <button onclick="closeUserProfile()" style="
                  background: #6b7280; color: white; border: none; padding: 15px;
                  border-radius: 10px; cursor: pointer; font-weight: bold;
              ">إغلاق</button>
          </div>
      </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  modal.addEventListener('click', function(e) {
      if (e.target === modal) {
          closeUserProfile();
      }
  });
}

window.closeUserProfile = function() {
  const modal = document.getElementById('user-profile-modal');
  if (modal) {
      modal.remove();
      document.body.style.overflow = 'auto';
  }
};

window.editUserProfile = function() {
  closeUserProfile();
  if (window.userManager) {
      window.userManager.showRegistrationForm();
      setTimeout(() => {
          const user = window.userManager.currentUser;
          if (user) {
              const fields = {
                  'userName': user.name,
                  'userPhone': user.phone,
                  'userGovernorate': user.governorate,
                  'userAddress': user.address || '',
                  'userGender': user.gender || ''
              };
              
              Object.entries(fields).forEach(([id, value]) => {
                  const field = document.getElementById(id);
                  if (field) field.value = value;
              });

              if (user.interests && Array.isArray(user.interests)) {
                  user.interests.forEach(interest => {
                      const checkbox = document.querySelector(`input[type="checkbox"][value="${interest}"]`);
                      if (checkbox) checkbox.checked = true;
                  });
              }
          }
      }, 200);
  }
};
