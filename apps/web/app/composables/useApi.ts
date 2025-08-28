import { ref, readonly } from 'vue'
import { getApiService } from '~/services/api'
import type { PostListParams, PostCreateData, PostUpdateData } from '~/services/api'

export const useApi = () => {
    const apiService = getApiService()

    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // 에러 처리 헬퍼
    const handleError = (err: any): string => {
        console.error('API 오류:', err)

        if (err?.status === 404) {
            return '요청한 데이터를 찾을 수 없습니다.'
        } else if (err?.status === 500) {
            return '서버 오류가 발생했습니다.'
        } else if (err?.message?.includes('404')) {
            return '데이터를 찾을 수 없습니다.'
        } else if (err?.message) {
            return err.message
        } else {
            return '알 수 없는 오류가 발생했습니다.'
        }
    }

    // 게시글 목록 조회
    const fetchPosts = async (params?: PostListParams) => {
        try {
            isLoading.value = true
            error.value = null
            const response = await apiService.getPosts(params)
            return response
        } catch (err) {
            error.value = handleError(err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 게시글 상세 조회
    const fetchPost = async (id: string | number) => {
        try {
            isLoading.value = true
            error.value = null
            const post = await apiService.getPost(id)
            return post
        } catch (err) {
            error.value = handleError(err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 게시글 생성
    const createPost = async (data: PostCreateData) => {
        try {
            isLoading.value = true
            error.value = null
            const post = await apiService.createPost(data)
            return post
        } catch (err) {
            error.value = handleError(err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 게시글 수정
    const updatePost = async (id: string | number, data: Partial<PostUpdateData>) => {
        try {
            isLoading.value = true
            error.value = null
            const post = await apiService.updatePost(id, data)
            return post
        } catch (err) {
            error.value = handleError(err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 게시글 삭제
    const deletePost = async (id: string | number) => {
        try {
            isLoading.value = true
            error.value = null
            await apiService.deletePost(id)
        } catch (err) {
            error.value = handleError(err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // 카테고리 목록 조회
    const fetchCategories = async () => {
        try {
            const categories = await apiService.getCategories()
            return categories
        } catch (err) {
            console.warn('카테고리 조회 실패:', err)
            return ['전체', '교육', '홍보', '자격', '행사', '채용', '공지']
        }
    }

    return {
        // 상태
        isLoading: readonly(isLoading),
        error: readonly(error),

        // 메서드
        fetchPosts,
        fetchPost,
        createPost,
        updatePost,
        deletePost,
        fetchCategories,

        // 유틸리티
        clearError: () => { error.value = null }
    }
}