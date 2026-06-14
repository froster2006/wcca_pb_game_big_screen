
// ==========================
// 表格生成（完全按你要的字段）
// ==========================
let allMatches = []; // Store all matches globally for modal filtering
let showKMatchesInModal = true; // hide/display rows where groupround starts with "K" in the modal

function generateMatchTable(matches) {
  if (!matches || matches.length === 0) {
    return `<table>
      <tr>  
        <th>Court</th>    
        <th>T1-A</th>
        <th>T1-B</th>
        <th>T2-A</th>
        <th>T2-B</th>
      /tr>
      <tr><td colspan="5">暂无比赛</td></tr>
    </table>`;
  }

  return `<table>
    <tr>
        <th>Court</th>
        <th>T1-A</th>
        <th>T1-B</th>
        <th>比分</th>
        <th>T2-A</th>
        <th>T2-B</th>

    </tr>
    ${matches.map(m => `
    <tr>
    <td>${m["Court"]}</td>
      <td><a href="#" onclick="showPlayerGames('${m["Team 1 Player A"].replace(/'/g, "\\'")}'); return false;" style="cursor: pointer; color: #fff; text-decoration: underline;">${m["Team 1 Player A"]}</a></td>
      <td><a href="#" onclick="showPlayerGames('${m["Team 1 Player B"].replace(/'/g, "\\'")}'); return false;" style="cursor: pointer; color: #fff; text-decoration: underline;">${m["Team 1 Player B"]}</a></td>
    <td>${m["Score T1"]}:${m["Score T2"]}</td>
      <td><a href="#" onclick="showPlayerGames('${m["Team 2 Player A"].replace(/'/g, "\\'")}'); return false;" style="cursor: pointer; color: #fff; text-decoration: underline;">${m["Team 2 Player A"]}</a></td>
      <td><a href="#" onclick="showPlayerGames('${m["Team 2 Player B"].replace(/'/g, "\\'")}'); return false;" style="cursor: pointer; color: #fff; text-decoration: underline;">${m["Team 2 Player B"]}</a></td>

    </tr>`).join('')}
  </table>`;
}

// ==========================
// Show player games in modal
// ==========================
function showPlayerGames(playerName) {
  const playerMatches = allMatches.filter(m => {
    if (!showKMatchesInModal && m.groupround && m.groupround.startsWith('K')) {
      return false;
    }
    return m["Team 1 Player A"] === playerName ||
      m["Team 1 Player B"] === playerName ||
      m["Team 2 Player A"] === playerName ||
      m["Team 2 Player B"] === playerName;
  });

  const groupedMatches = playerMatches.reduce((groups, match) => {
    let round = match.groupround || 'Unknown';
    if (/^A[1-4]$/.test(round)) {
      round = 'A组循环赛';
    } else if (/^B[1-4]$/.test(round)) {
      round = 'B组循环赛';
    }
    if (!groups[round]) {
      groups[round] = [];
    }
    groups[round].push(match);
    return groups;
  }, {});

  const roundOrder = playerMatches
    .map(m => {
      let round = m.groupround || 'Unknown';
      if (/^A[1-4]$/.test(round)) {
        return 'A组循环赛';
      }
      if (/^B[1-4]$/.test(round)) {
        return 'B组循环赛';
      }
      return round;
    })
    .filter((value, index, self) => self.indexOf(value) === index);

  const roundDisplayMap = {
    'A组循环赛': 'A组循环赛',
    KOA_8: 'A组淘汰赛第一轮',
    KOA_4: 'A组淘汰赛第二轮',
    KOA_2: 'A组半决赛',
    KOA_Bronz: 'A组三四名比赛',
    KOA_Gold: 'A组决赛',

    'B组循环赛': 'B组循环赛',
    KOB_8: 'B组淘汰赛第一轮',
    KOB_4: 'B组淘汰赛第二轮',
    KOB_2: 'B组半决赛',
    KOB_Bronz: 'B组三四名比赛',
    KOB_Gold: 'B组决赛'
  };

  const renderTableForRound = (round, matches) => {
    const displayRound = roundDisplayMap[round] || round;
    return `
    <div style="margin-bottom: 32px;">
      <h3 style="font-size: 32px; margin: 0 0 18px; color: #fff; letter-spacing: 0.02em;">${displayRound}</h3>
      <table style="width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 8px;">
        <tr>
          <th style="font-size: 34px; padding: 14px 8px; background: linear-gradient(90deg, #FF3C6C, #FF5E57); color: #fff; font-weight: bold; border-radius: 8px;">Court</th>
          <th style="font-size: 34px; padding: 14px 8px; background: linear-gradient(90deg, #FF3C6C, #FF5E57); color: #fff; font-weight: bold; border-radius: 8px;">T1-A</th>
          <th style="font-size: 34px; padding: 14px 8px; background: linear-gradient(90deg, #FF3C6C, #FF5E57); color: #fff; font-weight: bold; border-radius: 8px;">T1-B</th>
          <th style="font-size: 34px; padding: 14px 8px; background: linear-gradient(90deg, #FF3C6C, #FF5E57); color: #fff; font-weight: bold; border-radius: 8px;">比分</th>
          <th style="font-size: 34px; padding: 14px 8px; background: linear-gradient(90deg, #FF3C6C, #FF5E57); color: #fff; font-weight: bold; border-radius: 8px;">T2-A</th>
          <th style="font-size: 34px; padding: 14px 8px; background: linear-gradient(90deg, #FF3C6C, #FF5E57); color: #fff; font-weight: bold; border-radius: 8px;">T2-B</th>
        </tr>
        ${matches.map((m, idx) => `
        <tr style="background: ${idx % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 60, 108, 0.05)'};">
          <td style="font-size: 34px; padding: 12px 8px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #fff;">${m["Court"]}</td>
          <td style="font-size: 34px; padding: 12px 8px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: ${m["Team 1 Player A"] === playerName ? '#00FF41' : '#fff'}; font-weight: ${m["Team 1 Player A"] === playerName ? 'bold' : 'normal'};">${m["Team 1 Player A"]}</td>
          <td style="font-size: 34px; padding: 12px 8px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: ${m["Team 1 Player B"] === playerName ? '#00FF41' : '#fff'}; font-weight: ${m["Team 1 Player B"] === playerName ? 'bold' : 'normal'};">${m["Team 1 Player B"]}</td>
          <td style="font-size: 34px; padding: 12px 8px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #FFD700; font-weight: bold;">${m["Score T1"]}:${m["Score T2"]}</td>
          <td style="font-size: 34px; padding: 12px 8px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: ${m["Team 2 Player A"] === playerName ? '#00FF41' : '#fff'}; font-weight: ${m["Team 2 Player A"] === playerName ? 'bold' : 'normal'};">${m["Team 2 Player A"]}</td>
          <td style="font-size: 34px; padding: 12px 8px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: ${m["Team 2 Player B"] === playerName ? '#00FF41' : '#fff'}; font-weight: ${m["Team 2 Player B"] === playerName ? 'bold' : 'normal'};">${m["Team 2 Player B"]}</td>
        </tr>`).join('')}
      </table>
    </div>`;
  };

  const contentSections = roundOrder.map(round => renderTableForRound(round, groupedMatches[round]));

  const modalContent = `
    <h2 style="font-size: 34px; margin-bottom: 20px; color: #fff;"><span style="color: #00FF41; font-weight: bold;">${playerName}</span> - All Games</h2>
    ${playerMatches.length === 0 ? '<p style="color: #fff; font-size: 34px;">No games found for this player.</p>' : contentSections.join('')}
  `;

  document.getElementById('playerModalContent').innerHTML = modalContent;
  document.getElementById('playerModal').style.display = 'block';
}

// Close modal
function closePlayerModal() {
  document.getElementById('playerModal').style.display = 'none';
}



// ==========================
// 加载 JSON + 自动按 round 分组
// ==========================
async function loadMatches() {
  try {
    const r = await fetch("matches.json");
    const all = await r.json();
    allMatches = all; // Store for modal filtering

    // 自动分组：A1、A2、A3、A4、B1、B2、B3、B4
    const A1 = all.filter(x => x.groupround === "A1");
    const A2 = all.filter(x => x.groupround === "A2");
    const A3 = all.filter(x => x.groupround === "A3");
    const A4 = all.filter(x => x.groupround === "A4");

    const B1 = all.filter(x => x.groupround === "B1");
    const B2 = all.filter(x => x.groupround === "B2");
    const B3 = all.filter(x => x.groupround === "B3");
    const B4 = all.filter(x => x.groupround === "B4");

    const KOA_8 = all.filter(x => x.groupround === "KOA_8");
    const KOA_4 = all.filter(x => x.groupround === "KOA_4");
    const KOA_2 = all.filter(x => x.groupround === "KOA_2");
    const KOA_Bronz = all.filter(x => x.groupround === "KOA_Bronz");
    const KOA_Gold = all.filter(x => x.groupround === "KOA_Gold");

    const KOB_8 = all.filter(x => x.groupround === "KOB_8");
    const KOB_4 = all.filter(x => x.groupround === "KOB_4");
    const KOB_2 = all.filter(x => x.groupround === "KOB_2");
    const KOB_Bronz = all.filter(x => x.groupround === "KOB_Bronz");
    const KOB_Gold = all.filter(x => x.groupround === "KOB_Gold");



    // 所有轮次
     document.getElementById("groupARound1").innerHTML = generateMatchTable(A1);
    document.getElementById("groupARound2").innerHTML = generateMatchTable(A2);
    document.getElementById("groupARound3").innerHTML = generateMatchTable(A3);
    document.getElementById("groupARound4").innerHTML = generateMatchTable(A4);
    document.getElementById("groupBRound1").innerHTML = generateMatchTable(B1);
    document.getElementById("groupBRound2").innerHTML = generateMatchTable(B2);
    document.getElementById("groupBRound3").innerHTML = generateMatchTable(B3);
    document.getElementById("groupBRound4").innerHTML = generateMatchTable(B4);

    document.getElementById("KOA_8").innerHTML = generateMatchTable(KOA_8);
    document.getElementById("KOA_4").innerHTML = generateMatchTable(KOA_4);
    document.getElementById("KOA_2").innerHTML = generateMatchTable(KOA_2);
    document.getElementById("KOA_Bronz").innerHTML = generateMatchTable(KOA_Bronz);
    document.getElementById("KOA_Gold").innerHTML = generateMatchTable(KOA_Gold);

    document.getElementById("KOB_8").innerHTML = generateMatchTable(KOB_8);
    document.getElementById("KOB_4").innerHTML = generateMatchTable(KOB_4);
    document.getElementById("KOB_2").innerHTML = generateMatchTable(KOB_2);
    document.getElementById("KOB_Bronz").innerHTML = generateMatchTable(KOB_Bronz);
    document.getElementById("KOB_Gold").innerHTML = generateMatchTable(KOB_Gold);

  } catch (err) {
    console.error("加载 JSON 失败", err);
  }
}

// ==========================
// ✅ 排名：自动拆 1-36 to 3 tables
// ==========================
async function loadRanking() {
    const res = await fetch("ranking.json");
    const data = await res.json();

    const A = data.filter(x => x.group === "A");
    const B = data.filter(x => x.group === "B");

    const A1 = A.slice(0, 12);   
    const A2 = A.slice(12, 24); 
    const A3 = A.slice(24, 36); 
    const B1 = B.slice(0, 12);
    const B2 = B.slice(12, 24);
    const B3 = B.slice(24, 36);

    document.getElementById("groupATotal1").innerHTML = genRanks(A1);
    document.getElementById("groupATotal2").innerHTML = genRanks(A2);
    document.getElementById("groupATotal3").innerHTML = genRanks(A3);
    document.getElementById("groupBTotal1").innerHTML = genRanks(B1);
    document.getElementById("groupBTotal2").innerHTML = genRanks(B2);
    document.getElementById("groupBTotal3").innerHTML = genRanks(B3);
}

function genRanks(list) {
  return `<table>
    <tr><th>排名</th><th>选手</th><th>Total</th><th>Net</th></tr>
    ${list.map(item => `
    <tr>
      <td>${item.ranking}</td>
      <td><a href="#" onclick="showPlayerGames('${item.Player.replace(/'/g, "\\'")}'); return false;" style="cursor: pointer; color: #fff; text-decoration: underline;">${item.Player}</a></td>
      <td>${item["Total Points (Sorted)"]}</td>
      <td>${item["Net Score"]}</td>
    </tr>`).join('')}
  </table>`;
}




// ==========================
// 页面轮播逻辑（数组 + hide）
// ==========================
const pages = [

    { id: "groupA1", hide: true },
    { id: "groupB1", hide: true },
    { id: "groupA2", hide: true },

    { id: "groupB2", hide: true },
    { id: "groupA3", hide: true },
    { id: "groupB3", hide: true },
    { id: "groupA4", hide: true },
    { id: "groupB4", hide: true },
    { id: "groupA_ranking_top", hide: false },
    { id: "groupA_ranking_middle", hide: false },
    { id: "groupA_ranking_bottom", hide: false },
    { id: "groupB_ranking_top", hide: false },
    { id: "groupB_ranking_middle", hide: false },
    { id: "groupB_ranking_bottom", hide: false },
    { id: "KOA_8_page", hide: false },
    { id: "KOB_8_page", hide: false },
    { id: "KOA_4_page", hide: false },
    { id: "KOA_2_page", hide: false },
    { id: "KOA_Bronz_page", hide: false },
    { id: "KOA_Gold_page", hide: false }


];

const visiblePages = pages.filter(p => !p.hide);
let currentIndex = 0;

function showCurrentPage() {
  document.querySelectorAll('.page').forEach(el => el.style.display = 'none');
  const page = document.getElementById(visiblePages[currentIndex].id);
  if (page) page.style.display = 'block';
}

function nextPage() {
  currentIndex = (currentIndex + 1) % visiblePages.length;
  showCurrentPage();
}


// 手动翻页按钮
document.getElementById('nextBtn').onclick = nextPage;
document.getElementById('prevBtn').onclick = () => {
  currentIndex = (currentIndex - 1 + visiblePages.length) % visiblePages.length;
  showCurrentPage();
};


// 键盘左右方向键翻页
document.addEventListener('keydown', function(e) {
  // 左箭头 ← 上一页
  if (e.key === 'ArrowLeft') {
    prevPage();
  }
  // 右箭头 → 下一页
  if (e.key === 'ArrowRight') {
    nextPage();
  }
});

// ==========================
// 启动系统
// ==========================
async function start() {
  await loadMatches();   // 加载赛程
  await loadRanking();   // 加载排名
  showCurrentPage();     // 显示第一页
  //setInterval(nextPage, 5000); // 10秒翻页
}

start();
