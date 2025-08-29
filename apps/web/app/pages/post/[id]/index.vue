<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import type { Post } from '~/services/api'

const route = useRoute()
const { fetchPost, deletePost } = useApi()

// 반응형으로 postId 관리
const postId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : id
})

const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref('')
const deleting = ref(false)

// 내 글인지 확인 (추가된 부분)
const isMyPost = computed(() => {
  const myUserId = localStorage.getItem('userId')
  return post.value?.authorId === myUserId
})

// 게시글 데이터 가져오기
const loadPost = async () => {
  try {
    loading.value = true
    error.value = ''

    const idValue = postId.value as string

    if (!idValue) {
      throw new Error('게시글 ID가 없습니다.')
    }

    const postData = await fetchPost(idValue)
    post.value = postData
  } catch (err: any) {
    console.error('게시글 로딩 오류:', err)

    if (err?.message?.includes('404') || err?.status === 404) {
      error.value = '게시글을 찾을 수 없습니다.'
    } else {
      error.value = '게시글을 불러오는 중 오류가 발생했습니다.'
    }

    post.value = null
  } finally {
    loading.value = false
  }
}

// 목록으로 돌아가기
const goToList = () => {
  navigateTo('/')
}

// 수정 페이지로 이동 - navigateTo 사용
const editPost = async () => {
  if (postId.value) {
    console.log('수정 페이지로 이동:', `/post/${postId.value}/edit`)
    await navigateTo(`/post/${postId.value}/edit`)
  }
}

// 게시글 삭제
const handleDeletePost = async () => {
  if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    return
  }

  if (!post.value) {
    return
  }

  try {
    deleting.value = true

    await deletePost(post.value.id)

    alert('게시글이 삭제되었습니다.')
    await navigateTo('/')
  } catch (err) {
    console.error('게시글 삭제 오류:', err)
    alert('게시글 삭제 중 오류가 발생했습니다.')
  } finally {
    deleting.value = false
  }
}

// 날짜 포맷팅
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

// TOP 버튼 클릭 시 페이지 상단으로 스크롤
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadPost()
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
        <!-- 브레드크럼 -->
        <div class="breadcrumb">
          <NuxtLink to="/apps/web/public" class="breadcrumb-link">홈</NuxtLink>
          <span class="breadcrumb-separator">></span>
          <NuxtLink to="/apps/web/public" class="breadcrumb-link">게시판</NuxtLink>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">상세보기</span>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="error" class="error-container">
          <p class="error-text">{{ error }}</p>
          <button @click="goToList" class="btn-primary">목록으로 돌아가기</button>
        </div>

        <!-- 로딩 상태 -->
        <div v-else-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>게시글을 불러오는 중...</p>
        </div>

        <!-- 게시글 내용 -->
        <div v-else-if="post" class="post-detail">
          <!-- 게시글 헤더 -->
          <div class="post-header">
            <div class="post-category">
              <span class="chip" :data-category="post.category">{{ post.category }}</span>
            </div>
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-meta">
              <div class="meta-item">
                <span class="meta-label">작성자</span>
                <span class="meta-value">{{ post.author }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">작성일</span>
                <span class="meta-value">{{ formatDate(post.createdAt) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">조회수</span>
                <span class="meta-value">{{ post.views }}</span>
              </div>
            </div>
          </div>

          <!-- 게시글 본문 -->
          <div class="post-content">
            <p>{{ post.content }}</p>
          </div>

          <!-- 액션 버튼들 - 수정된 부분 -->
          <div class="post-actions">
            <button @click="goToList" class="btn-secondary">목록</button>
            <div class="right-actions">
              <!-- v-if="isMyPost" 추가 -->
              <NuxtLink
                  v-if="isMyPost"
                  :to="`/post/${postId}/edit`"
                  class="btn-primary"
                  style="text-decoration: none; display: inline-block;"
              >
                수정
              </NuxtLink>
              <button
                  v-if="isMyPost"
                  @click="handleDeletePost"
                  :disabled="deleting"
                  class="btn-danger"
              >
                {{ deleting ? '삭제 중...' : '삭제' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- TOP 버튼 -->
    <button class="scroll-top" @click="scrollToTop" title="맨 위로">
      TOP
    </button>
  </div>
</template>

<style scoped>
/* ===== 글로벌 스타일 ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif; color: #333; }
a { text-decoration: none; color: inherit; }

/* ===== 헤더 영역 ===== */
.top-header { background: #1a1a1a; color: #fff; }
.top-header-content {
  max-width: 1200px; margin: 0 auto; display: flex;
  justify-content: space-between; align-items: center; padding: 8px 20px;
}
.top-nav { display: flex; gap: 20px; }
.top-nav a {
  color: #ccc; font-size: 13px; transition: color 0.3s;
}
.top-nav a:hover, .top-nav a.active { color: #fff; font-weight: 500; }
.menu-btn {
  background: none; border: none; color: #fff; font-size: 20px; cursor: pointer;
}

.main-header {
  background: #fff; border-bottom: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.main-header-content {
  max-width: 1200px; margin: 0 auto; display: flex;
  justify-content: space-between; align-items: center; padding: 15px 20px;
}
.logo-text {
  font-size: 24px; font-weight: 700; color: #1e40af;
}
.main-nav { display: flex; gap: 40px; }
.nav-item {
  color: #4b5563; font-weight: 500; padding: 8px 0; position: relative; transition: color 0.3s;
}
.nav-item:hover, .nav-item.active { color: #1e40af; }
.nav-item.active::after {
  content: ''; position: absolute; bottom: -15px; left: 0; right: 0; height: 3px; background-color: #1e40af;
}

/* ===== 메인 콘텐츠 ===== */
.main-content { padding: 20px 0; min-height: 600px; }
.content-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* 브레드크럼 */
.breadcrumb {
  display: flex; align-items: center; gap: 8px; margin-bottom: 24px; font-size: 14px;
}
.breadcrumb-link {
  color: #6b7280; text-decoration: none;
}
.breadcrumb-link:hover {
  color: #1e40af; text-decoration: underline;
}
.breadcrumb-separator {
  color: #9ca3af;
}
.breadcrumb-current {
  color: #111827; font-weight: 600;
}

/* 에러 컨테이너 */
.error-container {
  text-align: center; padding: 60px 20px; background: white; border-radius: 12px;
}
.error-text {
  color: #dc2626; font-size: 18px; margin-bottom: 24px;
}

/* 로딩 상태 */
.loading {
  text-align: center; padding: 60px 20px; background: white; border-radius: 12px;
}
.loading-spinner {
  width: 40px; height: 40px; border: 4px solid #e5e7eb;
  border-top: 4px solid #1e40af; border-radius: 50%;
  animation: spin 1s linear infinite; margin: 0 auto 16px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 게시글 상세 */
.post-detail {
  background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.post-header {
  border-bottom: 2px solid #e5e7eb; padding-bottom: 24px; margin-bottom: 32px;
}

.post-category {
  margin-bottom: 16px;
}

.chip {
  display: inline-block; background: #e5e7eb; color: #374151;
  padding: 6px 12px; border-radius: 6px; font-size: 14px; font-weight: 500;
}
.chip[data-category="교육"] { background: #dbeafe; color: #1e40af; }
.chip[data-category="홍보"] { background: #fef3c7; color: #d97706; }
.chip[data-category="자격"] { background: #d1fae5; color: #059669; }
.chip[data-category="행사"] { background: #fce7f3; color: #be185d; }
.chip[data-category="채용"] { background: #e0e7ff; color: #6366f1; }
.chip[data-category="공지"] { background: #fee2e2; color: #dc2626; }

.post-title {
  font-size: 28px; font-weight: 700; color: #111827; margin-bottom: 16px; line-height: 1.4;
}

.post-meta {
  display: flex; gap: 24px; flex-wrap: wrap;
}

.meta-item {
  display: flex; gap: 8px; align-items: center; font-size: 14px;
}

.meta-label {
  color: #6b7280; font-weight: 500;
}

.meta-value {
  color: #111827;
}

.post-content {
  min-height: 200px; line-height: 1.8; color: #374151; font-size: 16px;
  white-space: pre-wrap; word-break: break-word; margin-bottom: 48px;
}

.post-actions {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 24px; border-top: 1px solid #e5e7eb;
}

.right-actions {
  display: flex; gap: 12px; align-items: center;
}

/* 버튼 스타일 */
.btn-primary, .btn-secondary, .btn-danger {
  padding: 12px 24px; border: none; border-radius: 8px;
  font-weight: 600; cursor: pointer; transition: all 0.2s;
  min-width: 100px; font-size: 14px; text-align: center;
  line-height: normal;
}

.btn-primary {
  background-color: #1e40af; color: white;
}
.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8; transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6b7280; color: white;
}
.btn-secondary:hover {
  background-color: #4b5563; transform: translateY(-1px);
}

.btn-danger {
  background-color: #dc2626; color: white;
}
.btn-danger:hover:not(:disabled) {
  background-color: #b91c1c; transform: translateY(-1px);
}
.btn-danger:disabled {
  background-color: #9ca3af; cursor: not-allowed;
}

/* TOP 버튼 */
.scroll-top {
  position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px;
  background: #1e40af; color: white; border: none; border-radius: 50%;
  font-weight: 700; cursor: pointer; z-index: 1000; transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.scroll-top:hover {
  background: #1d4ed8; transform: translateY(-2px);
}

/* 반응형 */
@media (max-width: 1023px) {
  .top-nav { display: none; }
  .main-nav { display: none; }
  .main-header-content { padding: 10px 20px; }
}

@media (max-width: 768px) {
  .post-detail { padding: 20px; }
  .post-title { font-size: 22px; }
  .post-meta { flex-direction: column; gap: 12px; }
  .post-actions {
    flex-direction: column; gap: 12px;
  }
  .right-actions {
    width: 100%; justify-content: space-between;
  }
  .btn-primary, .btn-secondary, .btn-danger {
    flex: 1;
  }
}
</style>