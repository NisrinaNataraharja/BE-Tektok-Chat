const pool = require('../config/db')

const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM "user" WHERE email = $1', [email], (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

// const create = ({idUser, email, password, role,}) => {
//   return new Promise((resolve, reject) => {
//     pool.query('INSERT INTO "user"("idUser", email, password, role)VALUES($1, $2, $3, $4)', [idUser, email, password, role] , (error, result) => {
//       if (!error) {
//         resolve(result)
//       } else {
//         reject(error)
//       }
//     })
//   })
// }

const create = ({id, name, email, phone, avatar, password, active}) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO "user" (id, name, email, phone, avatar, password, active)VALUES($1, $2, $3, $4, $5, $6, $7)', [id, name, email, phone, avatar, password, active] , (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const selectUser = ({ limit, offset }) => {
    return pool.query('SELECT * FROM "user" LIMIT $1 OFFSET $2', [limit, offset])
  }
  
//   const insertUser = ({idUser, nameStore, descriptionStore, email, password, role, phone, gender, birthday, name}) => {
//     return pool.query('INSERT INTO "user" ("idUser", "nameStore", "descriptionStore", email, password, role, phone, gender, birthday, name) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [idUser, nameStore, descriptionStore, email, password, role, phone, gender, birthday, name])
//   }
 
//   const updateUser = ({ idUser, nameStore, descriptionStore, email, password, role, phone, gender, birthday, name, id }) => {
//     return pool.query('UPDATE "user" SET "idUser" = $1, "nameStore" = $2, "descriptionStore" = $3, email = $4, password = $5, role = $6, phone = $7, gender = $8, birthday = $9, name = $10 WHERE id = $11', [idUser, nameStore, descriptionStore, email, password, role, phone, gender, birthday, name, id])
//   }
  
  const deleteUser = (id) => {
    return pool.query('DELETE FROM "user" WHERE id = $1', [id])
  }
  
  const countUser = () => {
    return pool.query('SELECT COUNT(*) AS total FROM "user"')
  }
  
  module.exports = {
    findByEmail,
    create,
    selectUser,
    // insertUser,
    // updateUser,
    deleteUser,
    countUser
  }

  // const select = ({ limit, offset }) => {
  //   return new Promise((resolve, reject) => {
  //     pool.query('SELECT * FROM users LIMIT $1 OFFSET $2', [limit, offset], (err, result) => {
  //       if (!err) {
  //         resolve(result)
  //       } else {
  //         reject(new Error(err))
  //       }
  //     })
  //   })
  // }
  
  // const usersDetail = (email) => {
  //   return new Promise((resolve, reject) => {
  //     pool.query(`SELECT * FROM users WHERE email = '${email}';`, (error, result) => {
  //       if (!error) {
  //         resolve(result)
  //       } else {
  //         reject(error)
  //       }
  //     })
  //   })
  // }
  
  // const findByEmail = (email) => {
  //   return new Promise((resolve, reject) => {
  //     pool.query(`SELECT * FROM users WHERE email = '${email}';`, (error, result) => {
  //       if (!error) {
  //         resolve(result)
  //       } else {
  //         reject(error)
  //       }
  //     })
  //   })
  // }
  
  // const insert = ({ id, name, email, userPassword, phone, activationID, photo }) => {
  //   return new Promise((resolve, reject) => {
  //     pool.query('INSERT INTO users(id, name, email, password, phone, status, photo)VALUES($1, $2, $3, $4, $5, $6, $7)', [id, name, email, userPassword, phone, activationID, photo], (err, result) => {
  //       if (!err) {
  //         resolve(result)
  //       } else {
  //         reject(new Error(err))
  //       }
  //     })
  //   })
  // }
  
  // const checkExisting = (emailID) => {
  //   return pool.query(`SELECT COUNT(*) AS total FROM users WHERE email = '${emailID}';`)
  // }
  
  // const activateStatus = ({
  //   firstName,
  //   lastName,
  //   email,
  //   userPassword,
  //   phone,
  //   activationStatus,
  //   gender,
  //   birth,
  //   userAddress,
  //   activatedAt
  // }, emailID) => {
  //   return new Promise((resolve, reject) => {
  //     pool.query(`UPDATE users SET 
  //                 first_name = COALESCE($1, first_name), 
  //                 last_name = COALESCE($2, last_name), 
  //                 email = COALESCE($3, email),  
  //                 user_password = COALESCE($4, user_password),  
  //                 phone = COALESCE($5, phone),  
  //                 id_status = COALESCE($6, id_status),  
  //                 id_gender = COALESCE($7, id_gender),  
  //                 birth = COALESCE($8, birth),  
  //                 user_address = COALESCE($9, user_address) ,
  //                 activated_at = COALESCE($10, activated_at) 
  //                 WHERE email = $11;`, [firstName, lastName, email, userPassword, phone, activationStatus, gender, birth, userAddress, activatedAt, emailID], (err, result) => {
  //       if (!err) {
  //         resolve(result)
  //       } else {
  //         reject(new Error(err))
  //       }
  //     })
  //   })
  // }
  
  // const updateProfile = ({
  //   name,
  //   email,
  //   password,
  //   phone,
  //   activationStatus,
  //   photo,
  //   updatedAt
  // }, emailID) => {
  //   return new Promise((resolve, reject) => {
  //     pool.query(`UPDATE users SET 
  //                 name = COALESCE($1, name), 
  //                 email = COALESCE($2, email),  
  //                 password = COALESCE($3, password),  
  //                 phone = COALESCE($4, phone),  
  //                 status = COALESCE($5, status),  
  //                 photo = COALESCE($6, photo),  
  //                 updated_at = COALESCE($7, updated_at) 
  //                 WHERE email = $8;`, [name, email, password, phone, activationStatus, photo, updatedAt, emailID], (err, result) => {
  //       if (!err) {
  //         resolve(result)
  //       } else {
  //         reject(new Error(err))
  //       }
  //     })
  //   })
  // }
  
  // const countUser = () => {
  //   return pool.query('SELECT COUNT(*) AS total FROM users')
  // }
  
  // const deleteUsers = (emailid) => {
  //   return pool.query('DELETE FROM users WHERE email = $1', [emailid])
  // }
  
  // module.exports = {
  //   select,
  //   insert,
  //   deleteUsers,
  //   updateProfile,
  //   countUser,
  //   checkExisting,
  //   findByEmail,
  //   usersDetail,
  //   activateStatus
  // }