<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  title: '',
  content: '',
  author: ''
})

const loading = ref(false)
const errors = ref<Record<string, string>>({})

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

// 게시글 작성
const createPost = () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  
  // 하드코딩된 데이터에서는 실제 저장은 하지 않고 목록으로만 이동
  setTimeout(() => {
    alert('게시글이 작성되었습니다.')
    loading.value = false
    router.push('/')
  }, 1000)
}

// 목록으로 돌아가기
const goToList = () => {
  router.push('/')
}

// 폼 초기화
const resetForm = () => {
  form.value = {
    title: '',
    content: '',
    author: ''
  }
  errors.value = {}
}
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
          <a href="/" class="breadcrumb-link">홈</a>
          <span class="breadcrumb-separator">></span>
          <a href="/" class="breadcrumb-link">게시판</a>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">게시글 작성</span>
        </div>

        <!-- 게시글 작성 폼 -->
        <div class="post-form">
          <h1 class="form-title">게시글 작성</h1>
          
          <form @submit.prevent="createPost" class="form">
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
              <button type="button" @click="goToList" class="btn-secondary">취소</button>
              <button type="button" @click="resetForm" class="btn-secondary">초기화</button>
              <button type="submit" :disabled="loading" class="btn-primary">
                {{ loading ? '작성 중...' : '작성하기' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>

    <!-- Footer는 기존과 동일 -->
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
          <button class="top-btn" @click="window.scrollTo({ top: 0, behavior: 'smooth' })">TOP ︿</button>
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

/* 게시글 작성 폼 */
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
  width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus, .form-textarea:focus {
  outline: none; border-color: #1e40af; box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.form-input.error, .form-textarea.error {
  border-color: #dc2626;
}

.form-textarea {
  resize: vertical; min-height: 120px;
}

.error-message {
  display: block; color: #dc2626; font-size: 14px; margin-top: 4px;
}

.form-actions {
  display: flex; gap: 12px; justify-content: center; padding-top: 32px; border-top: 1px solid #e5e7eb;
}

/* 버튼 스타일 */
.btn-primary, .btn-secondary {
  padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; min-width: 100px;
}

.btn-primary {
  background-color: #1e40af; color: white;
}
.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}
.btn-primary:disabled {
  background-color: #9ca3af; cursor: not-allowed;
}

.btn-secondary {
  background-color: #6b7280; color: white;
}
.btn-secondary:hover {
  background-color: #4b5563;
}

/* 반응형 */
@media (max-width: 1023px){
  .top-nav { display: none; }
  .main-nav { display: none; }
  .main-header-content { padding: 10px 20px; }
}

@media (max-width: 768px){
  .post-form { padding: 20px; }
  .form-title { font-size: 20px; }
  .form-actions { flex-direction: column; }
  .btn-primary, .btn-secondary { width: 100%; }
}

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
