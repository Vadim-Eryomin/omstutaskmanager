import {PrismaClient} from '@prisma/client';
import {NextApiRequest} from "next";
export const dynamic = 'force-dynamic'

export async function GET(request: NextApiRequest) {
    if (request.url) {
        let {searchParams} = new URL(request.url)
        let login = searchParams.get('login')
        if (!login) return new Response(JSON.stringify({code: 401}))

        let prisma = new PrismaClient()
        await prisma.user.update({where: {login}, data: {isTeacher: true}})
        prisma.$disconnect()
    }
    return new Response(JSON.stringify({code: 200}))
}