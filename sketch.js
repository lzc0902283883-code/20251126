let spriteSheet;
let spriteSheet2;
let spriteSheet3;
let animation = [];
let animation2 = [];
let animation3 = [];
let bgMusic;
let amplitude;

const numFrames = 16; // 假設有 16 個影格 (16 * 40px = 640px)
const frameWidth = 40;
const frameHeight = 40;

// 假設 all2.png 寬度為 572px (52px * 11 frames = 572px)
const numFrames2 = 11;
const frameWidth2 = 52; 
const frameHeight2 = 40;

// 假設 all3.png 寬度為 408px (51px * 8 frames = 408px)，高度 39px
const numFrames3 = 8;
const frameWidth3 = 51;
const frameHeight3 = 39;

// 為每個動畫的每一格手動設定 X 軸偏移量，以達成 "原地" 動畫效果
// 您可以微調這些數值以達到最佳效果
const offsets1 = [0, 1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1, 0, 1, 2, 3]; // all1.png (16 frames)
const offsets2 = [0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 0]; // all2.png (11 frames)
const offsets3 = [0, 0, -1, -2, -3, -2, -1, 0]; // all3.png (8 frames)

let currentFrame = 0;

// 在 setup() 之前預先載入圖片
function preload() {
  // 確保圖片路徑正確，此處假設 sketch.js 和 資料夾1 在同一層
  // 修正路徑為中文資料夾名稱
  spriteSheet = loadImage('1/all1.png');
  spriteSheet2 = loadImage('2/all2.png');
  spriteSheet3 = loadImage('3/all3.png');

  // 載入背景音樂，請將路徑換成您的音樂檔案
  bgMusic = loadSound('assets/background_music.mp3');
}

function setup() {
  // 建立一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);

  // 將 sprite sheet 切割成独立的影格
  for (let i = 0; i < numFrames; i++) {
    let x = i * frameWidth;
    let frame = spriteSheet.get(x, 0, frameWidth, frameHeight);
    animation.push(frame);
  }

  // 將 sprite sheet 2 切割成独立的影格
  for (let i = 0; i < numFrames2; i++) {
    let x = i * frameWidth2;
    let frame = spriteSheet2.get(x, 0, frameWidth2, frameHeight2);
    animation2.push(frame);
  }

  // 將 sprite sheet 3 切割成独立的影格
  for (let i = 0; i < numFrames3; i++) {
    let x = i * frameWidth3;
    let frame = spriteSheet3.get(x, 0, frameWidth3, frameHeight3);
    animation3.push(frame);
  }

  // 設定動畫播放速度
  frameRate(60); // 提高繪圖更新率以獲得更靈敏的節拍偵測

  // 建立一個音量分析器
  amplitude = new p5.Amplitude();
}

function draw() {
  // 設定背景顏色
  background('#2a475a');

  // 獲取當前音量 (0 到 1.0)
  let level = amplitude.getLevel();
  
  // 將音量映射到一個影格增量。音量越大，動畫越快
  // 0.3 是一個參考的最大音量，您可以根據音樂調整
  // 1.5 是最大增量，數字越大，最快速度就越快
  let frameIncrement = map(level, 0, 0.3, 0, 1.5);

  // 更新影格計數器
  currentFrame += frameIncrement;

  imageMode(CENTER);

  // 定義動畫的新尺寸和間距
  const displaySize = 100;
  const spacing = 20; // 兩個動畫之間的間距

  // 將中間的動畫(all1)置於中心，然後計算左右兩邊動畫的位置
  const x1_center = width / 2;
  const x3_left = x1_center - displaySize - spacing;
  const x2_right = x1_center + displaySize + spacing;

  // 獲取當前影格的索引
  const frameIndex1 = floor(currentFrame) % numFrames;
  const frameIndex2 = floor(currentFrame) % numFrames2;
  const frameIndex3 = floor(currentFrame) % numFrames3;

  // 繪製三個動畫，並指定新的寬高為 100x100
  // 左邊: all3
  image(animation3[frameIndex3], x3_left + offsets3[frameIndex3], height / 2, displaySize, displaySize);
  // 中間: all1
  image(animation[frameIndex1], x1_center + offsets1[frameIndex1], height / 2, displaySize, displaySize);
  // 右邊: all2
  image(animation2[frameIndex2], x2_right + offsets2[frameIndex2], height / 2, displaySize, displaySize);

  // 如果音樂尚未播放，顯示提示文字
  if (bgMusic && !bgMusic.isPlaying()) {
    fill(255); // 設定文字顏色為白色
    textSize(20);
    textAlign(CENTER, CENTER);
    text('點擊螢幕以播放音樂', width / 2, height / 2 + 100);
  }
}

// 當使用者點擊滑鼠時，開始播放音樂
function mousePressed() {
  // 檢查音樂是否已載入且尚未播放
  if (bgMusic && !bgMusic.isPlaying()) {
    bgMusic.loop(); // 循環播放音樂
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
