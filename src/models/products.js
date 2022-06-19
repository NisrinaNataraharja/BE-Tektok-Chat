const pool = require('../config/db')

// const selectProducts = ({ limit, offset }) => {
//   return pool.query('SELECT * FROM products LIMIT $1 OFFSET $2', [limit, offset])
// }

const selectProductWithCondition = (condition) => {
  //console.log(condition);
  return pool.query(`
  SELECT p.*
  FROM products p  
  LEFT JOIN category c on p.categoryid = c."idCategory"
  WHERE p.nameproduct ILIKE '%${condition.search}%' 
  GROUP BY p.id, p.nameproduct, c."categoryName", p.description, p.rating, p.price, p.stock, p.condition, p.seller, p.brand, p.status
  ORDER BY ${condition.sort} ${condition.order}
  LIMIT ${condition.limit} OFFSET ${condition.offset}
  `)
}

const insertProducts = ({ categoryid, nameproduct, description, rating, price, stock, size, color, condition, seller, brand, status, isarchieve, created_at, image }) => {
  return pool.query('INSERT INTO products (categoryid, nameproduct, description, rating, price, stock, size, color, condition, seller, brand, status, isarchieve, created_at, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)', [categoryid, nameproduct, description, rating, price, stock, size, color, condition, seller, brand, status, isarchieve, created_at, image])
}

const updateProducts = ({categoryid, nameproduct, description, rating, price, stock, size, color, condition, seller, brand, status, isarchieve, created_at, image, id}) => {
  return pool.query(`UPDATE products SET categoryid = COALESCE($1, categoryid), 
  nameproduct = COALESCE($2, nameproduct),
  description = COALESCE($3, description),
  rating = COALESCE($4, rating), 
  price = COALESCE($5, price), 
  stock = COALESCE($6, stock), 
  size = COALESCE($7, size), 
  color = COALESCE($8, color), 
  condition = COALESCE($9, condition), 
  seller = COALESCE($10, seller), 
  brand = COALESCE($11, brand), 
  status = COALESCE($12, status), 
  isarchieve = COALESCE($13, isarchieve), 
  created_at = COALESCE($14, created_at), 
  image = COALESCE($15, image) WHERE id = $16;`, [categoryid, nameproduct, description, rating, price, stock, size, color, condition, seller, brand, status, isarchieve, created_at, image, id])
}

const deleteProducts = (id) => {
  return pool.query('DELETE FROM products WHERE id = $1', [id])
}

const countProducts = () => {
  return pool.query('SELECT COUNT(*) AS total FROM products')
}

module.exports = {
  ///selectProducts,
  selectProductWithCondition,
  updateProducts,
  insertProducts,
  deleteProducts,
  countProducts
}