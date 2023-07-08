import React, { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import SearchComponent from 'modules/common/Search.component'
import Button from '@mui/material/Button'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { getUsers, useSendPasswordResetEmail } from 'services/user'
import UserTableComponent from 'modules/user-table/UserTable.component'
import UserDialogComponent from 'modules/user-dialog/UserDialog.component'
import { User } from 'models/user'
import { UserAction } from 'constant/common'
import ChangePasswordDialogComponent from 'modules/user-dialog/ChangePasswordDialog.component'
import PermissionDialogComponent from 'modules/user-dialog/PermissionDialog.component'
import UpdateInfoDialogComponent from 'modules/user-dialog/UpdateInfoDialog.component'
import { useIsMobile } from 'utils/common'

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
  const handleFilterUserByName = (value: string) => {
    console.log(value)
    console.log(users)
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
      fetchUsers()
    }
    openUserDialog(false)
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
    }
  }

  const handleCloseUpdateDialog = (refreshData?: boolean) => {
    openUpdateInfoDialog(false)
    if (refreshData) {
      fetchUsers()
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
          {' '}
          Thông Tin GLV
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
        <Box>
          <SearchComponent onChange={handleFilterUserByName} label={'Tìm Tên GLV'} />
        </Box>
        <Button
          sx={{ width: '100%', maxWidth: 'fit-content' }}
          variant="contained"
          startIcon={<AssignmentIcon />}
          onClick={useCallback(() => openUserDialog(true), [])}
        >
          Thêm GLV
        </Button>
      </Box>
      <Box>
        <UserTableComponent rows={filteredUsers || []} onClickAction={handleClickAction} />
      </Box>
      <UserDialogComponent onClose={handleCloseDialog} isOpen={isOpenUserDialog} />
      <ChangePasswordDialogComponent
        onClose={() => openChangePasswordDialog(false)}
        isOpen={isOpenChangePasswordDialog}
      />
      {selectedUser && (
        <>
          <PermissionDialogComponent
            onClose={() => openPermissionDialog(false)}
            isOpen={isOpenPermissionDialog}
            selectedUser={selectedUser}
          />
          <UpdateInfoDialogComponent
            onClose={handleCloseUpdateDialog}
            isOpen={isOpenUpdateInfoDialog}
            user={selectedUser}
          />
        </>
      )}
    </Box>
  )
}

export default UserComponent
