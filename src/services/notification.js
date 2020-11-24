import { Notification  } from  '../models'

let instance = null

class NotificationService {

  constructor() {
    if (!instance) {
      console.log('Notification Service 생성' + this)
      instance = this
    }
    return instance
  }

  async create ( modelObj ) {
    return await Notification.create(modelObj)
  }

  async findList (where) {
      return Notification.findAll({
        where : JSON.parse(JSON.stringify(where))
    })
  }

  async findOne(where) {
    return await Notification.findOne({
      where: JSON.parse(JSON.stringify(where))
    })
  }

  async update ( id, modelObj ) {
      await Notification.update(modelObj, {
        where: { id },
    })

    const updatedNotification = await Notification.findOne({
        where: { id },
    })
    if (updatedNotification === null) throw Error('FINAL_REPORT_NOT_FOUND')

    return updatedNotification 
  }

  async delete ( id ) {
    const notification = await Notification.findOne({
			where: {
				id
			}
        })
        
        if ( notification == null ) {
            throw Error ('FINAL_REPORT_NOT_FOUND')

        } else {

            await notification.destroy()
        }
    }
}


export default new NotificationService()
