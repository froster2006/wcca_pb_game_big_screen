// 计分数据 初始0:0:2
let serveScore = 0;
let oppScore = 0;
let serveRound = 2;

// 倒计时数据 初始15分钟
let totalSeconds = 15 * 60;
let timerInterval = null;

// DOM元素
const serveDom = document.querySelector('#serveScore .score-num');
const oppDom = document.querySelector('#oppScore .score-num');
const roundDom = document.querySelector('#serveRound .score-num');
const timeText = document.getElementById('timeText');
const startTimerBtn = document.getElementById('startTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const openModalBtn = document.getElementById('openModalBtn');
const endMatchBtn = document.getElementById('endMatchBtn');

// 比分设置弹窗
const scoreModal = document.getElementById('scoreModal');
const inputServe = document.getElementById('inputServe');
const inputOpp = document.getElementById('inputOpp');
const inputRound = document.getElementById('inputRound');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');

// 比赛结束弹窗
const endModal = document.getElementById('endModal');
const endInfoText = document.getElementById('endInfoText');
const endCancel = document.getElementById('endCancel');
const endConfirm = document.getElementById('endConfirm');

// 渲染比分
function renderScore() {
    serveDom.textContent = serveScore;
    oppDom.textContent = oppScore;
    roundDom.textContent = serveRound;
}

// 渲染倒计时
function renderTime() {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    timeText.textContent = `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

// 倒计时逻辑
startTimerBtn.addEventListener('click', () => {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        totalSeconds--;
        renderTime();
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("比赛计时已结束！");
        }
    }, 1000);
});

resetTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = 15 * 60;
    renderTime();
});

// 1. 发球方加分
document.getElementById('serveScore').addEventListener('click', () => {
    serveScore++;
    renderScore();
});

// 2. 切换发球轮次：如果当前为2，则交换比分；如果当前为1，则只切换为2
document.getElementById('serveRound').addEventListener('click', () => {
    if (serveRound === 2) {
        [serveScore, oppScore] = [oppScore, serveScore];
        serveRound = 1;
    } else {
        serveRound = 2;
    }
    renderScore();
});

// 打开手动设置比分弹窗
openModalBtn.addEventListener('click', () => {
    inputServe.value = serveScore;
    inputOpp.value = oppScore;
    inputRound.value = serveRound;
    scoreModal.style.display = 'flex';
});

// 比分弹窗取消
modalCancel.addEventListener('click', () => {
    scoreModal.style.display = 'none';
});

// 比分弹窗确认更新
modalConfirm.addEventListener('click', () => {
    const s = parseInt(inputServe.value) || 0;
    const o = parseInt(inputOpp.value) || 0;
    let r = parseInt(inputRound.value);
    if(r !== 1 && r !==2) r = 2;

    serveScore = s;
    oppScore = o;
    serveRound = r;
    renderScore();
    scoreModal.style.display = 'none';
});

// 打开比赛结束弹窗
endMatchBtn.addEventListener('click', () => {
    const ta1 = document.getElementById('teamA1').value || "A选手1";
    const ta2 = document.getElementById('teamA2').value || "A选手2";
    const tb1 = document.getElementById('teamB1').value || "B选手1";
    const tb2 = document.getElementById('teamB2').value || "B选手2";
    const round = document.getElementById('roundName').value || "未填写场次";
    const court = document.getElementById('courtNum').value || "未知场地";

    const infoHtml = `
场次：${round}<br>
场地：${court}<br>
A队：${ta1} / ${ta2}<br>
B队：${tb1} / ${tb2}<br><br>
发球方得分：${serveScore}<br>
对方得分：${oppScore}<br>
发球轮次：${serveRound}
            `;
    endInfoText.innerHTML = infoHtml;
    endModal.style.display = 'flex';
});

// 结束弹窗取消
endCancel.addEventListener('click', () => {
    endModal.style.display = 'none';
});

// 结束弹窗确认提交
endConfirm.addEventListener('click', () => {
    endModal.style.display = 'none';
    alert("本场比分已确认完成！");
});

// 初始化渲染
renderScore();
renderTime();
