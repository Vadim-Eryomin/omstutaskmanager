import {PrismaClient, Ticket} from '@prisma/client';
import {cleanCache, isCacheDirty} from "@/app/api/cache";

export const dynamic = 'force-dynamic'

let cache: Array<Ticket> | null = null

export async function GET() {
    if (isCacheDirty || cache == null) {
        let prisma = new PrismaClient();

        let data = await prisma.ticket.findMany()
        for (let ticketId in data) {
            let ticket = data[+ticketId]
            if (ticket.checkedId)
            { // @ts-ignore
                ticket.user = await prisma.user.findFirst({where: {id: ticket.checkedId}})
            }
        }

        cleanCache()
        cache = data

        prisma.$disconnect()
        return new Response(JSON.stringify(data))
    } else {
        console.log('cached')
        return new Response(JSON.stringify(cache))
    }

}