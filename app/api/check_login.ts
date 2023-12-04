import {PrismaClient} from '@prisma/client'
export default async function checkLogin(prisma: PrismaClient, login: string, password: string){
    if (!login || !password) return false

    return prisma.user.findFirst({where: {login, password}});
}