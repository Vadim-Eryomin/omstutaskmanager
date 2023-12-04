'use client'
import RegisterView from "@/app/enter/registerView";
import {useState} from "react";
import LoginView from "@/app/enter/loginView";


export default function RegisterLoginForm() {
    let [loginView, setLoginView] = useState(true)

    return (
        <div>
            { loginView ?
                    <LoginView setLoginView={setLoginView}/> :
                    <RegisterView setLoginView={setLoginView}/>
            }
        </div>
    )
}