import {PrismaClient} from "@prisma/client";
import checkLogin from "@/app/api/check_login";

export const dynamic = 'force-dynamic'

let alreadyUsed = JSON.stringify({'error': "This name is already in use", code: 405})
let passwordsIncorrect = JSON.stringify({'error': "Password must be equal", code: 406})
let wrongCredentials = JSON.stringify({'error': 'Wrong login or password', code: 407})

let success = (id: number, teacher: boolean) => JSON.stringify({code: 200, id, teacher})

/*
* TODO: i should use something from crypto to save passwords...
*  if it will be broken by someone this will be a problem
*  but i don't think it could make any harm 'cause i don't think
*  this app will be popular or something like that
* */

export async function POST(request: Request) {

    /**
     * register method
     * */

    let prisma = new PrismaClient()
    let body = await request.json()

    let name = body['name']
    let login = body['login']
    let password = body['password']
    let repeatPassword = body['repeatPassword']

    let userByLogin = await prisma.user.findFirst({where: {login}})
    if (userByLogin) {
        prisma.$disconnect()
        return new Response(alreadyUsed)
    }

    if (password !== repeatPassword) {
        prisma.$disconnect()
        return new Response(passwordsIncorrect)
    }

    let user = await prisma.user.create({data: {login, password, name}})
    prisma.$disconnect()
    return new Response(success(user.id, user.isTeacher))
}

export async function PUT(request: Request) {
    /**
     * login method
     * */
    let prisma = new PrismaClient()
    let body = await request.json()

    let login = body['login']
    let password = body['password']
    let user = await checkLogin(prisma, login, password)
    if (!user) {
        prisma.$disconnect()
        return new Response(wrongCredentials)
    }

    prisma.$disconnect()
    return new Response(success(user.id, user.isTeacher))
}