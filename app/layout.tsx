import type {Metadata} from 'next'
import './globals.css'
import Header from "@/app/header";
import {cookies} from "next/headers";

export const metadata: Metadata = {
    title: 'OmSTU Ticket',
    description: 'An app for getting early access for doing task on Kazakov Sergei practical lessons    ',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="ru">
        <body>
            <Header initLogin={cookies().get('login')?.value}/>
            {children}
        </body>
        </html>
    )
}
