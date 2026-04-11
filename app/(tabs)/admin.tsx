import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native'
import { ScreenContainer } from '@/components/screen-container'
import { useColors } from '@/hooks/use-colors'
import { cn } from '@/lib/utils'

interface User {
  id: string
  email: string
  name: string
  status: 'pending' | 'approved' | 'blocked'
  createdAt: string
}

export default function AdminScreen() {
  const colors = useColors()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'blocked'>('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, filterStatus])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/pwa-auth/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data.users) {
        // Transform API response to UI format
        const transformedUsers = data.users.map((u: any) => ({
          id: u.id || u.email,
          email: u.email,
          name: u.name,
          status: u.isApproved ? 'approved' : 'pending',
          createdAt: u.createdAt || new Date().toISOString(),
        }))
        setUsers(transformedUsers)
      } else {
        Alert.alert('Erro', 'Falha ao carregar usuários')
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao conectar com o servidor')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((u) => u.status === filterStatus)
    }

    setFilteredUsers(filtered)
  }

  const updateUserStatus = async (userId: string, newStatus: 'approved' | 'blocked') => {
    try {
      const user = users.find((u) => u.id === userId)
      if (!user) return

      const endpoint = newStatus === 'approved' ? '/api/pwa-auth/approve' : '/api/pwa-auth/reject'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, reason: newStatus === 'blocked' ? 'Bloqueado pelo administrador' : undefined }),
      })

      const data = await response.json()

      if (data.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)))
        Alert.alert('Sucesso', `Usuário ${newStatus === 'approved' ? 'aprovado' : 'bloqueado'}`)
      } else {
        Alert.alert('Erro', data.error || 'Falha ao atualizar usuário')
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao conectar com o servidor')
      console.error(error)
    }
  }

  const deleteUser = async (userId: string) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar este usuário?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Deletar',
        onPress: async () => {
          try {
            const user = users.find((u) => u.id === userId)
            if (!user) return

            const response = await fetch(`/api/pwa-auth/user/${encodeURIComponent(user.email)}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            })

            const data = await response.json()

            if (data.success) {
              setUsers(users.filter((u) => u.id !== userId))
              Alert.alert('Sucesso', 'Usuário deletado')
            } else {
              Alert.alert('Erro', data.error || 'Falha ao deletar usuário')
            }
          } catch (error) {
            Alert.alert('Erro', 'Falha ao conectar com o servidor')
            console.error(error)
          }
        },
      },
    ])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return colors.success
      case 'blocked':
        return colors.error
      case 'pending':
        return colors.warning
      default:
        return colors.muted
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado'
      case 'blocked':
        return 'Bloqueado'
      case 'pending':
        return 'Pendente'
      default:
        return status
    }
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Painel de Admin</Text>
          <Text className="text-muted">Gerenciar usuários e whitelist</Text>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-surface p-4 rounded-lg border border-border">
            <Text className="text-2xl font-bold text-foreground">{users.length}</Text>
            <Text className="text-xs text-muted mt-1">Total de Usuários</Text>
          </View>
          <View className="flex-1 bg-surface p-4 rounded-lg border border-border">
            <Text className="text-2xl font-bold text-warning">
              {users.filter((u) => u.status === 'pending').length}
            </Text>
            <Text className="text-xs text-muted mt-1">Pendentes</Text>
          </View>
          <View className="flex-1 bg-surface p-4 rounded-lg border border-border">
            <Text className="text-2xl font-bold text-success">
              {users.filter((u) => u.status === 'approved').length}
            </Text>
            <Text className="text-xs text-muted mt-1">Aprovados</Text>
          </View>
        </View>

        {/* Search and Filter */}
        <View className="mb-6 gap-3">
          <TextInput
            placeholder="Buscar por email ou nome..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            className="bg-surface border border-border rounded-lg p-3 text-foreground"
            placeholderTextColor={colors.muted}
          />

          {/* Status Filter Buttons */}
          <View className="flex-row gap-2">
            {(['all', 'pending', 'approved', 'blocked'] as const).map((status) => (
              <Pressable
                key={status}
                onPress={() => setFilterStatus(status)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg border',
                  filterStatus === status
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold text-center',
                    filterStatus === status ? 'text-white' : 'text-foreground'
                  )}
                >
                  {status === 'all' ? 'Todos' : status === 'pending' ? 'Pendentes' : status === 'approved' ? 'Aprovados' : 'Bloqueados'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Users List */}
        <View className="gap-3">
          {isLoading ? (
            <View className="py-8 items-center">
              <Text className="text-muted">Carregando usuários...</Text>
            </View>
          ) : filteredUsers.length === 0 ? (
            <View className="py-8 items-center bg-surface rounded-lg border border-border">
              <Text className="text-muted">Nenhum usuário encontrado</Text>
            </View>
          ) : (
            filteredUsers.map((user) => (
              <View key={user.id} className="bg-surface p-4 rounded-lg border border-border">
                {/* User Info */}
                <View className="mb-3">
                  <Text className="text-lg font-semibold text-foreground">{user.name}</Text>
                  <Text className="text-sm text-muted">{user.email}</Text>
                  <View className="flex-row items-center gap-2 mt-2">
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    />
                    <Text className="text-xs text-muted">{getStatusLabel(user.status)}</Text>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-2">
                  {user.status === 'pending' && (
                    <>
                      <Pressable
                        onPress={() => updateUserStatus(user.id, 'approved')}
                        className="flex-1 bg-success py-2 px-3 rounded-lg"
                      >
                        <Text className="text-white text-xs font-semibold text-center">Aprovar</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => updateUserStatus(user.id, 'blocked')}
                        className="flex-1 bg-error py-2 px-3 rounded-lg"
                      >
                        <Text className="text-white text-xs font-semibold text-center">Rejeitar</Text>
                      </Pressable>
                    </>
                  )}

                  {user.status === 'approved' && (
                    <Pressable
                      onPress={() => updateUserStatus(user.id, 'blocked')}
                      className="flex-1 bg-warning py-2 px-3 rounded-lg"
                    >
                      <Text className="text-white text-xs font-semibold text-center">Bloquear</Text>
                    </Pressable>
                  )}

                  {user.status === 'blocked' && (
                    <Pressable
                      onPress={() => updateUserStatus(user.id, 'approved')}
                      className="flex-1 bg-success py-2 px-3 rounded-lg"
                    >
                      <Text className="text-white text-xs font-semibold text-center">Desbloquear</Text>
                    </Pressable>
                  )}

                  <Pressable
                    onPress={() => deleteUser(user.id)}
                    className="flex-1 bg-border py-2 px-3 rounded-lg"
                  >
                    <Text className="text-foreground text-xs font-semibold text-center">Deletar</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Refresh Button */}
        <Pressable
          onPress={fetchUsers}
          className="mt-6 bg-primary py-3 px-4 rounded-lg"
        >
          <Text className="text-white font-semibold text-center">Atualizar</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  )
}
