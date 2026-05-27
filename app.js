
// ==========================
// 表格生成（完全按你要的字段）
// ==========================
function generateMatchTable(matches) {
  if (!matches || matches.length === 0) {
    return `<table>
      <tr>      
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
        <th>T1-A</th>
        <th>T1-B</th>
        <th>比分</th>
        <th>T2-A</th>
        <th>T2-B</th>

    </tr>
    ${matches.map(m => `
    <tr>
      <td>${m["Team 1 Player A"]}</td>
      <td>${m["Team 1 Player B"]}</td>
    <td>${m["Score T1"]} : ${m["Score T2"]}</td>
      <td>${m["Team 2 Player A"]}</td>
      <td>${m["Team 2 Player B"]}</td>

    </tr>`).join('')}
  </table>`;
}



// ==========================
// 加载 JSON + 自动按 round 分组
// ==========================
async function loadMatches() {
  try {
    const r = await fetch("matches.json");
    const all = await r.json();

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
      <td>${item.Player}</td>
      <td>${item["Total Points (Sorted)"]}</td>
      <td>${item["Net Score"]}</td>
    </tr>`).join('')}
  </table>`;
}




// ==========================
// 页面轮播逻辑（数组 + hide）
// ==========================
const pages = [

    { id: "groupA1", hide: false },
    { id: "groupB1", hide: false },
    { id: "groupA2", hide: false },

    { id: "groupB2", hide: false },
    { id: "groupA3", hide: false },
    { id: "groupB3", hide: false },
    { id: "groupA4", hide: false },
    { id: "groupB4", hide: false },
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

// ==========================
// 启动系统
// ==========================
async function start() {
  await loadMatches();   // 加载赛程
  await loadRanking();   // 加载排名
  showCurrentPage();     // 显示第一页
  setInterval(nextPage, 5000); // 10秒翻页
}

start();


