// const userService = require('../service/user-service')
// const {validationResult} = require('express-validator')                    // получаем результат валидации
// const ApiError = require('../exceptions/api-error')
import userService from '../service/user-service.js'
import {validationResult} from 'express-validator'
import ApiError from '../exceptions/api-error.js'







class UserController {                                  // просто одноименный class, у него будет несколько методов
    async registration(req, res, next) {                // функция регистрации, в контроллере принимают три аргумента(req это запрос, res это ответ, и next)
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body
            const userData = await userService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
            
        } catch (e) {
            next(e);
        }
    }

    // async login(req, res, next) {
    //     try {
    //         const {email, password} = req.body
    //         const userData = await userService.login(email, password)
    //         res.cookie('accessToken', userData.accessToken, {maxAge: 60 * 10000, httpOnly: true, sameSite: 'none', secure: true})
    //         return res.json(userData)
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }
    
    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)            
        }
    }


    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }
}




// module.exports = new UserController()           // по итогу из этого файла мы экспортируем обьект, экземпляр этого class
export default new UserController()           // по итогу из этого файла мы экспортируем обьект, экземпляр этого class














