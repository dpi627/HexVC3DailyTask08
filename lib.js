const btn = document.getElementById('calcBtn');

btn.addEventListener('click', () => {
  const birthday = document.getElementById('birthday').value;
  if (!birthday) {
    alert('請先選擇狗狗生日！');
    return;
  }

  const dogAge = calcDogAgeYears(birthday);
  const humanAge = calcHumanAgeFromDog(dogAge); // **MODIFIED**

  document.getElementById('dogAge').textContent = dogAge.toFixed(1);
  document.getElementById('humanAge').textContent = humanAge.toFixed(1);

  // 顯示額外說明（幼犬或邊界）
  const noteEl = document.getElementById('note');
  if (dogAge < 1) {
    noteEl.textContent = '註：幼犬成長迅速，換算為人類年齡只是估算值。';
  } else {
    noteEl.textContent = '';
  }

  document.getElementById('result').classList.remove('hidden');
});

// 計算狗狗實際年齡（年，採 365.25 考量閏年）
function calcDogAgeYears(birthISODate) {
  const birth = new Date(birthISODate);
  const today = new Date();
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const years = Math.max(0, (today - birth) / msPerYear);
  return years;
}

// **MODIFIED**
// 正確使用 Cell Systems (Wang et al.) 提供的換算公式：
// HumanAge = 16 * ln(DogAge) + 31
// 注意：ln 為自然對數，dogAge 必須 > 0 才能計算。
// 這個公式為「狗齡 → 人類年齡」，和先前錯誤的反算（指數）不同。
function calcHumanAgeFromDog(dogAge) {
  if (dogAge <= 0) return 0;

  // 對非常小的狗齡（例如剛出生幾天）做下界處理，避免 ln(極小數) 導致極端負值
  const safeDogAge = Math.max(dogAge, 0.05); // 0.05 年 ≈ 18 天
  const humanAge = 16 * Math.log(safeDogAge) + 31;

  // 若 humanAge 出現極端負值（理論上不會），則以 0 做保護
  return Math.max(0, humanAge);
}
