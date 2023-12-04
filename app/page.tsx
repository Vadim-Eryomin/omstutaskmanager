'use client'

import {getCookie} from "cookies-next";
import {redirect} from "next/navigation";

export default function Home() {
    return (
        <div>
            {redirect(getCookie('login') ? '/tickets' : '/enter')}
        </div>
    )
}



