<template>
  <div class="page-layout">
    <!-- 좌측 사이드바 -->
    <aside class="sidebar">
      <!-- 소통 메뉴 -->
      <div class="menu-section">
        <div class="menu-header">
          <span class="menu-title">소통</span>
          <button class="expand-btn">
            ▲
          </button>
        </div>
        <ul class="menu-list">
          <li><a href="#" class="menu-item">공지사항</a></li>
          <li><a href="#" class="menu-item">자유게시판</a></li>
          <li><a href="#" class="menu-item">출산휴가</a></li>
          <li><a href="#" class="menu-item">회원서비스 및 이벤트</a></li>
          <li><a href="#" class="menu-item">노무상담</a></li>
          <li><a href="#" class="menu-item">회원학습</a></li>
          <li><a href="#" class="menu-item">회원등급</a></li>
        </ul>
      </div>

      <!-- 기타 메뉴들 -->
      <div class="menu-section">
        <div class="menu-header collapsed">
          <span class="menu-title">사업</span>
          <button class="expand-btn">
            ▼
          </button>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-header collapsed">
          <span class="menu-title">정보</span>
          <button class="expand-btn">
            ▼
          </button>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-header collapsed">
          <span class="menu-title">연구</span>
          <button class="expand-btn">
            ▼
          </button>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-header collapsed">
          <span class="menu-title">협회</span>
          <button class="expand-btn">
            ▼
          </button>
        </div>
      </div>
    </aside>

    <!-- 우측 메인 콘텐츠 -->
    <main class="main-content">
      <!-- 페이지 제목과 브레드크럼 -->
      <header class="content-header">
        <h1 class="page-title">
          공지사항
        </h1>
        <nav class="breadcrumb">
          <span>🏠</span>
          <span>소통</span>
          <span>공지사항</span>
        </nav>
        <button class="write-btn">
          글쓰기
        </button>
      </header>

      <!-- 게시판 탭 -->
      <div class="board-tabs">
        <button class="tab active">
          전체
        </button>
        <button class="tab">
          제목
        </button>
        <button class="tab">
          입찰
        </button>
        <button class="tab">
          모집
        </button>
        <button class="tab">
          행사
        </button>
        <button class="tab">
          홍보
        </button>
        <button class="tab">
          자격
        </button>
        <button class="tab">
          교육
        </button>
      </div>

      <!-- 검색 영역 -->
      <div class="search-section">
        <select class="search-type">
          <option>제목</option>
          <option>내용</option>
        </select>
        <input type="text" placeholder="검색어를 입력하세요" class="search-input">
        <button class="search-btn">
          🔍 검색
        </button>
      </div>

      <!-- 게시글 목록 테이블 -->
      <div class="board-table">
        <table>
          <thead>
            <tr>
              <th width="80">
                번호
              </th>
              <th width="100">
                분류
              </th>
              <th>제목</th>
              <th width="120">
                등록일
              </th>
              <th width="80">
                첨부파일
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>561571</td>
              <td><span class="category notice">공지</span></td>
              <td class="title">
                <a href="#">등업 테스트</a>
              </td>
              <td>2025.07.28</td>
              <td>-</td>
            </tr>
            <tr>
              <td>561570</td>
              <td><span class="category notice">자격</span></td>
              <td class="title">
                <a href="#">한글 테스트</a>
              </td>
              <td>2025.08.07</td>
              <td>-</td>
            </tr>
            <tr>
              <td>561569</td>
              <td><span class="category general">제한</span></td>
              <td class="title">
                <a href="#">testtest_1</a>
              </td>
              <td>2025.06.23</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button>≪</button>
        <button>‹</button>
        <button class="active">
          1
        </button>
        <button>2</button>
        <button>3</button>
        <button>›</button>
        <button>≫</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-layout {
  display: flex;
  gap: 0;
  min-height: 600px;
}

/* 좌측 사이드바 */
.sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e5e7eb;
}

.menu-section {
  border-bottom: 1px solid #f3f4f6;
}

.menu-header {
  background: #4f46e5;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.menu-header.collapsed {
  background: #f8fafc;
  color: #4b5563;
}

.menu-title {
  font-weight: 600;
  font-size: 16px;
}

.expand-btn {
  background: none;
  border: none;
  color: inherit;
  font-size: 12px;
  cursor: pointer;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  display: block;
  padding: 12px 20px;
  color: #374151;
  text-decoration: none;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s;
}

.menu-item:hover {
  background: #f1f5f9;
  color: #1e40af;
}

/* 우측 메인 콘텐츠 */
.main-content {
  flex: 1;
  background: white;
  padding: 30px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e5e7eb;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.breadcrumb {
  display: flex;
  gap: 10px;
  color: #6b7280;
  font-size: 14px;
}

.write-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.board-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
}

.tab {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
}

.tab.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.search-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.search-type {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.search-input {
  flex: 1;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.search-btn {
  padding: 8px 16px;
  background: #374151;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.board-table {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8fafc;
}

th {
  padding: 15px 12px;
  text-align: center;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #f3f4f6;
}

.title {
  text-align: left !important;
}

.title a {
  color: #1f2937;
  text-decoration: none;
}

.title a:hover {
  color: #3b82f6;
  text-decoration: underline;
}

.category {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.category.notice {
  background: #dbeafe;
  color: #1e40af;
}

.category.general {
  background: #fef3c7;
  color: #d97706;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.pagination button {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:hover {
  background: #f3f4f6;
}

.pagination button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
</style>
