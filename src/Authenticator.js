import passport from 'passport'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'

import { userService, academyService } from './services'
import { createErrorResponse } from './utils/functions'

// singleton instance
let instance = null

class Authenticator {
	constructor() {
		if (!instance) {
			console.log('Authenticator 생성' + this)
			instance = this
		}
		return instance
	}

	initialize(app) {
		// from auth header
		const jwtStrategyOption = {
			jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
			passReqToCallback: true,
			secretOrKey: 'token-secret-staging',
		}

		const jwtStrategy = new JWTStrategy(jwtStrategyOption, async (req, payload, done) => {
			try {

				const user = await userService.findOne({ id: payload.id })

				if (user) done(null, user)
				else done(null, false)
			} catch (e) {
				done(e, null)
			}
		})

		passport.use('jwt', jwtStrategy)

		// middleware 로 설정
		app.use(passport.initialize())
		this.passport = passport
		return passport
	}

	authenticate(req, res, next) {

		instance.passport.authenticate('jwt', { session: false }, (error, user) => {
    

			// [ERROR] INVALID_TOKEN
			if (!user) {
				const response = createErrorResponse(new Error('INVALID_TOKEN'))
				return res.send(response)
      }
      

			// [ERROR] Internal Server Error
			if (error) {
				return res.send(createErrorResponse())
      }
			req.user = user
      next()
      
		})(req, res, next)
	}


	getUserInfo(req, res, next) {
		instance.passport.authenticate('jwt', { session: false }, (error, user) => {
			// [ERROR] Internal Server Error
			if (error) {
				return res.send(createErrorResponse())
			}

			req.user = user
			next()
		})(req, res, next)
	}

	// middleware to check admin role
	admin(req, res, next) {
		instance.passport.authenticate('jwt', { session: false }, (error, user) => {

			// [ERROR] INVALID_TOKEN
			if (!user) {
        const response = createErrorResponse(new Error('INVALID_TOKEN'))
				return res.send(response)
			}

			// [ERROR] NO_ACCESS
			if (user.role !== 'admin') {
				const response = createErrorResponse(new Error('NO_ACCESS'))
				return res.send(response)
			}

			// [ERROR] Internal Server Error
			if (error) {
				return res.send(createErrorResponse())
			}

			req.user = user
			next()
		})(req, res, next)
	}
}

// export singleton instance
export default new Authenticator()