// 计分数据 初始0:0:2
let team1Score = 0;
let team2Score = 0;
let serveRound = 2;
let serveTeam = 1; // 1代表A队发球，2代表B队发球

// 倒计时数据 初始15分钟
let totalSeconds = 15 * 60;
let timerInterval = null;
let gameStarted = false;

// DOM元素
const serveDom = document.querySelector('#serveScore .score-num');
const oppDom = document.querySelector('#oppScore .score-num');
const roundDom = document.querySelector('#serveRound .score-num');
const timeText = document.getElementById('timeText');
const startTimerBtn = document.getElementById('startTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const openModalBtn = document.getElementById('openModalBtn');
const endMatchBtn = document.getElementById('endMatchBtn');
const startGameModal = document.getElementById('startGameModal');
const startGameCancel = document.getElementById('startGameCancel');
const startGameConfirm = document.getElementById('startGameConfirm');
const teamAStart = document.getElementById('teamAStart');
const teamBStart = document.getElementById('teamBStart');
const teamAModalName = document.getElementById('teamAModalName');
const teamBModalName = document.getElementById('teamBModalName');
const teamAScoreDisplay = document.getElementById('teamAScoreDisplay');
const teamBScoreDisplay = document.getElementById('teamBScoreDisplay');

// 比分设置弹窗
const scoreModal = document.getElementById('scoreModal');
const inputServe = document.getElementById('inputServe');
const inputOpp = document.getElementById('inputOpp');
const inputRound = document.getElementById('inputRound');
const manualTeamA = document.getElementById('manualTeamA');
const manualTeamB = document.getElementById('manualTeamB');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');

// 比赛结束弹窗
const endModal = document.getElementById('endModal');
const endInfoText = document.getElementById('endInfoText');
const endCancel = document.getElementById('endCancel');
const endConfirm = document.getElementById('endConfirm');

// 渲染比分
function renderScore() {
    if (teamAScoreDisplay) teamAScoreDisplay.textContent = team1Score;
    if (teamBScoreDisplay) teamBScoreDisplay.textContent = team2Score;

    if (serveTeam === 1) {
        serveDom.textContent = team1Score;
        oppDom.textContent = team2Score;
    } else {
        serveDom.textContent = team2Score;
        oppDom.textContent = team1Score;
    }
    roundDom.textContent = serveRound;
    renderServeIndicator();
}

// 渲染倒计时
function renderTime() {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    timeText.textContent = `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

// 倒计时逻辑
startTimerBtn.addEventListener('click', () => {
    if (gameStarted) return;
    openStartGameModal();
});

resetTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    totalSeconds = 15 * 60;
    renderTime();
});

manualTeamA.addEventListener('click', () => {
    manualTeamA.classList.add('active');
    manualTeamB.classList.remove('active');
    serveTeam = 1;
});

manualTeamB.addEventListener('click', () => {
    manualTeamB.classList.add('active');
    manualTeamA.classList.remove('active');
    serveTeam = 2;
});

function syncManualServeButtons() {
    if (serveTeam === 1) {
        manualTeamA.classList.add('active');
        manualTeamB.classList.remove('active');
    } else {
        manualTeamA.classList.remove('active');
        manualTeamB.classList.add('active');
    }
}

function beginGame() {
    if (gameStarted) return;
    gameStarted = true;
    enableScoreInteraction();
    renderServeIndicator();
    startTimerBtn.disabled = true;
    startTimerBtn.textContent = '比赛进行中';
    startTimerBtn.style.cursor = 'default';
    timerInterval = setInterval(() => {
        totalSeconds--;
        renderTime();
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("比赛计时已结束！");
        }
    }, 1000);
}

function openStartGameModal() {
    if (teamAModalName) teamAModalName.textContent = document.getElementById('teamADisplay').textContent;
    if (teamBModalName) teamBModalName.textContent = document.getElementById('teamBDisplay').textContent;
    serveRound = 2;
    teamAStart.classList.add('active');
    teamBStart.classList.remove('active');
    startGameModal.style.display = 'flex';
    renderScore();
    syncManualServeButtons();
}

function closeStartGameModal() {
    startGameModal.style.display = 'none';
}

function enableScoreInteraction() {
    document.getElementById('serveScore').classList.remove('locked');
    document.getElementById('oppScore').classList.remove('locked');
    document.getElementById('serveRound').classList.remove('locked');
}

function disableScoreInteraction() {
    document.getElementById('serveScore').classList.add('locked');
    document.getElementById('oppScore').classList.add('locked');
    document.getElementById('serveRound').classList.add('locked');
}


// 1. 发球方加分
document.getElementById('serveScore').addEventListener('click', () => {
    if (!gameStarted) return;
    if (serveTeam === 1) {
        team1Score++;
    } else {
        team2Score++;
    }
    renderScore();
});

// 2. 切换发球轮次：如果当前为2，则切换为1，否则切换为2
document.getElementById('serveRound').addEventListener('click', () => {
    if (!gameStarted) return;
    if(serveRound === 2){
        serveTeam = serveTeam === 1 ? 2 : 1; // 切换发球方
        serveRound = 1;
    }else{
        serveRound = 2;
    }
    renderScore();
    renderServeIndicator();
});

const teamAIndicator = document.getElementById('teamAIndicator');
const teamBIndicator = document.getElementById('teamBIndicator');

function renderServeIndicator() {
    if (teamAIndicator && teamBIndicator) {
        teamAIndicator.classList.toggle('active', serveTeam === 1);
        teamBIndicator.classList.toggle('active', serveTeam === 2);
    }
}

// 开始比赛选择
teamAStart.addEventListener('click', () => {
    teamAStart.classList.add('active');
    teamBStart.classList.remove('active');
    serveTeam = 1;
});

teamBStart.addEventListener('click', () => {
    teamBStart.classList.add('active');
    teamAStart.classList.remove('active');
    serveTeam = 2;
});

startGameConfirm.addEventListener('click', () => {
    closeStartGameModal();
    renderScore();
    beginGame();
});

startGameCancel.addEventListener('click', () => {
    closeStartGameModal();
});

// 打开手动设置比分弹窗
openModalBtn.addEventListener('click', () => {
    inputTeamA.value = team1Score;
    inputTeamB.value = team2Score;
    inputServeRound.value = serveRound;
    if (serveTeam === 1) {
        manualTeamA.classList.add('active');
        manualTeamB.classList.remove('active');
    } else {
        manualTeamA.classList.remove('active');
        manualTeamB.classList.add('active');
    }
    scoreModal.style.display = 'flex';
});

// 比分弹窗取消
modalCancel.addEventListener('click', () => {
    scoreModal.style.display = 'none';
});

// 比分弹窗确认更新
modalConfirm.addEventListener('click', () => {
    const s = parseInt(inputTeamA.value) || 0;
    const o = parseInt(inputTeamB.value) || 0;
    const r = parseInt(inputServeRound.value) || 1;
    const selectedServeTeam = manualTeamA.classList.contains('active') ? 1 : 2;

    serveRound = r;
    serveTeam = selectedServeTeam;
    team1Score = s;
    team2Score = o;

    scoreModal.style.display = 'none';
    clearInterval(timerInterval);
    timerInterval = null;
    renderScore();
});

// 打开比赛结束弹窗
endMatchBtn.addEventListener('click', () => {
    const teamA = document.getElementById('teamADisplay').textContent || "队伍A";
    const teamB = document.getElementById('teamBDisplay').textContent || "队伍B";
    const round = document.getElementById('roundName').value || "未填写场次";
    const court = document.getElementById('courtNum').value || "未知场地";

    const infoHtml = `
场次：${round}<br>
场地：${court}<br>
A队：${teamA}<br>
B队：${teamB}<br><br>
A队得分：${team1Score}<br>
B队得分：${team2Score}<br>
发球方：${serveTeam === 1 ? 'A队' : 'B队'}
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

// 折叠面板切换 - 比赛信息
const matchInfoToggle = document.getElementById('match-info-toggle');
const matchInfoPane = matchInfoToggle.closest('.folding-pane');

if (matchInfoToggle) {
    matchInfoToggle.addEventListener('click', () => {
        matchInfoPane.classList.toggle('collapsed');
    });
}

// 初始化渲染
disableScoreInteraction();
renderScore();
renderTime();
renderServeIndicator();
