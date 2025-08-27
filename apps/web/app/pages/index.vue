<script setup lang="ts">
import { ref, computed } from 'vue'

type Row = {
  id: number
  category: '전체'|'채용'|'입찰'|'모집'|'행사'|'홍보'|'자격'|'교육'|'공지'
  title: string
  date: string // YYYY.MM.DD
  hasFile?: boolean
}

const tabs = ['전체','채용','입찰','모집','행사','홍보','자격','교육'] as const
const activeTab = ref<(typeof tabs)[number]>('전체')

const searchField = ref<'title'|'content'>('title')
const keyword = ref('')

const rows = ref<Row[]>([
  { id: 561517, category: '공지', title: '동영상 테스트', date: '2025.07.28', hasFile: true },
  { id: 561571, category: '자격', title: '링크 테스트', date: '2025.08.07' },
  { id: 561473, category: '채용', title: 'testtest_1', date: '2025.06.23' },
  { id: 561472, category: '홍보', title: 'test_C', date: '2025.06.23' },
  { id: 561471, category: '전체', title: 'test_a', date: '2025.06.23' },
  { id: 561457, category: '전체', title: 'test11', date: '2025.06.19' },
  { id: 561456, category: '전체', title: 'test_test', date: '2025.06.19' },
  { id: 561181, category: '교육', title: '공지사항 - 교육', date: '2025.03.28' },
  { id: 561180, category: '자격', title: '공지사항 - 자격', date: '2025.03.28' },
  { id: 561179, category: '홍보', title: '공지사항 - 홍보', date: '2025.03.28' },
  { id: 561178, category: '행사', title: '공지사항 - 행사', date: '2025.03.28' },
])

const filtered = computed(() => {
  const tabed = activeTab.value === '전체'
      ? rows.value
      : rows.value.filter(r => r.category === activeTab.value)
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return tabed
  // searchField는 현재 UI만 반영. 실제 내용검색은 백엔드 붙일 때 처리.
  return tabed.filter(r => r.title.toLowerCase().includes(kw))
})

const page = ref(1)
const pageSize = 10
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const pageItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})
const goPage = (n: number) => { page.value = Math.min(Math.max(1, n), pageCount.value) }
const onSearch = () => { page.value = 1 }

// footer: TOP 버튼
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <div class="website">
    <!-- 최상단 검은색 헤더 -->
    <header class="top-header">
      <div class="top-header-content">
        <nav class="top-nav">
          <a href="#" class="active">한국사회복지사협회</a>
          <a href="#">자격관리센터</a>
          <a href="#">보수교육센터</a>
          <a href="#">현장실습센터</a>
          <a href="#">영역자격센터</a>
        </nav>
        <div class="top-right">
          <button class="menu-btn">≡</button>
        </div>
      </div>
    </header>

    <!-- 로고 및 메인 네비게이션 -->
    <header class="main-header">
      <div class="main-header-content">
        <div class="logo-section">
          <h1 class="logo">
            <img alt="Power Social Worker" style="display: none;">
            <span class="logo-text">Power Social Worker</span>
          </h1>
        </div>
        <nav class="main-nav">
          <a href="#" class="nav-item active">소통</a>
          <a href="#" class="nav-item">사업</a>
          <a href="#" class="nav-item">정보</a>
          <a href="#" class="nav-item">연구</a>
          <a href="#" class="nav-item">협회</a>
          <a href="#" class="nav-item">나의민원</a>
        </nav>
      </div>
    </header>

    <!-- 메인 콘텐츠 영역 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 탭 -->
        <div class="tabs">
          <button
              v-for="t in tabs"
              :key="t"
              class="tab"
              :class="{ active: activeTab === t }"
              @click="activeTab = t; goPage(1)"
          >
            {{ t }}
          </button>
        </div>

        <!-- 검색 바 -->
        <div class="searchbar">
          <select v-model="searchField" class="select">
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <input
              v-model="keyword"
              type="text"
              placeholder="검색어를 입력하세요."
              class="input"
              @keyup.enter="onSearch"
          />
          <button class="search-btn" @click="onSearch">검색</button>
        </div>

        <!-- 리스트 테이블 -->
        <div class="board">
          <div class="thead">
            <div class="th no">번호</div>
            <div class="th cat">분류</div>
            <div class="th title">제목</div>
            <div class="th date">등록일</div>
            <div class="th file">첨부파일</div>
          </div>

          <div v-if="pageItems.length === 0" class="empty">게시물이 없습니다.</div>

          <div v-for="row in pageItems" :key="row.id" class="trow">
            <div class="td no">{{ row.id }}</div>
            <div class="td cat">
              <span class="chip" :data-type="row.category">{{ row.category }}</span>
            </div>
            <div class="td title">
              <a href="#" class="link">{{ row.title }}</a>
            </div>
            <div class="td date">{{ row.date }}</div>
            <div class="td file">
              <span v-if="row.hasFile" class="file-dot" title="첨부 있음"></span>
            </div>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div class="pager">
          <button class="pg" @click="goPage(1)" :disabled="page===1">«</button>
          <button class="pg" @click="goPage(page-1)" :disabled="page===1">‹</button>
          <button
              v-for="n in pageCount"
              :key="n"
              class="pg"
              :class="{ active: n===page }"
              @click="goPage(n)"
          >{{ n }}</button>
          <button class="pg" @click="goPage(page+1)" :disabled="page===pageCount">›</button>
          <button class="pg" @click="goPage(pageCount)" :disabled="page===pageCount">»</button>
        </div>
      </div>
    </main>

    <!-- ===== Footer ===== -->
    <footer class="site-footer">
      <!-- 상단 링크 / 바로가기 -->
      <div class="footer-topbar">
        <div class="left-links">
          <a href="#">개인정보 처리방침</a>
          <a href="#">찾아오시는길</a>
        </div>
        <div class="right-shortcuts">
          <div class="jump">
            <label class="sr-only">보건복지부</label>
            <select><option>보건복지부</option></select>
            <button class="btn">이동</button>
          </div>
          <div class="jump">
            <label class="sr-only">직능단체</label>
            <select><option>직능단체</option></select>
            <button class="btn">이동</button>
          </div>
        </div>
      </div>

      <!-- 검은색 연락처 바 -->
      <div class="footer-contacts">
        <div class="contact-col">
          <div class="dep">자격</div>
          <div class="tel">TEL 02)786-0845</div>
          <div class="fax">FAX 02)786-6524</div>
        </div>
        <div class="contact-col">
          <div class="dep">교육</div>
          <div class="tel">TEL 02)786-0846</div>
          <div class="fax">FAX 02)786-0191</div>
        </div>
        <div class="contact-col">
          <div class="dep">운영</div>
          <div class="tel">TEL 02)786-0190</div>
          <div class="fax">FAX 02)786-0191</div>
        </div>
        <div class="contact-col">
          <div class="dep">정책</div>
          <div class="tel">TEL 02)786-0190</div>
          <div class="fax">FAX 02)786-0191</div>
        </div>
        <div class="contact-col">
          <div class="dep">연구</div>
          <div class="tel">TEL 02) 786-0248</div>
          <div class="fax">FAX 02)786-0191</div>
        </div>

        <div class="footer-actions">
          <button class="sitemap-btn">사이트맵</button>
          <button class="top-btn" @click="toTop">TOP ︿</button>
        </div>
      </div>

      <!-- 하단 주소/카피라이트 -->
      <div class="footer-bottom">
        <div class="org">
          <div class="org-logo">한국사회복지사협회</div>
          <div class="addr">
            주소 (07295) 서울특별시 영등포구 문래로20길 60 (문래동3가, 메가벤처타워) 4층 401~405호 한국사회복지사협회
          </div>
          <div class="copy">
            Copyright ⓒ KOREA ASSOCIATION OF SOCIAL WORKERS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.website { min-height: 100vh; background-color: #f5f5f5; }

/* 최상단 검은색 헤더 */
.top-header { background-color: #1a1a1a; color: white; padding: 0; }
.top-header-content {
  max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;
}
.top-nav { display: flex; }
.top-nav a {
  color: #ccc; text-decoration: none; padding: 12px 20px; border-right: 1px solid #333; font-size: 14px; transition: all 0.3s;
}
.top-nav a.active, .top-nav a:hover { background-color: #4f46e5; color: white; }
.top-right { display: flex; align-items: center; gap: 10px; }
.menu-btn { background: none; border: none; color: #ccc; font-size: 18px; cursor: pointer; padding: 5px; }

/* 메인 헤더 (로고 + 네비게이션) */
.main-header { background-color: white; border-bottom: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.main-header-content {
  max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 15px 20px;
}
.logo-section .logo { margin: 0; font-size: 18px; font-weight: bold; }
.logo-text {
  color: #1e40af; background: linear-gradient(45deg, #1e40af, #3b82f6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.main-nav { display: flex; gap: 40px; }
.nav-item {
  color: #4b5563; text-decoration: none; font-weight: 500; font-size: 16px; padding: 10px 0; position: relative; transition: color 0.3s;
}
.nav-item.active, .nav-item:hover { color: #1e40af; }
.nav-item.active::after { content: ''; position: absolute; bottom: -15px; left: 0; right: 0; height: 3px; background-color: #1e40af; }

/* 메인 콘텐츠 */
.main-content { padding: 20px 0; }
.content-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* 반응형 */
@media (max-width: 1023px){
  .top-nav { display: none; }
  .main-nav { display: none; }
  .main-header-content { padding: 10px 20px; }
}

/* ------- 게시판 UI ------- */
.tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.tab {
  padding: 10px 18px; border: 1px solid #e5e7eb; background:#fff; border-radius:8px; font-weight:600; color:#4b5563; cursor:pointer; transition: .2s;
}
.tab.active, .tab:hover { border-color:#1e40af; color:#1e40af; }

.searchbar { display:flex; gap:8px; align-items:center; margin-bottom: 18px; }
.select, .input { border:1px solid #e5e7eb; border-radius:8px; padding:10px 12px; background:#fff; outline:none; }
.input { flex:1; }
.search-btn { padding:10px 16px; border:none; border-radius:8px; background:#111827; color:#fff; cursor:pointer; }

.board { border-top:2px solid #111827; background:#fff; border-radius:12px; overflow:hidden; }
.thead, .trow { display:grid; grid-template-columns: 120px 120px 1fr 160px 120px; align-items:center; }
.thead { background:#f9fafb; font-weight:700; color:#374151; border-bottom:1px solid #e5e7eb; }
.th, .td { padding:14px 16px; }
.trow { border-bottom:1px solid #f1f5f9; }
.trow:hover { background:#f9fafb; }
.td.title .link { color:#111827; text-decoration:none; }
.td.title .link:hover { text-decoration:underline; }
.file-dot { font-size: 14px; }

.chip {
  display:inline-block; padding:4px 10px; border-radius:9999px; font-size:12px; font-weight:700; border:1px solid #e5e7eb; color:#374151; background:#fff;
}
.chip[data-type="공지"] { background:#111827; color:#fff; border-color:#111827; }
.chip[data-type="채용"] { border-color:#ef4444; color:#ef4444; }
.chip[data-type="홍보"] { border-color:#06b6d4; color:#06b6d4; }
.chip[data-type="자격"] { border-color:#60a5fa; color:#60a5fa; }
.chip[data-type="교육"] { border-color:#10b981; color:#10b981; }

.pager { display:flex; gap:6px; justify-content:center; align-items:center; padding:16px; }
.pg {
  min-width:36px; height:36px; padding:0 10px; border:1px solid #e5e7eb; background:#fff; border-radius:8px; cursor:pointer;
}
.pg.active { background:#1e40af; color:#fff; border-color:#1e40af; }
.pg:disabled { opacity:.4; cursor:not-allowed; }
@media (max-width: 900px){ .thead, .trow { grid-template-columns: 90px 90px 1fr 120px 80px; } }

/* ===== Footer ===== */
.site-footer { background:#fff; border-top:1px solid #e5e7eb; margin-top:24px; }

/* 상단 링크/바로가기 */
.footer-topbar{
  max-width:1200px; margin:0 auto; padding:10px 20px;
  display:flex; align-items:center; justify-content:space-between; gap:16px;
}
.left-links a{ margin-right:24px; color:#2563eb; font-weight:700; text-decoration:none; }
.left-links a:hover{ text-decoration:underline; }
.right-shortcuts{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.jump select{ border:1px solid #d1d5db; border-radius:6px; padding:8px 10px; background:#fff; }
.jump .btn{ margin-left:6px; background:#111827; color:#fff; border:none; border-radius:6px; padding:8px 12px; cursor:pointer; }

/* 검은색 연락처 바 */
.footer-contacts{
  background:#0a0a0a; color:#fff;
  display:grid; grid-template-columns: repeat(5,1fr) 200px; gap:24px;
  align-items:start; padding:18px 20px; justify-items:start;
}
.footer-contacts .contact-col{ line-height:1.6; }
.footer-contacts .dep{ font-weight:800; margin-bottom:2px; }
.footer-contacts .tel{ font-weight:700; }
.footer-contacts .fax{ color:#d1d5db; font-weight:700; }

.footer-actions{ align-self:center; justify-self:end; display:flex; gap:10px; }
.sitemap-btn{ background:#fff; color:#111827; border:none; border-radius:6px; padding:10px 16px; cursor:pointer; }
.top-btn{ background:transparent; color:#fff; border:none; padding:10px 12px; cursor:pointer; font-weight:800; }

/* 하단 주소/카피라이트 */
.footer-bottom{
  max-width:1200px; margin:0 auto; padding:16px 20px 28px; color:#111827; font-size:14px;
}
.org-logo{ font-weight:900; margin-bottom:8px; }
.addr{ color:#4b5563; margin-bottom:6px; }
.copy{ color:#6b7280; font-size:13px; }

@media (max-width: 1000px){
  .footer-contacts{ grid-template-columns: 1fr 1fr; }
  .footer-actions{ justify-self:start; margin-top:8px; }
}

/* 스크린리더용 */
.sr-only{
  position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;
}
</style>
