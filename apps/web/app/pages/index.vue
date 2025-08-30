<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Post } from '~/services/api'

const router = useRouter()
const route = useRoute()
const { fetchPosts, fetchCategories } = useApi()

// 상태 관리
const posts = ref<Post[]>([])
const loading = ref(true)
const error = ref('')
const categories = ref<string[]>(['전체'])

// 로그인
const isLoggedIn = ref(false)
const userNickname = ref('')

// 필터 및 검색 상태
const activeTab = ref('전체')
const searchField = ref<'title' | 'content' | 'author'>('title')
const keyword = ref('')

// 페이지네이션 상태
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const pageSize = 10

// 데이터 조회
const loadPosts = async () => {
  try {
    loading.value = true
    error.value = ''

    const params = {
      page: currentPage.value,
      limit: pageSize,
      category: activeTab.value !== '전체' ? activeTab.value : undefined,
      search: keyword.value.trim() || undefined,
      searchField: searchField.value
    }

    const response = await fetchPosts(params)

    posts.value = response.data
    totalPages.value = response.pagination.totalPages
    totalItems.value = response.pagination.total
  } catch (err) {
    console.error('게시글 로딩 오류:', err)
    error.value = '게시글을 불러오는 중 오류가 발생했습니다.'
    posts.value = []
  } finally {
    loading.value = false
  }
}

// 로그인 함수
const checkLoginStatus = () => {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const nickname = localStorage.getItem('nickname') || ''

  isLoggedIn.value = loggedIn
  userNickname.value = nickname
}

const handleLogout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('nickname')
    localStorage.removeItem('isLoggedIn')

    isLoggedIn.value = false
    userNickname.value = ''

    alert('로그아웃 되었습니다.')
    window.location.reload()
  }
}

const goToLogin = () => {
  router.push('/login')  // 또는 navigateTo('/login')
}

// 카테고리 로딩
const loadCategories = async () => {
  try {
    const cats = await fetchCategories()
    categories.value = cats
  } catch (err) {
    console.error('카테고리 로딩 오류:', err)
    categories.value = ['전체', '교육', '홍보', '자격', '행사', '채용', '공지']
  }
}

// 검색 실행
const onSearch = async () => {
  currentPage.value = 1
  await loadPosts()
}

// 탭 변경
const onTabChange = async (tab: string) => {
  activeTab.value = tab
  currentPage.value = 1
  await loadPosts()
}

// 페이지 이동
const goToPage = async (page: number) => {
  const targetPage = Math.min(Math.max(1, page), totalPages.value)
  if (targetPage !== currentPage.value) {
    currentPage.value = targetPage
    await loadPosts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 게시글 상세 페이지로 이동
const goToPost = (postId: number) => {
  router.push(`/post/${postId}`)
}

// 게시글 작성 페이지로 이동
// 기존 함수를 이렇게 수정
const goToCreate = () => {
  if (!isLoggedIn.value) {
    alert('로그인이 필요한 서비스입니다.')
    router.push('/login')  // 또는 navigateTo('/login')
    return
  }
  router.push('/post/create')
}

// 날짜 포맷팅
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

// 컴포넌트 마운트
onMounted(async () => {
  checkLoginStatus()
  await loadCategories()
  await loadPosts()
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
          <div class="auth-buttons">
            <template v-if="isLoggedIn">
              <span class="user-info">{{ userNickname }}님</span>
              <button class="auth-btn logout-btn" @click="handleLogout">로그아웃</button>
            </template>
            <template v-else>
              <button class="auth-btn login-btn" @click="goToLogin">로그인</button>
            </template>
          </div>
          <button class="menu-btn">≡</button>
        </div>
      </div>
    </header>

    <!-- 로고 및 메인 네비게이션 -->
    <header class="main-header">
      <div class="main-header-content">
        <div class="logo-section">
          <h1 class="logo">
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
              v-for="category in categories"
              :key="category"
              class="tab"
              :class="{ active: activeTab === category }"
              @click="onTabChange(category)"
              :disabled="loading"
          >
            {{ category }}
          </button>
        </div>

        <!-- 검색 바 및 작성 버튼 -->
        <div class="searchbar">
          <div class="search-left">
            <select v-model="searchField" class="select" :disabled="loading">
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="author">작성자</option>
            </select>
            <input
                v-model="keyword"
                type="text"
                placeholder="검색어를 입력하세요"
                class="input"
                :disabled="loading"
                @keyup.enter="onSearch"
            />
            <button
                class="search-btn"
                @click="onSearch"
                :disabled="loading"
            >
              검색
            </button>
          </div>
          <div class="search-right">
            <button @click="goToCreate" class="create-btn">
              {{ isLoggedIn ? '게시글 작성' : '로그인 후 작성' }}
            </button>
          </div>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
          <button @click="loadPosts" class="retry-btn">다시 시도</button>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>게시글을 불러오는 중...</p>
        </div>

        <!-- 리스트 테이블 -->
        <div v-else class="board">
          <div class="thead">
            <div class="th no">번호</div>
            <div class="th cat">분류</div>
            <div class="th title">제목</div>
            <div class="th author">작성자</div>
            <div class="th date">등록일</div>
            <div class="th views">조회수</div>
          </div>

          <div v-if="posts.length === 0" class="empty">
            <p v-if="keyword.trim()">검색 결과가 없습니다.</p>
            <p v-else>게시물이 없습니다.</p>
          </div>

          <div v-for="post in posts" :key="post.id" class="trow" @click="goToPost(post.id)">
            <div class="td no">{{ post.id }}</div>
            <div class="td cat">
              <span class="chip" :data-category="post.category">{{ post.category }}</span>
            </div>
            <div class="td title">
              <span class="link">{{ post.title }}</span>
            </div>
            <div class="td author">{{ post.author }}</div>
            <div class="td date">{{ formatDate(post.createdAt) }}</div>
            <div class="td views">{{ post.views }}</div>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="!loading && posts.length > 0" class="pagination">
          <button
              class="page-btn"
              @click="goToPage(1)"
              :disabled="currentPage === 1"
          >
            «
          </button>
          <button
              class="page-btn"
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
          >
            ‹
          </button>

          <template v-for="page in Math.min(totalPages, 10)" :key="page">
            <button
                class="page-btn"
                :class="{ active: page === currentPage }"
                @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </template>

          <button
              class="page-btn"
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
          >
            ›
          </button>
          <button
              class="page-btn"
              @click="goToPage(totalPages)"
              :disabled="currentPage === totalPages"
          >
            »
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.website { min-height: 100vh; background-color: #f5f5f5; }

/* 헤더 */
.top-header { background-color: #1a1a1a; color: white; padding: 0; }
.top-header-content {
  max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between;
  align-items: center; padding: 0 20px;
}
.top-nav { display: flex; }
.top-nav a {
  color: #ccc; text-decoration: none; padding: 12px 20px; border-right: 1px solid #333;
  font-size: 14px; transition: all 0.3s;
}
.top-nav a.active, .top-nav a:hover { background-color: #4f46e5; color: white; }
.menu-btn { background: none; border: none; color: #ccc; font-size: 18px; cursor: pointer; }

.main-header { background-color: white; border-bottom: 1px solid #e5e7eb; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.main-header-content {
  max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between;
  align-items: center; padding: 15px 20px;
}
.logo-text {
  color: #1e40af; font-size: 24px; font-weight: 700;
}
.main-nav { display: flex; gap: 40px; }
.nav-item {
  color: #4b5563; text-decoration: none; font-weight: 500; font-size: 16px;
  padding: 10px 0; position: relative; transition: color 0.3s;
}
.nav-item.active, .nav-item:hover { color: #1e40af; }

/* 메인 콘텐츠 */
.main-content { padding: 20px 0; flex: 1; }
.content-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* 탭 */
.tabs {
  display: flex; gap: 2px; margin-bottom: 20px; background: white;
  border-radius: 8px; padding: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.tab {
  padding: 10px 20px; background: transparent; border: none; border-radius: 6px;
  color: #6b7280; font-weight: 500; cursor: pointer; transition: all 0.2s;
}
.tab:hover:not(:disabled) { color: #1e40af; background: #f8fafc; }
.tab.active { background: #1e40af; color: white; font-weight: 600; }
.tab:disabled { opacity: 0.5; cursor: not-allowed; }

/* 검색바 */
.searchbar {
  display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 20px;
  background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.search-left { display: flex; gap: 10px; align-items: center; flex: 1; }
.select, .input { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; }
.select { min-width: 100px; }
.input { flex: 1; max-width: 300px; }
.search-btn, .create-btn {
  padding: 10px 20px; border: none; border-radius: 6px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.search-btn { background: #6b7280; color: white; }
.search-btn:hover:not(:disabled) { background: #4b5563; }
.search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.create-btn { background: #1e40af; color: white; }
.create-btn:hover { background: #1d4ed8; }

/* 에러 및 로딩 */
.error-message {
  text-align: center; padding: 20px; background-color: #fef2f2;
  border: 1px solid #fecaca; border-radius: 8px; margin-bottom: 20px;
}
.error-message p { color: #dc2626; margin-bottom: 10px; }
.retry-btn { background: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }

.loading { text-align: center; padding: 60px 20px; }
.loading-spinner {
  width: 40px; height: 40px; border: 3px solid #f3f4f6; border-top: 3px solid #1e40af;
  border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* 게시판 테이블 */
.board { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.thead {
  display: grid; grid-template-columns: 80px 100px 1fr 120px 100px 80px;
  background: #f8fafc; border-bottom: 2px solid #e5e7eb;
}
.th { padding: 16px 12px; font-weight: 600; text-align: center; color: #374151; }
.trow {
  display: grid; grid-template-columns: 80px 100px 1fr 120px 100px 80px;
  border-bottom: 1px solid #f3f4f6; cursor: pointer; transition: background 0.2s;
}
.trow:hover { background: #f8fafc; }
.td { padding: 16px 12px; text-align: center; display: flex; align-items: center; justify-content: center; }
.td.title { text-align: left; justify-content: flex-start; }
.link { color: #374151; font-weight: 500; cursor: pointer; }
.trow:hover .link { color: #1e40af; text-decoration: underline; }

.chip {
  background: #e5e7eb; color: #374151; padding: 4px 8px;
  border-radius: 4px; font-size: 12px; font-weight: 500;
}
.chip[data-category="교육"] { background: #dbeafe; color: #1e40af; }
.chip[data-category="홍보"] { background: #fef3c7; color: #d97706; }
.chip[data-category="자격"] { background: #d1fae5; color: #059669; }
.chip[data-category="행사"] { background: #fce7f3; color: #be185d; }
.chip[data-category="채용"] { background: #e0e7ff; color: #6366f1; }
.chip[data-category="공지"] { background: #fee2e2; color: #dc2626; }

.empty { padding: 60px 20px; text-align: center; color: #6b7280; }

/* 페이지네이션 */
.pagination { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 30px; }
.page-btn {
  padding: 8px 12px; border: 1px solid #d1d5db; background: white; color: #6b7280;
  cursor: pointer; border-radius: 6px; transition: all 0.2s; min-width: 40px;
}
.page-btn:hover:not(:disabled) { background: #f3f4f6; border-color: #9ca3af; }
.page-btn.active { background: #1e40af; color: white; border-color: #1e40af; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* 반응형 */
@media (max-width: 768px) {
  .searchbar { flex-direction: column; align-items: stretch; }
  .search-left { justify-content: stretch; }
  .thead, .trow { grid-template-columns: 60px 80px 1fr 80px; }
  .th.author, .td.author, .th.views, .td.views { display: none; }
}

/* 인증 버튼 스타일 */
.auth-buttons {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-right: 15px;
}

.user-info {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.auth-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.login-btn {
  background-color: #1e40af;
  color: white;
}

.login-btn:hover {
  background-color: #1d4ed8;
}

.logout-btn {
  background-color: #6b7280;
  color: white;
}

.logout-btn:hover {
  background-color: #4b5563;
}
</style>