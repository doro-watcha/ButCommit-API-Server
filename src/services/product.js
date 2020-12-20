import { Product } from  '../models'

let instance = null

class ProductService {

    constructor() {
		if (!instance) {
			console.log('Product Service 생성' + this)
			instance = this
		}
		return instance
  }

  async create ( modelObj ){
    return Product.create(modelObj)
  }

  async findOne(where) {
		return await Product.findOne({
			where: JSON.parse(JSON.stringify(where))
		})
	}


}

export default new ProductService()