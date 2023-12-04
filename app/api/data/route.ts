import {PrismaClient, Ticket} from '@prisma/client';

export const dynamic = 'force-dynamic'

export function dirtyCache() {
    dirty = true
}

let dirty = true
let cache: Array<Ticket> | null = null

export async function GET() {
    if (dirty || cache == null) {
        let prisma = new PrismaClient();

        let data = await prisma.ticket.findMany()
        for (let ticketId in data) {
            let ticket = data[+ticketId]
            if (ticket.checkedId)
            { // @ts-ignore
                ticket.user = await prisma.user.findFirst({where: {id: ticket.checkedId}})
            }
        }

        dirty = false
        cache = data

        prisma.$disconnect()
        return new Response(JSON.stringify(data))
    } else {
        return new Response(JSON.stringify(cache))
    }

}