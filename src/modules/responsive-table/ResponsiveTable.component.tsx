import React from 'react'
import styles from './ResponsiveTable.module.scss'
import { useStudentContext } from 'contexts/StudentContext'

const ResponsiveTableComponent = () => {
  const { students } = useStudentContext()

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table>
          <caption>Students table</caption>
          <tr>
            <th>saintName</th>
            <th>firstName</th>
            <th>lastName</th>
            <th>gender</th>
            <th>birthday</th>
            <th>address</th>
          </tr>
          {(students || []).map((stu) => {
            return (
              <tr key={stu.id}>
                <td data-cell={'saintName'}>{stu.saintName}</td>
                <td data-cell={'firstName'}>{stu.firstName}</td>
                <td data-cell={'lastName'}>{stu.lastName}</td>
                <td data-cell={'gender'}>{stu.gender?.toString()}</td>
                <td data-cell={'birthday'}>{stu.birthday}</td>
                <td data-cell={'address'}>{stu.address}</td>
              </tr>
            )
          })}
        </table>
      </div>
    </div>
  )
}

export default ResponsiveTableComponent
