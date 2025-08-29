export interface Post {
    id: string | number
    title: string
    content: string
    author: string
    authorId?: string
    category: string
    createdAt: string
    views: number
    hasFile: boolean
}

export interface PostCreateData {
    title: string
    content: string
    author: string
    category: string
}

export interface PostUpdateData extends PostCreateData {
    views?: number
}

export interface PostListParams {
    page?: number
    limit?: number
    category?: string
    search?: string
    searchField?: 'title' | 'content' | 'author'
}

export interface PostListResponse {
    data: Post[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export class ApiService {
    private getBaseURL(): string {
        return process.client ? '/api' : 'http://localhost:4000'
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const baseURL = this.getBaseURL()
        const url = `${baseURL}${endpoint}`

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('API 요청 오류:', error)
            throw error
        }
    }

    // 게시글 목록 조회 - 검색이 있을 때만 특별 처리
    async getPosts(params: PostListParams = {}): Promise<PostListResponse> {
        const { page = 1, limit = 10, category, search, searchField = 'title' } = params

        // 검색어가 있을 경우 - 전체 데이터를 가져와서 클라이언트에서 필터링
        if (search && search.trim()) {
            // 전체 데이터 가져오기
            let url = '/posts'
            if (category && category !== '전체') {
                url += `?category=${category}`
            }

            const allPosts = await this.request<Post[]>(url)

            // 클라이언트에서 검색 필터링
            const searchTerm = search.trim().toLowerCase()
            const filteredPosts = allPosts.filter(post => {
                const fieldValue = String(post[searchField] || '').toLowerCase()
                return fieldValue.includes(searchTerm)
            })

            // 정렬 (최신순)
            filteredPosts.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime()
                const dateB = new Date(b.createdAt).getTime()
                return dateB - dateA
            })

            // 페이지네이션
            const total = filteredPosts.length
            const totalPages = Math.ceil(total / limit)
            const start = (page - 1) * limit
            const paginatedPosts = filteredPosts.slice(start, start + limit)

            return {
                data: paginatedPosts,
                pagination: {
                    page: page,
                    limit: limit,
                    total: total,
                    totalPages: totalPages
                }
            }
        }

        // 검색어가 없을 경우 - 기존 방식 그대로
        const queryParams = new URLSearchParams({
            _page: page.toString(),
            _per_page: limit.toString(),
            _sort: 'createdAt',
            _order: 'desc'
        })

        if (category && category !== '전체') {
            queryParams.append('category', category)
        }

        const response = await this.request<{
            data: Post[]
            first: number
            prev: number | null
            next: number | null
            last: number
            pages: number
            items: number
        }>(`/posts?${queryParams.toString()}`)

        return {
            data: response.data,
            pagination: {
                page: page,
                limit: limit,
                total: response.items,
                totalPages: response.pages
            }
        }
    }

    async getPost(id: string | number): Promise<Post> {
        const post = await this.request<Post>(`/posts/${id}`)

        const updatedPost = { ...post, views: post.views + 1 }

        try {
            await this.request<Post>(`/posts/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ views: updatedPost.views })
            })
        } catch (error) {
            console.warn('조회수 업데이트 실패:', error)
        }

        return updatedPost
    }

    async createPost(data: PostCreateData): Promise<Post> {
        // 작성자 ID 가져오기 (없으면 생성)
        let authorId = localStorage.getItem('userId')
        if (!authorId) {
            authorId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
            localStorage.setItem('userId', authorId)
        }

        // 게시글 ID 생성 (기존 코드)
        const generateId = async () => {
            // ... 기존 순차 ID 생성 코드
        }

        const newPost = {
            id: await generateId(),
            ...data,
            authorId: authorId,  // ← 추가!
            createdAt: new Date().toISOString(),
            views: 0,
            hasFile: false
        }

        return await this.request<Post>('/posts', {
            method: 'POST',
            body: JSON.stringify(newPost)
        })
    }

    async updatePost(id: string | number, data: Partial<PostUpdateData>): Promise<Post> {
        return await this.request<Post>(`/posts/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        })
    }

    async deletePost(id: string | number): Promise<void> {
        await this.request(`/posts/${id}`, {
            method: 'DELETE'
        })
    }

    async getCategories(): Promise<string[]> {
        try {
            // 페이지네이션 없이 전체 데이터 가져오기
            const response = await this.request<{ data: Post[] }>('/posts?_per_page=1000')
            const posts = response.data
            const categories = [...new Set(posts.map(post => post.category))]
            return ['전체', ...categories.filter(cat => cat !== '전체')]
        } catch (error) {
            return ['전체', '교육', '홍보', '자격', '행사', '채용', '공지']
        }
    }
}

let _apiService: ApiService | null = null

export const getApiService = (): ApiService => {
    if (!_apiService) {
        _apiService = new ApiService()
    }
    return _apiService
}

export const apiService = getApiService()