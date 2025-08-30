<script setup lang="ts">
import { ref } from 'vue'

// 폼 데이터
const form = ref({
  username: '',
  password: '',
})

// 상태 관리
const loading = ref(false)
const error = ref('')

// 로그인 처리
async function handleLogin() {
  // 유효성 검사
  if (!form.value.username.trim()) {
    error.value = '아이디를 입력해주세요.'
    return
  }

  if (!form.value.password) {
    error.value = '비밀번호를 입력해주세요.'
    return
  }

  try {
    loading.value = true
    error.value = ''

    // JSON Server에서 사용자 정보 조회
    const response = await fetch(`http://localhost:4000/users?username=${form.value.username}`)
    const users = await response.json()

    if (users.length === 0) {
      error.value = '존재하지 않는 아이디입니다.'
      return
    }

    const user = users[0]

    // 비밀번호 확인 (실제로는 해시 비교 필요)
    if (user.password !== form.value.password) {
      error.value = '비밀번호가 일치하지 않습니다.'
      return
    }

    // 로그인 성공 - 로컬스토리지에 저장
    localStorage.setItem('userId', user.id.toString())
    localStorage.setItem('username', user.username)
    localStorage.setItem('nickname', user.nickname)
    localStorage.setItem('isLoggedIn', 'true')

    // 메인 페이지로 이동
    alert(`${user.nickname}님, 환영합니다!`)
    await navigateTo('/')
  }
  catch (err) {
    console.error('로그인 오류:', err)
    error.value = '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
  finally {
    loading.value = false
  }
}

// 회원가입 페이지로 이동
function goToRegister() {
  navigateTo('/register')
}

// 메인 페이지로 이동
function goToHome() {
  navigateTo('/')
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
          <button class="menu-btn">
            ≡
          </button>
        </div>
      </div>
    </header>

    <!-- 로고 및 메인 네비게이션 -->
    <header class="main-header">
      <div class="main-header-content">
        <div class="logo-section">
          <h1 class="logo">
            <span class="logo-text" style="cursor: pointer;" @click="goToHome">Power Social Worker</span>
          </h1>
        </div>
        <nav class="main-nav">
          <a href="#" class="nav-item">소통</a>
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
        <div class="login-container">
          <div class="login-box">
            <h2 class="login-title">
              로그인
            </h2>

            <!-- 에러 메시지 -->
            <div v-if="error" class="error-alert">
              {{ error }}
            </div>

            <!-- 로그인 폼 -->
            <form class="login-form" @submit.prevent="handleLogin">
              <div class="form-group">
                <label for="username" class="form-label">아이디</label>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  class="form-input"
                  placeholder="아이디를 입력하세요"
                  :disabled="loading"
                  @input="error = ''"
                >
              </div>

              <div class="form-group">
                <label for="password" class="form-label">비밀번호</label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  class="form-input"
                  placeholder="비밀번호를 입력하세요"
                  :disabled="loading"
                  @input="error = ''"
                >
              </div>

              <!-- 체크박스 영역 -->
              <div class="remember-section">
                <label class="checkbox-label">
                  <input type="checkbox" class="checkbox">
                  <span>아이디 저장</span>
                </label>
              </div>

              <!-- 버튼 영역 -->
              <button type="submit" class="btn-login" :disabled="loading">
                {{ loading ? '로그인 중...' : '로그인' }}
              </button>
            </form>

            <!-- 하단 링크 -->
            <div class="login-footer">
              <span>아직 회원이 아니신가요?</span>
              <a class="link" @click="goToRegister">회원가입</a>
            </div>

            <div class="divider" />

            <!-- 추가 링크 -->
            <div class="extra-links">
              <a href="#" class="extra-link">아이디 찾기</a>
              <span class="separator">|</span>
              <a href="#" class="extra-link">비밀번호 찾기</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 기존 프로젝트와 동일한 헤더 스타일 */
.website { min-height: 100vh; background-color: #f5f5f5; }

.top-header { background-color: #1a1a1a; color: white; padding: 0; }
.top-header-content {
  max-width: 1200px; margin: 0 auto; display: flex;
  justify-content: space-between; align-items: center; padding: 0 20px;
}
.top-nav { display: flex; }
.top-nav a {
  color: #ccc; text-decoration: none; padding: 12px 20px;
  border-right: 1px solid #333; font-size: 14px; transition: all 0.3s;
}
.top-nav a.active, .top-nav a:hover { background-color: #4f46e5; color: white; }
.menu-btn { background: none; border: none; color: #ccc; font-size: 18px; cursor: pointer; }

.main-header {
  background-color: white; border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.main-header-content {
  max-width: 1200px; margin: 0 auto; display: flex;
  justify-content: space-between; align-items: center; padding: 15px 20px;
}
.logo-text { color: #1e40af; font-size: 24px; font-weight: 700; }
.main-nav { display: flex; gap: 40px; }
.nav-item {
  color: #4b5563; text-decoration: none; font-weight: 500;
  font-size: 16px; padding: 10px 0; position: relative; transition: color 0.3s;
}
.nav-item.active, .nav-item:hover { color: #1e40af; }

/* 로그인 페이지 스타일 */
.main-content { padding: 60px 0; flex: 1; }
.content-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.login-box {
  background: white;
  padding: 48px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 32px;
}

.error-alert {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.form-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.remember-section {
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
}

.checkbox {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.btn-login {
  width: 100%;
  padding: 14px;
  background-color: #1e40af;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-login:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.btn-login:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
}

.link {
  color: #1e40af;
  font-weight: 600;
  margin-left: 8px;
  cursor: pointer;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 20px 0;
}

.extra-links {
  text-align: center;
  font-size: 14px;
}

.extra-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.3s;
}

.extra-link:hover {
  color: #1e40af;
  text-decoration: underline;
}

.separator {
  color: #d1d5db;
  margin: 0 12px;
}

/* 반응형 */
@media (max-width: 768px) {
  .main-nav { display: none; }

  .login-box {
    padding: 32px 24px;
    margin: 0 16px;
  }

  .login-title {
    font-size: 24px;
  }
}
</style>
