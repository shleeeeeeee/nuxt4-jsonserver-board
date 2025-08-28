export interface Post {
    id: string | number  // ID를 string 또는 number로 처리
    title: string
    content: string
    author: string
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

    // 게시글 목록 조회 (JSON Server 1.0.0-beta.3 형식)
    async getPosts(params: PostListParams = {}): Promise<PostListResponse> {
        const { page = 1, limit = 10, category, search, searchField = 'title' } = params

        const queryParams = new URLSearchParams({
            _page: page.toString(),
            _per_page: limit.toString(),
            _sort: 'createdAt',
            _order: 'desc'
        })

        if (category && category !== '전체') {
            queryParams.append('category', category)
        }

        if (search?.trim()) {
            queryParams.append(`${searchField}_like`, search.trim())
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
        // ID 생성 (랜덤 4자리 문자열)
        const generateId = () => Math.random().toString(36).substring(2, 6)

        const newPost = {
            id: generateId(),
            ...data,
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