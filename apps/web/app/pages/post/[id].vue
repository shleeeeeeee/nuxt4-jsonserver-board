<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService, type Post } from '~/services/api'

const route = useRoute()
const router = useRouter()
const postId = route.params.id as string

const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref('')

// 게시글 데이터 가져오기
const fetchPost = async () => {
  try {
    const foundPost = await apiService.getPost(parseInt(postId))
    post.value = foundPost
    
    // 조회수 증가
    await apiService.incrementViews(parseInt(postId))
  } catch (error) {
    console.error('게시글 조회 실패:', error)
    error.value = '게시글을 찾을 수 없습니다.'
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
  router.push(`/post/${postId}/edit`)
}

// 게시글 삭제
const deletePost = async () => {
  if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    return
  }

  try {
    await apiService.deletePost(parseInt(postId))
    alert('게시글이 삭제되었습니다.')
    router.push('/')
  } catch (error) {
    console.error('게시글 삭제 실패:', error)
    alert('게시글 삭제에 실패했습니다. 다시 시도해주세요.')
  }
}

onMounted(() => {
  fetchPost()
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
          <a href="/" class="breadcrumb-link">홈</a>
          <span class="breadcrumb-separator">></span>
          <a href="/" class="breadcrumb-link">게시판</a>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">상세보기</span>
        </div>

        <!-- 게시글 상세 내용 -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>로딩 중...</p>
        </div>

        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button @click="goToList" class="btn-primary">목록으로 돌아가기</button>
        </div>

        <div v-else-if="post" class="post-detail">
          <div class="post-header">
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-meta">
              <span class="meta-item">
                <span class="meta-label">작성자:</span>
                <span class="meta-value">{{ post.author }}</span>
              </span>
              <span class="meta-item">
                <span class="meta-label">작성일:</span>
                <span class="meta-value">{{ new Date(post.createdAt).toLocaleDateString('ko-KR') }}</span>
              </span>
              <span class="meta-item">
                <span class="meta-label">조회수:</span>
                <span class="meta-value">{{ post.views }}</span>
              </span>
            </div>
          </div>

          <div class="post-content">
            <p>{{ post.content }}</p>
          </div>

          <div class="post-actions">
            <button @click="goToList" class="btn-secondary">목록</button>
            <button @click="editPost" class="btn-primary">수정</button>
            <button @click="deletePost" class="btn-danger">삭제</button>
          </div>
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

/* 게시글 상세 */
.post-detail {
  background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.post-header {
  border-bottom: 2px solid #e5e7eb; padding-bottom: 24px; margin-bottom: 32px;
}

.post-title {
  font-size: 28px; font-weight: 700; color: #111827; margin: 0 0 16px 0; line-height: 1.3;
}

.post-meta {
  display: flex; gap: 24px; flex-wrap: wrap;
}

.meta-item {
  display: flex; align-items: center; gap: 8px;
}

.meta-label {
  color: #6b7280; font-weight: 600;
}

.meta-value {
  color: #111827; font-weight: 500;
}

.post-content {
  font-size: 16px; line-height: 1.7; color: #374151; margin-bottom: 32px;
}

.post-actions {
  display: flex; gap: 12px; justify-content: flex-end; padding-top: 24px; border-top: 1px solid #e5e7eb;
}

/* 버튼 스타일 */
.btn-primary, .btn-secondary, .btn-danger {
  padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}

.btn-primary {
  background-color: #1e40af; color: white;
}
.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #6b7280; color: white;
}
.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-danger {
  background-color: #dc2626; color: white;
}
.btn-danger:hover {
  background-color: #b91c1c;
}

/* 로딩 및 에러 상태 */
.loading, .error {
  text-align: center; padding: 60px 20px;
}

.loading-spinner {
  width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #1e40af; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #dc2626;
}

/* 반응형 */
@media (max-width: 1023px){
  .top-nav { display: none; }
  .main-nav { display: none; }
  .main-header-content { padding: 10px 20px; }
}

@media (max-width: 768px){
  .post-detail { padding: 20px; }
  .post-title { font-size: 24px; }
  .post-meta { flex-direction: column; gap: 12px; }
  .post-actions { flex-direction: column; }
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
