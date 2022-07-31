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

const create = ({ id, name, email, phone, password }) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO "user" (id, name, email, phone, password)VALUES($1, $2, $3, $4, $5)', [id, name, email, phone, password], (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const getUsersId = (idUser) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM "user" where id <> $1', [idUser], (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const updateUserProfile = ({ name, email, password, phone, image, updated_at, username, bio, id}) => {
  return new Promise((resolve, reject) => {
    pool.query(`UPDATE "user" SET 
                name = COALESCE($1, name), 
                email = COALESCE($2, email),  
                password = COALESCE($3, password),  
                phone = COALESCE($4, phone),    
                image = COALESCE($5, image),  
                updated_at = COALESCE($6, updated_at),
                username = COALESCE($7, username),
                bio = COALESCE($8, bio)
                WHERE id = $9;`, [name, email, password, phone, image, updated_at, username, bio, id], (err, result) => {
      if (!err) {
        console.log(result)
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const selectUser = ({ limit, offset }) => {
  return pool.query('SELECT * FROM "user" LIMIT $1 OFFSET $2', [limit, offset])
}

const deleteUser = (id) => {
  return pool.query('DELETE FROM "user" WHERE id = $1', [id])
}

const countUser = () => {
  return pool.query('SELECT COUNT(*) AS total FROM "user"')
}

module.exports = {
  findByEmail,
  create,
  getUsersId,
  selectUser,
  updateUserProfile,
  deleteUser,
  countUser
}

