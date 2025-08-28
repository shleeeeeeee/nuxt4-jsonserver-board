<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import type { Post } from '~/services/api'

const route = useRoute()
const router = useRouter()

// useApi composable 사용
const { fetchPost, updatePost: apiUpdatePost } = useApi()

// postId를 computed로 관리
const postId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : id
})

const form = ref({
  title: '',
  content: '',
  author: '',
  category: '전체'
})

const loading = ref(true)
const errors = ref<Record<string, string>>({})
const originalPost = ref<Post | null>(null)
const saving = ref(false)

// 게시글 데이터 가져오기
const loadPost = async () => {
  loading.value = true
  try {
    const idValue = postId.value as string

    if (!idValue) {
      throw new Error('게시글 ID가 없습니다.')
    }

    const foundPost = await fetchPost(idValue)
    originalPost.value = foundPost

    // 폼에 기존 데이터 설정
    form.value = {
      title: foundPost.title,
      content: foundPost.content,
      author: foundPost.author,
      category: foundPost.category || '전체'
    }
  } catch (error) {
    console.error('게시글 조회 실패:', error)
    alert('게시글을 찾을 수 없습니다.')
    router.push('/')
  } finally {
    loading.value = false
  }
}

// 폼 유효성 검사
const validateForm = () => {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.title = '제목을 입력해주세요.'
  }

  if (!form.value.content.trim()) {
    errors.value.content = '내용을 입력해주세요.'
  }

  if (!form.value.author.trim()) {
    errors.value.author = '작성자를 입력해주세요.'
  }

  return Object.keys(errors.value).length === 0
}

// 게시글 수정
const updatePost = async () => {
  if (!validateForm()) {
    return
  }

  saving.value = true

  try {
    const idValue = postId.value as string

    await apiUpdatePost(idValue, {
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      author: form.value.author.trim(),
      category: form.value.category
    })

    alert('게시글이 수정되었습니다.')
    router.push(`/post/${postId.value}`)
  } catch (error) {
    console.error('게시글 수정 실패:', error)
    alert('게시글 수정에 실패했습니다. 다시 시도해주세요.')
  } finally {
    saving.value = false
  }
}

// 목록으로 돌아가기
const goToList = () => {
  router.push('/')
}

// 상세페이지로 돌아가기
const goToDetail = () => {
  router.push(`/post/${postId.value}`)
}

// 폼 초기화 (원본 데이터로)
const resetForm = () => {
  if (originalPost.value) {
    form.value = {
      title: originalPost.value.title,
      content: originalPost.value.content,
      author: originalPost.value.author,
      category: originalPost.value.category || '전체'
    }
  }
  errors.value = {}
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
          <NuxtLink to="/" class="breadcrumb-link">홈</NuxtLink>
          <span class="breadcrumb-separator">></span>
          <NuxtLink to="/" class="breadcrumb-link">게시판</NuxtLink>
          <span class="breadcrumb-separator">></span>
          <NuxtLink :to="`/post/${postId}`" class="breadcrumb-link">상세보기</NuxtLink>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">수정</span>
        </div>

        <!-- 게시글 수정 폼 -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>로딩 중...</p>
        </div>

        <div v-else class="post-form">
          <h1 class="form-title">게시글 수정</h1>

          <form @submit.prevent="updatePost" class="form">
            <div class="form-group">
              <label for="title" class="form-label">제목 <span class="required">*</span></label>
              <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.title }"
                  placeholder="제목을 입력하세요"
              />
              <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
            </div>

            <div class="form-group">
              <label for="category" class="form-label">분류</label>
              <select
                  id="category"
                  v-model="form.category"
                  class="form-input"
              >
                <option value="전체">전체</option>
                <option value="채용">채용</option>
                <option value="입찰">입찰</option>
                <option value="모집">모집</option>
                <option value="행사">행사</option>
                <option value="홍보">홍보</option>
                <option value="자격">자격</option>
                <option value="교육">교육</option>
                <option value="공지">공지</option>
              </select>
            </div>

            <div class="form-group">
              <label for="author" class="form-label">작성자 <span class="required">*</span></label>
              <input
                  id="author"
                  v-model="form.author"
                  type="text"
                  class="form-input"
                  :class="{ 'error': errors.author }"
                  placeholder="작성자를 입력하세요"
              />
              <span v-if="errors.author" class="error-message">{{ errors.author }}</span>
            </div>

            <div class="form-group">
              <label for="content" class="form-label">내용 <span class="required">*</span></label>
              <textarea
                  id="content"
                  v-model="form.content"
                  class="form-textarea"
                  :class="{ 'error': errors.content }"
                  placeholder="내용을 입력하세요"
                  rows="10"
              ></textarea>
              <span v-if="errors.content" class="error-message">{{ errors.content }}</span>
            </div>

            <div class="form-actions">
              <button type="button" @click="goToList" class="btn-secondary">목록</button>
              <button type="button" @click="goToDetail" class="btn-secondary">취소</button>
              <button type="button" @click="resetForm" class="btn-secondary">초기화</button>
              <button type="submit" :disabled="saving" class="btn-primary">
                {{ saving ? '수정 중...' : '수정 완료' }}
              </button>
            </div>
          </form>
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
ul { list-style: none; }

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

/* 게시글 수정 폼 */
.post-form {
  background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.form-title {
  font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 32px 0; text-align: center;
}

.form {
  max-width: 800px; margin: 0 auto;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block; font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px;
}

.required {
  color: #dc2626;
}

.form-input, .form-textarea {
  width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 16px; transition: border-color 0.2s; box-sizing: border-box;
  font-family: inherit;
}

.form-input:focus, .form-textarea:focus {
  outline: none; border-color: #1e40af; box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.form-input.error, .form-textarea.error {
  border-color: #dc2626;
}

.form-textarea {
  resize: vertical; min-height: 200px;
}

.error-message {
  display: block; color: #dc2626; font-size: 14px; margin-top: 4px;
}

.form-actions {
  display: flex; gap: 12px; justify-content: center; padding-top: 32px;
  border-top: 1px solid #e5e7eb;
}

/* 버튼 스타일 */
.btn-primary, .btn-secondary {
  padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600;
  cursor: pointer; transition: all 0.2s; min-width: 100px; font-size: 14px;
}

.btn-primary {
  background-color: #1e40af; color: white;
}
.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8; transform: translateY(-1px);
}
.btn-primary:disabled {
  background-color: #9ca3af; cursor: not-allowed;
}

.btn-secondary {
  background-color: #6b7280; color: white;
}
.btn-secondary:hover {
  background-color: #4b5563; transform: translateY(-1px);
}

/* 로딩 상태 */
.loading {
  text-align: center; padding: 60px 20px;
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

/* ===== 반응형 ===== */
@media (max-width: 1023px) {
  .top-nav { display: none; }
  .main-nav { display: none; }
  .main-header-content { padding: 10px 20px; }
}

@media (max-width: 768px) {
  .post-form { padding: 20px; }
  .form-title { font-size: 20px; }
  .form-actions { flex-direction: column; }
  .btn-primary, .btn-secondary { width: 100%; }
}
</style>