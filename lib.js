// ========================================
// 全域變數與設定
// ========================================

// Unsplash 狗狗圖片 URL（共 5 張）
const DOG_IMAGES = [
  'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZG9nfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D'
];

const ROTATION_INTERVAL = 10000; // 10 秒輪播一次
const MAX_HISTORY_ITEMS = 10; // 最多儲存 10 筆記錄
const STORAGE_KEY = 'dogAgeHistory'; // LocalStorage 鍵名
const LAST_RESULT_KEY = 'dogAgeLastResult'; // 最後一次計算結果鍵名

let currentImageIndex = 0; // 當前圖片索引
let rotationTimer = null; // 輪播計時器

// ========================================
// DOM 元素引用
// ========================================

const bgContainer = document.getElementById('bgContainer');
const heroImage = document.getElementById('heroImage');
const carouselIndicator = document.getElementById('carouselIndicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const calcBtn = document.getElementById('calcBtn');
const birthdayInput = document.getElementById('birthday');
const loadingSection = document.getElementById('loading');
const resultSection = document.getElementById('result');
const dogAgeEl = document.getElementById('dogAge');
const humanAgeEl = document.getElementById('humanAge');
const noteEl = document.getElementById('note');
const historyPanel = document.getElementById('historyPanel');
const toggleHistoryBtn = document.getElementById('toggleHistory');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');
const toggleFooterBtn = document.getElementById('toggleFooter');
const footerContent = document.getElementById('footerContent');

// ========================================
// 核心計算函式（保留原有邏輯）
// ========================================

// 計算狗狗實際年齡（年，採 365.25 考量閏年）
function calcDogAgeYears(birthISODate) {
  const birth = new Date(birthISODate);
  const today = new Date();
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const years = Math.max(0, (today - birth) / msPerYear);
  return years;
}

// 正確使用 Cell Systems (Wang et al.) 提供的換算公式：
// HumanAge = 16 * ln(DogAge) + 31
function calcHumanAgeFromDog(dogAge) {
  if (dogAge <= 0) return 0;

  // 對非常小的狗齡做下界處理，避免 ln(極小數) 導致極端負值
  const safeDogAge = Math.max(dogAge, 0.05); // 0.05 年 ≈ 18 天
  const humanAge = 16 * Math.log(safeDogAge) + 31;

  // 若 humanAge 出現極端負值，則以 0 做保護
  return Math.max(0, humanAge);
}

// ========================================
// 圖片輪播功能
// ========================================

// 取得隨機圖片索引（不重複當前索引）
function getRandomImageIndex() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * DOG_IMAGES.length);
  } while (newIndex === currentImageIndex && DOG_IMAGES.length > 1);
  return newIndex;
}

// 更新 Hero Section 圖片
function updateImages(index) {
  currentImageIndex = index;
  const imageUrl = DOG_IMAGES[index];

  // 更新 Hero 圖片
  heroImage.src = imageUrl;

  // 更新指示器
  carouselIndicator.textContent = `${index + 1}/${DOG_IMAGES.length}`;
}

// 上一張圖片
function showPrevImage() {
  const prevIndex = (currentImageIndex - 1 + DOG_IMAGES.length) % DOG_IMAGES.length;
  updateImages(prevIndex);
}

// 下一張圖片
function showNextImage() {
  const nextIndex = (currentImageIndex + 1) % DOG_IMAGES.length;
  updateImages(nextIndex);
}

// 開始自動輪播
function startImageRotation() {
  // 初始化：隨機選擇第一張圖片
  const initialIndex = Math.floor(Math.random() * DOG_IMAGES.length);
  updateImages(initialIndex);

  // 每 10 秒切換圖片
  rotationTimer = setInterval(() => {
    const nextIndex = getRandomImageIndex();
    updateImages(nextIndex);
  }, ROTATION_INTERVAL);
}

// ========================================
// LocalStorage 管理
// ========================================

// 讀取歷史記錄
function loadHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('讀取歷史記錄失敗：', error);
    return [];
  }
}

// 儲存歷史記錄
function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('儲存歷史記錄失敗：', error);
    alert('儲存記錄失敗，可能是儲存空間不足。');
  }
}

// 新增記錄（最多 10 筆，FIFO）
function addHistoryItem(birthday, dogAge, humanAge) {
  const history = loadHistory();

  const newItem = {
    id: Date.now(), // 使用時間戳作為唯一 ID
    timestamp: new Date().toISOString(),
    birthday,
    dogAge: dogAge.toFixed(1),
    humanAge: humanAge.toFixed(1)
  };

  // 新記錄插入最前面
  history.unshift(newItem);

  // 限制最多 10 筆
  if (history.length > MAX_HISTORY_ITEMS) {
    history.pop(); // 移除最舊的記錄
  }

  saveHistory(history);
  renderHistory();
}

// 清除所有記錄
function clearAllHistory() {
  if (confirm('確定要清除所有計算記錄嗎？')) {
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  }
}

// 儲存最後一次計算結果
function saveLastResult(birthday, dogAge, humanAge) {
  try {
    const lastResult = {
      birthday,
      dogAge: dogAge.toFixed(1),
      humanAge: humanAge.toFixed(1)
    };
    localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(lastResult));
  } catch (error) {
    console.error('儲存最後結果失敗：', error);
  }
}

// 讀取並還原最後一次計算結果
function loadLastResult() {
  try {
    const data = localStorage.getItem(LAST_RESULT_KEY);
    if (data) {
      const lastResult = JSON.parse(data);

      // 還原到輸入框和結果區
      birthdayInput.value = lastResult.birthday;
      dogAgeEl.textContent = lastResult.dogAge;
      humanAgeEl.textContent = lastResult.humanAge;

      // 顯示結果區
      resultSection.classList.remove('hidden');

      // 更新提示訊息
      if (parseFloat(lastResult.dogAge) < 1) {
        noteEl.textContent = '註：幼犬成長迅速，換算為人類年齡只是估算值。';
      } else {
        noteEl.textContent = '';
      }
    }
  } catch (error) {
    console.error('讀取最後結果失敗：', error);
  }
}

// ========================================
// 歷史面板 UI 渲染
// ========================================

// 格式化時間戳
function formatTimestamp(isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// 渲染歷史記錄列表
function renderHistory() {
  const history = loadHistory();

  if (history.length === 0) {
    historyList.innerHTML = '<p class="empty-message">尚無計算記錄</p>';
    return;
  }

  historyList.innerHTML = history.map(item => `
    <div class="history-item" data-birthday="${item.birthday}" data-dog-age="${item.dogAge}" data-human-age="${item.humanAge}">
      <div class="history-item-date">${formatTimestamp(item.timestamp)}</div>
      <div class="history-item-result">
        狗齡 <strong>${item.dogAge}</strong> 歲 → 人類 <strong>${item.humanAge}</strong> 歲
      </div>
    </div>
  `).join('');

  // 為每個歷史項目綁定點擊事件
  document.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      const birthday = item.dataset.birthday;
      const dogAge = item.dataset.dogAge;
      const humanAge = item.dataset.humanAge;

      // 還原到輸入框和結果區
      birthdayInput.value = birthday;
      dogAgeEl.textContent = dogAge;
      humanAgeEl.textContent = humanAge;

      // 顯示結果區
      resultSection.classList.remove('hidden');

      // 更新提示訊息
      if (parseFloat(dogAge) < 1) {
        noteEl.textContent = '註：幼犬成長迅速，換算為人類年齡只是估算值。';
      } else {
        noteEl.textContent = '';
      }
    });
  });
}

// ========================================
// 計算按鈕事件處理
// ========================================

calcBtn.addEventListener('click', () => {
  const birthday = birthdayInput.value;

  if (!birthday) {
    alert('請先選擇狗狗生日！');
    return;
  }

  // 隱藏結果區，顯示載入動畫
  resultSection.classList.add('hidden');
  loadingSection.classList.remove('hidden');

  // 計算年齡（在背景執行）
  const dogAge = calcDogAgeYears(birthday);
  const humanAge = calcHumanAgeFromDog(dogAge);

  // 延遲 1.5 秒後顯示結果（模擬計算過程）
  setTimeout(() => {
    // 更新結果
    dogAgeEl.textContent = dogAge.toFixed(1);
    humanAgeEl.textContent = humanAge.toFixed(1);

    // 顯示額外說明（幼犬）
    if (dogAge < 1) {
      noteEl.textContent = '註：幼犬成長迅速，換算為人類年齡只是估算值。';
    } else {
      noteEl.textContent = '';
    }

    // 隱藏載入動畫，顯示結果區
    loadingSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    // 儲存到歷史記錄
    addHistoryItem(birthday, dogAge, humanAge);

    // 儲存最後一次計算結果
    saveLastResult(birthday, dogAge, humanAge);
  }, 1500); // 1.5 秒延遲
});

// ========================================
// 歷史面板切換功能
// ========================================

toggleHistoryBtn.addEventListener('click', () => {
  historyPanel.classList.toggle('collapsed');

  // 更新按鈕圖示（眼睛睜開/閉上）
  const icon = toggleHistoryBtn.querySelector('.toggle-icon');
  if (historyPanel.classList.contains('collapsed')) {
    icon.textContent = '👁️‍🗨️'; // 眼睛閉上
  } else {
    icon.textContent = '👁️'; // 眼睛睜開
  }
});

// ========================================
// 清除歷史按鈕
// ========================================

clearHistoryBtn.addEventListener('click', clearAllHistory);

// ========================================
// 參考文獻切換功能
// ========================================

toggleFooterBtn.addEventListener('click', () => {
  footerContent.classList.toggle('collapsed');

  // 更新按鈕文字
  const icon = toggleFooterBtn.querySelector('.toggle-footer-icon');
  if (footerContent.classList.contains('collapsed')) {
    icon.textContent = '👁️ 顯示';
  } else {
    icon.textContent = '👁️ 隱藏';
  }
});

// ========================================
// Hero Section 左右切換按鈕
// ========================================

prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

// ========================================
// 初始化應用
// ========================================

function initApp() {
  // 啟動圖片輪播
  startImageRotation();

  // 渲染歷史記錄
  renderHistory();

  // 還原最後一次計算結果
  loadLastResult();

  console.log('🐶 狗狗歲數計算機已啟動！');
  console.log(`📸 圖片將每 ${ROTATION_INTERVAL / 1000} 秒自動切換`);
}

// DOM 載入完成後執行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
