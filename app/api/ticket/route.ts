import {PrismaClient, User} from "@prisma/client";
import checkLogin from "@/app/api/check_login";
import {dirtyCache} from "@/app/api/data/route";

export const dynamic = 'force-dynamic'

let notAuth = JSON.stringify({'error': "Unauthorized", code: 401})
let success = JSON.stringify({code: 200})

export async function PUT(request: Request) {
    /**
     * ticket creation method
     * */

    let reqBody = await request.json()
    let prisma = new PrismaClient();

    let login = reqBody['login']
    let password = reqBody['password']
    let content = reqBody['content']

    let user = await checkLogin(prisma, login, password)
    if (user) {
        await prisma.ticket.create({data: {content}})
        prisma.$disconnect()
        dirtyCache()
        return new Response(success)

    } else {
        prisma.$disconnect()
        return new Response(notAuth);
    }
}

export async function DELETE(request: Request) {
    /**
     * ticket deletion
     * */
    let reqBody = await request.json()
    let prisma = new PrismaClient();

    let login = reqBody['login']
    let password = reqBody['password']
    let ticketId = reqBody['id']

    let user = await checkLogin(prisma, login, password)
    if (user && user.isTeacher) {
        await prisma.ticket.delete({where: {id: ticketId}})
        prisma.$disconnect()
        dirtyCache()
        return new Response(success)

    } else {
        prisma.$disconnect()
        return new Response(notAuth);
    }
}