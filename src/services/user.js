import { User } from  '../models'

let instance = null

class UserService {

    constructor() {
		if (!instance) {
			console.log('User Service 생성' + this)
			instance = this
		}
		return instance
  }

  async register ( user ) {

    const alreadyUser = await User.findOne( { username : user.username })

    if ( alreadyUser != null ) throw Error ('USER_ALREADY_EXISTS')

    await User.create(user)

		return true
		
  }

  async update ( username , newUser ) {

    await User.update( newUser,  {
      where : {
        username
      }
      
    })

    return true 


  }

}

export default new UserService()