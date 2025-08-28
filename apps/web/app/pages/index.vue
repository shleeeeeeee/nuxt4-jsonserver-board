<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { apiService, type Post } from '@/services/api'

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

// 하드코딩된 데이터 완전 제거 - 빈 배열로 시작
const rows = ref<Row[]>([])
const loading = ref(false)
const total = ref(0)

const page = ref(1)
const pageSize = 10
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

// 게시글 목록 조회
const fetchPosts = async () => {
  console.log('=== fetchPosts 시작 ===')
  console.log('fetchPosts 호출됨:', { page: page.value, category: activeTab.value, keyword: keyword.value })
  loading.value = true
  
  try {
    const response = await apiService.getPosts(
      page.value, 
      pageSize, 
      activeTab.value === '전체' ? undefined : activeTab.value,
      keyword.value.trim() || undefined
    )
    
    console.log('=== API 응답 ===')
    console.log('API 응답:', response)
    
    // 기존 데이터 완전 초기화
    rows.value = []
    console.log('rows 초기화 후:', rows.value)
    
    // API 응답을 Row 형태로 변환
    rows.value = response.posts.map((post: Post) => ({
      id: post.id || 0,
      category: (post.category as any) || '전체',
      title: post.title,
      date: post.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '.').replace(/\.$/, '') : '',
      hasFile: post.hasFile || false
    }))
    
    total.value = response.total
    
    console.log('=== 데이터 변환 완료 ===')
    console.log('변환된 rows:', rows.value)
    console.log('현재 rows 값:', rows.value)
    console.log('rows 길이:', rows.value.length)
    
    // 추가 디버깅 정보
    console.log('rows 타입:', typeof rows.value)
    console.log('rows 배열 여부:', Array.isArray(rows.value))
    console.log('첫 번째 게시글:', rows.value[0])
    console.log('rows 반응성 확인:', rows.value)
    
    // 하드코딩된 데이터 확인
    console.log('=== 하드코딩된 데이터 확인 ===')
    console.log('rows 내용 상세:', JSON.stringify(rows.value, null, 2))
    console.log('모든 게시글 ID:', rows.value.map(r => r.id))
    console.log('중복 ID 확인:', rows.value.map(r => r.id).filter((id, index, arr) => arr.indexOf(id) !== index))
    
    // DOM 렌더링 확인을 위한 지연 실행
    setTimeout(() => {
      console.log('=== DOM 렌더링 확인 ===')
      console.log('DOM에서 게시글 요소 찾기:', document.querySelectorAll('.trow').length)
      console.log('게시글 요소들:', document.querySelectorAll('.trow'))
      console.log('loading 상태:', loading.value)
      console.log('rows 길이 (지연 확인):', rows.value.length)
      
      // DOM에 표시된 실제 텍스트 확인
      const titleElements = document.querySelectorAll('.trow .td.title .link')
      console.log('DOM에 표시된 제목들:', Array.from(titleElements).map(el => el.textContent))
    }, 100)
    
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error)
    rows.value = []
    total.value = 0
  } finally {
    loading.value = false
    console.log('=== fetchPosts 완료 ===')
  }
}

// 게시글 목록 새로고침 (페이지 1로 리셋)
const refreshPosts = () => {
  console.log('refreshPosts 호출됨')
  page.value = 1
  fetchPosts()
}

const goPage = (n: number) => { 
  page.value = Math.min(Math.max(1, n), pageCount.value)
  fetchPosts()
}

const onSearch = () => { 
  page.value = 1
  fetchPosts()
}

const onTabChange = () => {
  page.value = 1
  fetchPosts()
}

// footer: TOP 버튼
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

// 페이지 포커스 시 새로고침
const handleFocus = () => {
  console.log('페이지 포커스됨')
  refreshPosts()
}

onMounted(() => {
  console.log('=== onMounted 시작 ===')
  console.log('onMounted 호출됨')
  console.log('초기 rows 값:', rows.value)
  console.log('초기 rows 길이:', rows.value.length)
  
  fetchPosts()
  
  // 페이지 포커스 시 새로고침
  window.addEventListener('focus', handleFocus)
})

onUnmounted(() => {
  window.removeEventListener('focus', handleFocus)
})
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
              @click="activeTab = t; onTabChange()"
          >
            {{ t }}
          </button>
        </div>

        <!-- 검색 바 및 작성 버튼 -->
        <div class="searchbar">
          <div class="search-left">
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
          <div class="search-right">
            <NuxtLink to="/post/create" class="create-btn">게시글 작성</NuxtLink>
          </div>
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

          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            게시물을 불러오는 중입니다...
          </div>
          <div v-else-if="rows.length === 0" class="empty">게시물이 없습니다.</div>

          <div v-for="row in rows" :key="row.id" class="trow">
            <div class="td no">{{ row.id }}</div>
            <div class="td cat">
              <span class="chip" :data-type="row.category">{{ row.category }}</span>
            </div>
            <div class="td title">
              <NuxtLink :to="`/post/${row.id}`" class="link">{{ row.title }}</NuxtLink>
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

.searchbar { 
  display:flex; 
  justify-content:space-between; 
  align-items:center; 
  margin-bottom: 18px; 
  gap: 16px;
}
.search-left { display:flex; gap:8px; align-items:center; }
.search-right { display:flex; align-items:center; }
.select, .input { border:1px solid #e5e7eb; border-radius:8px; padding:10px 12px; background:#fff; outline:none; }
.input { flex:1; }
.search-btn { padding:10px 16px; border:none; border-radius:8px; background:#111827; color:#fff; cursor:pointer; }
.create-btn { 
  padding:10px 20px; 
  border:none; 
  border-radius:8px; 
  background:#1e40af; 
  color:#fff; 
  cursor:pointer; 
  text-decoration:none; 
  font-weight:600;
  transition: background-color 0.2s;
}
.create-btn:hover { background:#1d4ed8; }

.board { border-top:1px #111827; background:#fff; border-radius:12px; overflow:hidden; }
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

.empty { color:#6b7280; text-align:center; padding:60px 20px; }
.loading { text-align:center; padding:60px 20px; }
.loading-spinner {
  width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #1e40af; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

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
