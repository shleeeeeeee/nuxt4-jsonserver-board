<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Post } from '~/services/api'

const route = useRoute()
const router = useRouter()
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

// 게시글 데이터 가져오기
const loadPost = async () => {
  try {
    loading.value = true
    error.value = ''

    const numericId = parseInt(postId.value as string, 10)

    if (isNaN(numericId)) {
      throw new Error('잘못된 게시글 ID입니다.')
    }

    const postData = await fetchPost(numericId)
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
  router.push('/')
}

// 수정 페이지로 이동
const editPost = () => {
  if (postId.value) {
    router.push(`/post/${postId.value}/edit`)
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
    router.push('/')
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

// 컴포넌트 마운트 시 데이터 가져오기
onMounted(() => {
  loadPost()
})

// route 변경 감지하여 데이터 다시 가져오기
watch(() => route.params.id, () => {
  if (route.params.id) {
    loadPost()
  }
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
          <a href="/" class="breadcrumb-link">홈</a>
          <span class="breadcrumb-separator">></span>
          <a href="/" class="breadcrumb-link">게시판</a>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">상세보기</span>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>게시글을 불러오는 중...</p>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="error">
          <div class="error-content">
            <h2>오류 발생</h2>
            <p>{{ error }}</p>
            <div class="error-actions">
              <button @click="loadPost" class="btn-primary">다시 시도</button>
              <button @click="goToList" class="btn-secondary">목록으로 돌아가기</button>
            </div>
          </div>
        </div>

        <!-- 게시글 상세 내용 -->
        <div v-else-if="post" class="post-detail">
          <div class="post-header">
            <div class="category-badge">
              <span class="chip" :data-category="post.category">{{ post.category }}</span>
            </div>
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-meta">
              <span class="meta-item">
                <span class="meta-label">작성자:</span>
                <span class="meta-value">{{ post.author }}</span>
              </span>
              <span class="meta-item">
                <span class="meta-label">작성일:</span>
                <span class="meta-value">{{ formatDate(post.createdAt) }}</span>
              </span>
              <span class="meta-item">
                <span class="meta-label">조회수:</span>
                <span class="meta-value">{{ post.views }}</span>
              </span>
            </div>
          </div>

          <div class="post-content">
            <div class="content-text">{{ post.content }}</div>
          </div>

          <div class="post-actions">
            <button @click="goToList" class="btn-secondary">목록</button>
            <button @click="editPost" class="btn-primary">수정</button>
            <button
                @click="handleDeletePost"
                class="btn-danger"
                :disabled="deleting"
            >
              <span v-if="deleting">삭제 중...</span>
              <span v-else>삭제</span>
            </button>
          </div>
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
.logo-text { color: #1e40af; font-size: 24px; font-weight: 700; }
.main-nav { display: flex; gap: 40px; }
.nav-item {
  color: #4b5563; text-decoration: none; font-weight: 500; font-size: 16px;
  padding: 10px 0; position: relative; transition: color 0.3s;
}
.nav-item.active, .nav-item:hover { color: #1e40af; }

/* 메인 콘텐츠 */
.main-content { padding: 20px 0; flex: 1; }
.content-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* 브레드크럼 */
.breadcrumb {
  display: flex; align-items: center; gap: 8px; margin-bottom: 24px; font-size: 14px;
}
.breadcrumb-link { color: #6b7280; text-decoration: none; }
.breadcrumb-link:hover { color: #1e40af; text-decoration: underline; }
.breadcrumb-separator { color: #9ca3af; }
.breadcrumb-current { color: #111827; font-weight: 600; }

/* 로딩 및 에러 */
.loading { text-align: center; padding: 60px 20px; }
.loading-spinner {
  width: 40px; height: 40px; border: 3px solid #f3f4f6; border-top: 3px solid #1e40af;
  border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.error { text-align: center; padding: 60px 20px; }
.error-content h2 { color: #dc2626; margin-bottom: 16px; font-size: 24px; }
.error-content p { color: #6b7280; margin-bottom: 24px; font-size: 16px; }
.error-actions { display: flex; gap: 12px; justify-content: center; }

/* 게시글 상세 */
.post-detail {
  background: white; border-radius: 12px; padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.post-header { border-bottom: 2px solid #e5e7eb; padding-bottom: 24px; margin-bottom: 32px; }
.category-badge { margin-bottom: 12px; }
.chip {
  background: #e5e7eb; color: #374151; padding: 6px 12px;
  border-radius: 6px; font-size: 13px; font-weight: 500;
}
.chip[data-category="교육"] { background: #dbeafe; color: #1e40af; }
.chip[data-category="홍보"] { background: #fef3c7; color: #d97706; }
.chip[data-category="자격"] { background: #d1fae5; color: #059669; }
.chip[data-category="행사"] { background: #fce7f3; color: #be185d; }
.chip[data-category="채용"] { background: #e0e7ff; color: #6366f1; }
.chip[data-category="공지"] { background: #fee2e2; color: #dc2626; }

.post-title { font-size: 28px; font-weight: 700; color: #111827; margin: 0 0 16px 0; line-height: 1.3; }
.post-meta { display: flex; gap: 24px; flex-wrap: wrap; }
.meta-item { display: flex; align-items: center; gap: 8px; }
.meta-label { color: #6b7280; font-weight: 600; font-size: 14px; }
.meta-value { color: #111827; font-weight: 500; }

.post-content { margin-bottom: 32px; }
.content-text {
  font-size: 16px; line-height: 1.7; color: #374151;
  min-height: 200px; white-space: pre-wrap;
}

.post-actions {
  display: flex; gap: 12px; justify-content: flex-end;
  padding-top: 24px; border-top: 1px solid #e5e7eb;
}

/* 버튼 */
.btn-primary, .btn-secondary, .btn-danger {
  padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600;
  cursor: pointer; transition: all 0.2s; font-size: 14px;
}
.btn-primary { background: #1e40af; color: white; }
.btn-primary:hover { background: #1d4ed8; }
.btn-secondary { background: #6b7280; color: white; }
.btn-secondary:hover { background: #4b5563; }
.btn-danger { background: #dc2626; color: white; }
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-danger:disabled { background: #9ca3af; cursor: not-allowed; }

/* 반응형 */
@media (max-width: 768px) {
  .post-detail { padding: 20px; }
  .post-title { font-size: 24px; }
  .post-meta { flex-direction: column; gap: 8px; }
  .post-actions { justify-content: center; flex-wrap: wrap; }
}
</style>