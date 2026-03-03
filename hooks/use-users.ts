import api from '@/lib/api'
import { AdminUserResponse, ManageUsersResult, User } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Hook to fetch Users (Admin) - using new response format
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users')
      const allData = data.users || []

      return allData.map((u: AdminUserResponse) => {
        const roles = (u.roles || [])
          .map((r) => r.role?.name)
          .filter(Boolean) as string[]

        return {
          ...u,
          citizenId: u.citizenId || '',
          roles: roles.length > 0 ? roles : ['ROLE_VOTER'],
        } as User
      })
    },
  })
}

// Hook for Admin Users Page with server-side pagination
export function useManageUsers(params: {
  role?: string | null
  page?: number
  limit?: number
}) {
  const { role, page = 1, limit = 10 } = params

  return useQuery<ManageUsersResult>({
    queryKey: ['manage-users', role, page, limit],
    queryFn: async () => {
      // Server-side pagination and filtering
      const { data } = await api.get('/admin/users', {
        params: {
          page,
          limit,
          search: role && role.trim() ? role.trim() : undefined,
        },
      })

      // Backend returns { total, users: [], page, limit, totalPages }
      const usersData = data.users || []

      const users = usersData.map((u: AdminUserResponse) => {
        // Handle roles from API - { role: { id, name } }[]
        const roles = (u.roles || [])
          .map((r) => r.role?.name)
          .filter(Boolean) as string[]

        return {
          id: u.id,
          citizenId: u.citizenId || '',
          firstName: u.firstName,
          lastName: u.lastName,
          address: u.address,
          roles: roles.length > 0 ? roles : ['ROLE_VOTER'],
          createdAt: u.createdAt,
        } as User
      })

      const total = data.total ?? users.length

      return {
        users,
        meta: {
          total,
          page: data.page ?? page,
          limit: data.limit ?? limit,
          totalPages: data.totalPages ?? Math.max(1, Math.ceil(total / limit)),
        },
      }
    },
  })
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      // POST /admin/users/:userId/roles with { roleName: "ROLE_XXX" }
      await api.post(`/admin/users/${userId}/roles`, { roleName: role })
    },
    onSuccess: () => {
      toast.success('อัปเดตสิทธิ์สำเร็จ')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['manage-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
    onError: () => toast.error('อัปเดตไม่สำเร็จ'),
  })
}
