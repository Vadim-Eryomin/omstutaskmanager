import {PrismaClient, User} from "@prisma/client";
import checkLogin from "@/app/api/check_login";
import {dirtyCache} from "@/app/api/cache";

export const dynamic = 'force-dynamic'

let strangeTicket = JSON.stringify({'error': "Ticket not found", code: 404})
let notAuth = JSON.stringify({'error': "Unauthorized", code: 401})
let already = JSON.stringify({'error': "This ticket is already checked", code: 402})
let notChecked = JSON.stringify({'error': "This ticket is not checked by you", code: 403})
let success = JSON.stringify({code: 200})

export async function PUT(request: Request) {
    let reqBody = await request.json()
    let prisma = new PrismaClient();

    let login = reqBody['login']
    let password = reqBody['password']
    let ticketId = reqBody['id']

    let user = await checkLogin(prisma, login, password)
    if (user) {
        let ticket = await prisma.ticket.findFirst({where: {id: ticketId}})

        if (!ticket) {
            prisma.$disconnect()
            return new Response(strangeTicket);
        }
        if (ticket.checkedId) {
            prisma.$disconnect()
            return new Response(already);
        }

        await prisma.ticket.update({where: {id: ticket.id}, data: {checkedId: user.id}})
        prisma.$disconnect()
        dirtyCache()
        return new Response(success)

    } else {
        prisma.$disconnect()
        return new Response(notAuth);
    }
}

export async function DELETE(request: Request) {

    let reqBody = await request.json()
    let prisma = new PrismaClient();

    let login = reqBody['login']
    let password = reqBody['password']
    let ticketId = reqBody['id']

    let user = await checkLogin(prisma, login, password)
    if (user) {
        let ticket = await prisma.ticket.findFirst({where: {id: ticketId}})

        if (!ticket) {
            prisma.$disconnect()
            return new Response(strangeTicket);
        }
        if (ticket.checkedId != user.id) {
            prisma.$disconnect()
            return new Response(notChecked);
        }

        await prisma.ticket.update({where: {id: ticket.id}, data: {checkedId: null}})
        prisma.$disconnect()
        dirtyCache()
        return new Response(success)

    } else {
        prisma.$disconnect()
        return new Response(notAuth);
    }
}
