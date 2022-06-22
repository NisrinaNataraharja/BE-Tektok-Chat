const pool = require('../config/db')

// const selectRecipeWithCondition = ({ limit, offset, sortBy, sortOrder, search }) => {
//   return new Promise((resolve, reject) => {
//     pool.query(`SELECT recipes.* FROM recipes INNER JOIN "user" ON recipes.id_user = "user".id WHERE title ILIKE '%${search}%' ORDER BY ${sortBy} ${sortOrder} LIMIT $1 OFFSET $2`, [limit, offset], (err, result) => {
//       if (!err) {
//         resolve(result)
//       } else {
//         reject(new Error(err))
//       }
//     })
//   })
// }

const selectRecipeWithCondition = (condition) => {
  //console.log(condition);
  return pool.query(`
  SELECT r.*
  FROM recipes r  
  LEFT JOIN "user" u on r.id_user = u.id
  WHERE r.title ILIKE '%${condition.search}%' 
  GROUP BY r.id, r.title, u.name, r.ingredients, r.image, r.video, r."like", r.create_at
  ORDER BY ${condition.sort} ${condition.order}
  LIMIT ${condition.limit} OFFSET ${condition.offset}
  `)
}

// SELECT p.*
//   FROM products p  
//   LEFT JOIN category c on p.categoryid = c."idCategory"
//   WHERE p.nameproduct ILIKE '%${condition.search}%' 
//   GROUP BY p.id, p.nameproduct, c."categoryName", p.description, p.rating, p.price, p.stock, p.condition, p.seller, p.brand, p.status
//   ORDER BY ${condition.sort} ${condition.order}
//   LIMIT ${condition.limit} OFFSET ${condition.offset}

const insertRecipe = ({ id, id_user, ingredients, title, image, video, like, create_at }) => {
  return pool.query('INSERT INTO recipes (id, id_user, ingredients, title, image, video, "like", create_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [id, id_user, ingredients, title, image, video, like, create_at])
}

const updateRecipe = ({ingredients, title, image, video, like, create_at, id}) => {
  return pool.query(`UPDATE products SET  
  ingredients = COALESCE($1, ingredients),
  title = COALESCE(2, title),
  image = COALESCE($3, image), 
  video = COALESCE($4, video), 
  "like" = COALESCE($5, "like"), 
  create_at = COALESCE($6, create_at), WHERE id = $7;`, [ingredients, title, image, video, like, create_at, id])
}

const deleteRecipe = (id) => {
  return pool.query('DELETE FROM products WHERE id = $1', [id])
}

const countRecipe = () => {
  return pool.query('SELECT COUNT(*) AS total FROM recipes')
}

module.exports = {
  ///selectProducts,
  selectRecipeWithCondition,
  updateRecipe,
  insertRecipe,
  deleteRecipe,
  countRecipe
}

// const getAllRecipe = ({ limit, offset, sortBy, sortOrder, search }) => {
//   return new Promise((resolve, reject) => {
//     pool.query(`SELECT recipes.*, assets.image AS photo, assets.video, users.name AS recipe_by FROM recipes INNER JOIN assets ON recipes.id = assets.id_recipe INNER JOIN users ON recipes.id_user = users.id WHERE title ILIKE '%${search}%' ORDER BY ${sortBy} ${sortOrder} LIMIT $1 OFFSET $2`, [limit, offset], (err, result) => {
//       if (!err) {
//         resolve(result)
//       } else {
//         reject(new Error(err))
//       }
//     })
//   })
// }

// const countRecipes = () => {
//   return pool.query('SELECT COUNT(*) AS total FROM recipes')
// }

// const insertRecipeData = ({ id, idUser, title, ingredients }) => {
//   return new Promise((resolve, reject) => {
//     pool.query('INSERT INTO recipes(id, id_user, title, ingredients)VALUES($1, $2, $3, $4)', [id, idUser, title, ingredients], (err, result) => {
//       if (!err) {
//         resolve(result)
//       } else {
//         reject(new Error(err))
//       }
//     })
//   })
// }

// const insertRecipeAssets = ({ idRecipe, photo, video }) => {
//   return new Promise((resolve, reject) => {
//     pool.query('INSERT INTO assets(id_recipe, image, video)VALUES($1, $2, $3)', [idRecipe, photo, video], (err, result) => {
//       if (!err) {
//         resolve(result)
//       } else {
//         reject(new Error(err))
//       }
//     })
//   })
// }

// const recipeDetail = (recipeID) => {
//   return new Promise((resolve, reject) => {
//     pool.query(`SELECT recipes.*, assets.image AS photo, assets.video, users.name AS recipe_by FROM recipes INNER JOIN assets ON recipes.id = assets.id_recipe INNER JOIN users ON recipes.id_user = users.id WHERE recipes.id = '${recipeID}';`, (error, result) => {
//       if (!error) {
//         resolve(result)
//       } else {
//         reject(error)
//       }
//     })
//   })
// }

// const updateRecipeData = ({ title, ingredients, updatedAt }, recipeID, userID) => {
//   return new Promise((resolve, reject) => {
//     pool.query(`UPDATE recipes SET 
//                 title = COALESCE($1, title), 
//                 ingredients = COALESCE($2, ingredients),   
//                 updated_at = COALESCE($3, updated_at) 
//                 WHERE id = $4 AND id_user = $5;`, [title, ingredients, updatedAt, recipeID, userID], (err, result) => {
//       if (!err) {
//         resolve(result)
//       } else {
//         reject(new Error(err))
//       }
//     })
//   })
// }

// const checkExisting = (recipeID) => {
//   return pool.query(`SELECT COUNT(*) AS total FROM recipes WHERE id = '${recipeID}';`)
// }

// const updateRecipeAssets = ({ photo, video, updatedAt }, recipeID) => {
//   return new Promise((resolve, reject) => {
//     pool.query(`UPDATE assets SET 
//                 image = COALESCE($1, image), 
//                 video = COALESCE($2, video),   
//                 updated_at = COALESCE($3, updated_at) 
//                 WHERE id_recipe = $4;`, [photo, video, updatedAt, recipeID], (err, result) => {
//       if (!err) {
//         resolve(result)
//       } else {
//         reject(new Error(err))
//       }
//     })
//   })
// }

// const deleteRecipeData = (recipeID) => {
//   return pool.query('DELETE FROM recipes WHERE id = $1', [recipeID])
// }

// const deleteRecipeAssets = (recipeID) => {
//   return pool.query('DELETE FROM assets WHERE id_recipe = $1', [recipeID])
// }

// module.exports = {
//   getAllRecipe,
//   countRecipes,
//   insertRecipeData,
//   insertRecipeAssets,
//   recipeDetail,
//   updateRecipeData,
//   updateRecipeAssets,
//   checkExisting,
//   deleteRecipeData,
//   deleteRecipeAssets
// }