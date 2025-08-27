<template>
  <div class="layout">
    <!-- 상단 헤더 -->
    <header class="header">
      <div class="header-content">
        <h1>게시판 시스템</h1>
        <button class="write-btn">글쓰기</button>
      </div>
    </header>

    <!-- 메인 영역 -->
    <div class="main-container">
      <!-- 왼쪽 사이드바 -->
      <aside class="sidebar">
        <div class="menu-section">
          <div class="menu-title">소통</div>
          <ul class="menu-list">
            <li><a href="/">공지사항</a></li>
            <li><a href="#">자유게시판</a></li>
            <li><a href="#">질문게시판</a></li>
          </ul>
        </div>
      </aside>

      <!-- 오른쪽 콘텐츠 -->
      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background: white;
  border-bottom: 1px solid #ddd;
  padding: 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header h1 {
  color: #3b82f6;
  margin: 0;
  font-size: 1.5rem;
}

.write-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.write-btn:hover {
  background: #059669;
}

.main-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 1rem;
  padding: 1rem;
}

.sidebar {
  width: 250px;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  height: fit-content;
}

.menu-title {
  background: #3b82f6;
  color: white;
  padding: 0.75rem;
  text-align: center;
  font-weight: bold;
  border-radius: 4px 4px 0 0;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.menu-list li a {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
}

.menu-list li:last-child a {
  border-bottom: none;
}

.menu-list li a:hover {
  background: #eff6ff;
  color: #3b82f6;
}

.content {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  min-height: 500px;
}
</style>
