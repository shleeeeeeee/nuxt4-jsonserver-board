<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { createPost, fetchCategories } = useApi()

const form = ref({
  title: '',
  content: '',
  author: '',
  category: ''
})

const loading = ref(false)
const errors = ref<Record<string, string>>({})
const categories = ref<string[]>([])

// 카테고리 로딩
const loadCategories = async () => {
  try {
    const cats = await fetchCategories()
    categories.value = cats.filter(cat => cat !== '전체') // '전체' 제외

    // 기본 카테고리 설정
    if (categories.value.length > 0) {
      form.value.category = categories.value[0]
    }
  } catch (error) {
    console.error('카테고리 로딩 오류:', error)
    categories.value = ['교육', '홍보', '자격', '행사', '채용', '공지']
    form.value.category = '교육'
  }
}

// 폼 유효성 검사
const validateForm = () => {
  errors.value = {}

  if (!form.value.title?.trim()) {
    errors.value.title = '제목을 입력해주세요.'
  } else if (form.value.title.trim().length > 200) {
    errors.value.title = '제목은 200자 이내로 입력해주세요.'
  }

  if (!form.value.content?.trim()) {
    errors.value.content = '내용을 입력해주세요.'
  } else if (form.value.content.trim().length > 2000) {
    errors.value.content = '내용은 2000자 이내로 입력해주세요.'
  }

  if (!form.value.author?.trim()) {
    errors.value.author = '작성자를 입력해주세요.'
  } else if (form.value.author.trim().length > 50) {
    errors.value.author = '작성자는 50자 이내로 입력해주세요.'
  }

  if (!form.value.category) {
    errors.value.category = '카테고리를 선택해주세요.'
  }

  return Object.keys(errors.value).length === 0
}

// 게시글 작성
const submitPost = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true

    const postData = {
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      author: form.value.author.trim(),
      category: form.value.category
    }

    await createPost(postData)

    alert('게시글이 작성되었습니다.')
    router.push('/')
  } catch (error) {
    console.error('게시글 작성 오류:', error)
    alert('게시글 작성 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

// 목록으로 돌아가기
const goToList = () => {
  const hasContent = form.value.title.trim() || form.value.content.trim() || form.value.author.trim()

  if (hasContent && !confirm('작성 중인 내용이 있습니다. 정말로 나가시겠습니까?')) {
    return
  }

  router.push('/')
}

// 폼 초기화
const resetForm = () => {
  if (!confirm('모든 내용이 초기화됩니다. 계속하시겠습니까?')) {
    return
  }

  form.value = {
    title: '',
    content: '',
    author: '',
    category: categories.value.length > 0 ? categories.value[0] : ''
  }
  errors.value = {}
}

// 컴포넌트 마운트 시 카테고리 로딩
onMounted(() => {
  loadCategories()
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
          <span class="breadcrumb-current">게시글 작성</span>
        </div>

        <!-- 게시글 작성 폼 -->
        <div class="post-form">
          <h1 class="form-title">게시글 작성</h1>

          <form @submit.prevent="submitPost" class="form">
            <!-- 카테고리 -->
            <div class="form-group">
              <label for="category" class="form-label">
                카테고리 <span class="required">*</span>
              </label>
              <select
                  id="category"
                  v-model="form.category"
                  class="form-select"
                  :class="{ error: errors.category }"
              >
                <option value="">카테고리를 선택해주세요</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
              <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
            </div>

            <!-- 제목 -->
            <div class="form-group">
              <label for="title" class="form-label">
                제목 <span class="required">*</span>
              </label>
              <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.title }"
                  placeholder="제목을 입력해주세요"
                  maxlength="200"
              />
              <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
              <div class="char-count">{{ form.title.length }}/200</div>
            </div>

            <!-- 작성자 -->
            <div class="form-group">
              <label for="author" class="form-label">
                작성자 <span class="required">*</span>
              </label>
              <input
                  id="author"
                  v-model="form.author"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.author }"
                  placeholder="작성자명을 입력해주세요"
                  maxlength="50"
              />
              <span v-if="errors.author" class="error-message">{{ errors.author }}</span>
              <div class="char-count">{{ form.author.length }}/50</div>
            </div>

            <!-- 내용 -->
            <div class="form-group">
              <label for="content" class="form-label">
                내용 <span class="required">*</span>
              </label>
              <textarea
                  id="content"
                  v-model="form.content"
                  class="form-textarea"
                  :class="{ error: errors.content }"
                  placeholder="내용을 입력해주세요"
                  rows="12"
                  maxlength="2000"
              ></textarea>
              <span v-if="errors.content" class="error-message">{{ errors.content }}</span>
              <div class="char-count">{{ form.content.length }}/2000</div>
            </div>

            <!-- 버튼 그룹 -->
            <div class="form-actions">
              <button type="button" @click="goToList" class="btn-secondary">목록</button>
              <button type="button" @click="resetForm" class="btn-warning">초기화</button>
              <button type="submit" :disabled="loading" class="btn-primary">
                <span v-if="loading">작성 중...</span>
                <span v-else>작성완료</span>
              </button>
            </div>
          </form>
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

/* 폼 */
.post-form {
  background: white; border-radius: 12px; padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.form-title {
  font-size: 24px; font-weight: 700; color: #111827;
  margin: 0 0 32px 0; text-align: center;
}
.form { max-width: 800px; margin: 0 auto; }
.form-group { margin-bottom: 24px; }
.form-label {
  display: block; font-weight: 600; color: #374151;
  margin-bottom: 8px; font-size: 14px;
}
.required { color: #dc2626; }

.form-input, .form-textarea, .form-select {
  width: 100%; padding: 12px 16px; border: 1px solid #d1d5db;
  border-radius: 8px; font-size: 16px; transition: border-color 0.2s; box-sizing: border-box;
}
.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none; border-color: #1e40af; box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}
.form-input.error, .form-textarea.error, .form-select.error { border-color: #dc2626; }
.form-textarea { resize: vertical; min-height: 120px; font-family: inherit; }
.form-select { cursor: pointer; }

.error-message { display: block; color: #dc2626; font-size: 14px; margin-top: 4px; }
.char-count { text-align: right; font-size: 12px; color: #6b7280; margin-top: 4px; }
.form-actions { display: flex; gap: 12px; justify-content: center; margin-top: 32px; flex-wrap: wrap; }

/* 버튼 */
.btn-primary, .btn-secondary, .btn-warning {
  padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600;
  cursor: pointer; transition: all 0.2s; font-size: 14px;
}
.btn-primary { background: #1e40af; color: white; }
.btn-primary:hover:not(:disabled) { background: #1d4ed8; }
.btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
.btn-secondary { background: #6b7280; color: white; }
.btn-secondary:hover { background: #4b5563; }
.btn-warning { background: #f59e0b; color: white; }
.btn-warning:hover { background: #d97706; }

/* 반응형 */
@media (max-width: 768px) {
  .post-form { padding: 20px; }
  .form-title { font-size: 20px; }
  .form-actions { gap: 8px; }
  .btn-primary, .btn-secondary, .btn-warning { padding: 10px 16px; font-size: 13px; }
}
</style>