import React, { useState, useCallback, useEffect } from 'react'
import { Typography, Drawer, Button, Box } from '@mui/material'
import SearchComponent from 'modules/common/Search.component'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { getUsers, useSendPasswordResetEmail } from 'services/user'
import { User } from 'models/user'
import { useIsMobile, toLowerCaseNonAccentVietnamese } from 'utils/common'
import { Role, UserAction } from 'constant/common'
import { useAuthentication } from 'contexts/AuthContext'
import UserTableComponent from 'modules/user-table/UserTable.component'
import UserDialogComponent from 'modules/user-dialog/UserDialog.component'
import ChangePasswordDialogComponent from 'modules/user-dialog/ChangePasswordDialog.component'
import PermissionDialogComponent from 'modules/user-dialog/PermissionDialog.component'
import UpdateInfoDialogComponent from 'modules/user-dialog/UpdateInfoDialog.component'
import UserSingleViewComponent from 'modules/user-single-view/UserSingleViewComponent'
import UserProfilePanelComponent from 'modules/user-drawer/UserProfilePanel.component'



const UserComponent = () => {
  const isMobile = useIsMobile()
  const sendPasswordResetEmail = useSendPasswordResetEmail()
  const [users, setUsers] = useState<User[]>()
  const [filteredUsers, setFilteredUsers] = useState<User[]>()
  const [isOpenUserDialog, openUserDialog] = useState<boolean>(false)
  const [isOpenChangePasswordDialog, openChangePasswordDialog] = useState<boolean>(false)
  const [isOpenPermissionDialog, openPermissionDialog] = useState<boolean>(false)
  const [isOpenUpdateInfoDialog, openUpdateInfoDialog] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User>()
  const [openUserDrawer, setOpenUserDrawer] = useState<boolean>(false)
  const { user } = useAuthentication()

  const handleFilterUserByName = (value: string) => {
    if (users && users.length !== 0) {
      if (!value) {
        setFilteredUsers(users)
        return
      }

      const filtered = users.filter((user) => {
        const keywordArr = [...user.lastName.split(' '), ...user.firstName.split(' ')].map(
          (keyword) => toLowerCaseNonAccentVietnamese(keyword)
        )
        return keywordArr.includes(value.toLowerCase())
      })
      setFilteredUsers(filtered)
    }
  }

  const fetchUsers = useCallback(() => {
    getUsers().then((res?: User[] | null) => {
      if (res && res.length !== 0) {
        setUsers(res)
        setFilteredUsers(res)
      }
    })
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCloseDialog = (isRefreshUsers?: boolean) => {
    if (isRefreshUsers) {
      setTimeout(() => {
        fetchUsers()
      }, 0)
    }
    openUserDialog(false)
    openPermissionDialog(false)
    openUpdateInfoDialog(false)
    setSelectedUser(undefined)
  }

  const handleClickAction = (action: string, selectedRow: User) => {
    if (!selectedRow) {
      return
    }
    setSelectedUser(selectedRow)
    switch (action) {
      case UserAction.GRANT_PERMISSION: {
        return openPermissionDialog(true)
      }
      case UserAction.RESET_PASSWORD:
        return sendPasswordResetEmail(selectedRow.email)
      case UserAction.UPDATE_INFO:
        return openUpdateInfoDialog(true)
      case UserAction.CHANGE_PASSWORD:
        return openChangePasswordDialog(true)
      case UserAction.VIEW_PROFILE:
        setSelectedUser(selectedRow)
        return setOpenUserDrawer(true)
    }
  }

  return (
    <Box p={isMobile ? 1 : 2}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
        }}
      >
        <Typography variant={'h1'} sx={{ fontSize: isMobile ? '1rem' : '2rem' }}>
          Giáo Lý Viên
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: isMobile ? 2 : 4,
          gap: isMobile ? 1 : 2,
          marginTop: 1,
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <SearchComponent onChange={handleFilterUserByName} label={'Tìm Tên GLV'} />
        </Box>
        {user?.role === Role.CTO && (
          <Button
            sx={{ width: '100%', maxWidth: 'fit-content' }}
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={() => openUserDialog(true)}
          >
            Thêm GLV
          </Button>
        )}
      </Box>
      <Box>
        {isMobile ? (
          <UserSingleViewComponent users={filteredUsers || []} onClickAction={handleClickAction} />
        ) : (
          <UserTableComponent rows={filteredUsers || []} onClickAction={handleClickAction} />
        )}
      </Box>
      <UserDialogComponent onClose={handleCloseDialog} isOpen={isOpenUserDialog} />
      <ChangePasswordDialogComponent
        onClose={() => openChangePasswordDialog(false)}
        isOpen={isOpenChangePasswordDialog}
      />
      {selectedUser && (
        <>
          <PermissionDialogComponent
            onClose={handleCloseDialog}
            isOpen={isOpenPermissionDialog}
            selectedUser={selectedUser}
          />
          <UpdateInfoDialogComponent
            onClose={handleCloseDialog}
            isOpen={isOpenUpdateInfoDialog}
            user={selectedUser}
          />
        </>
      )}
      <Drawer anchor={'right'} open={openUserDrawer} onClose={() => setOpenUserDrawer(false)}>
        {selectedUser && (
          <UserProfilePanelComponent
            profile={selectedUser}
            onClose={() => setOpenUserDrawer(false)}
          />
        )}
      </Drawer>
    </Box>
  )
}

export default UserComponent
