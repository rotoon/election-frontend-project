import api from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'
import {
  AuthResponse,
  LoginUserInput,
  MeResponse,
  RegisterUserInput,
} from '@/types/auth'
import { User } from '@/types/user'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Cookie helper functions
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

function removeCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

// Backend wraps all responses in { ok: boolean, data: T }
interface ApiResponse<T> {
  ok: boolean
  data: T
}

export function useLoginMutation() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: async (credentials: LoginUserInput) => {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials)
      return data
    },
    onSuccess: async (data) => {
      // Save token to both cookie (for middleware) and localStorage (for Zustand persist)
      setCookie('auth-token', data.accessToken)
      setToken(data.accessToken)

      try {
        // Temporarily disable the 401 interceptor's logout toprevent cookie removal during login flow
        const { data: res } = await api.get<MeResponse>('/auth/me')
        const me = res

        const userForStore: User = {
          id: me.id,
          citizenId: me.citizenId,
          firstName: me.firstName,
          lastName: me.lastName,
          address: me.address,
          province: me.province,
          district: me.district,
          constituency: me.constituency,
          roles: me.roles,
          createdAt: me.createdAt,
        }

        setUser(userForStore)
        toast.success('เข้าสู่ระบบสำเร็จ')

        const roles = me.roles || []

        // Multi-role redirect
        if (roles.length > 1) {
          router.push('/portal')
          return
        }

        // Single-role redirect
        if (roles.includes('ROLE_ADMIN')) router.push('/admin/constituencies')
        else if (roles.includes('ROLE_EC')) router.push('/ec/parties')
        else router.push('/vote')
      } catch (error) {
        console.error('Failed to fetch user details:', error)
        // Clear auth state on /auth/me failure since the token is invalid
        logout()
        toast.error('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        router.push('/auth')
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ')
    },
  })
}

export function useRegisterMutation(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (userData: RegisterUserInput) => {
      const { data } = await api.post('/auth/register', userData)
      return data
    },
    onSuccess: () => {
      toast.success('ลงทะเบียนสำเร็จ!')
      onSuccess?.()
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'การลงทะเบียนล้มเหลว')
    },
  })
}

export function useMeQuery() {
  const token = useAuthStore((state) => state.token)
  return useQuery({
    queryKey: ['me', token],
    queryFn: async () => {
      const { data: res } = await api.get<ApiResponse<MeResponse>>('/auth/me')
      return res.data
    },
    enabled: !!token,
  })
}
