'use client'
import Link from "next/link";
import {useState} from "react";
import {deleteCookie, getCookie} from "cookies-next";


export default function Header({initLogin}: {initLogin: string | undefined}) {
    let [login, setLogin] = useState(initLogin)

    setInterval(() => setLogin(getCookie('login')), 100) // need for rerender

    return (
        <header className={'flex justify-between items-center p-3 shadow-md'}>
            <p className={'text-5xl font-semibold'}>Ticket Master</p>
            <div className={'flex justify-end items-center w-max-1/3 w-min-[300px]'}>
                <Link href={'/'} className={'text-2xl px-2'}>Занять очередь</Link>
                <button className={'text-2xl px-4 ' + (login == undefined && 'hidden')} type="button" onClick={() => {
                    deleteCookie('login')
                    deleteCookie('password')
                    deleteCookie('id')
                    deleteCookie('teacher')
                    location.replace('/')
                }}>
                    <span className={'underline pe-1'}>{login}</span>
                    Выйти из аккаунта
                </button>
                <Link href={'/enter'} className={'text-2xl px-2 ' + (login != undefined && 'hidden')}>Войти в аккаунт</Link>

            </div>
        </header>
    )
}