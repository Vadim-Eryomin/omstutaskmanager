'use client'
import {useEffect, useState} from "react";
import codeToError from "@/app/utility/codeToError";
import {Cookies, useCookies} from "next-client-cookies";
import {redirect} from "next/navigation";

export default function LoginView({setLoginView}: {setLoginView: Function}) {
    let cookies = useCookies()

    let [login, setLogin] = useState('');
    let [password, setPassword] = useState('');

    let [error, setError] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');
    let [shouldRedirect, setRedirect] = useState(false)

    useEffect(() => {
        if (shouldRedirect)
            redirect('/') // will be called on change
    }, [shouldRedirect]);

    return (
        <form action={data => loginUser(data, setError, setErrorMessage, cookies, setRedirect)}
              className={'border-[1px] shadow rounded-md m-3 p-3 max-w-[600px] mx-auto'}>
            <p className={'text-5xl text-center mb-7'}>Вход</p>
            <div
                className={'border-[1px] border-solid border-red-400 bg-red-300 m-2 rounded-md mx-auto text-center' + (!error && ' hidden')}>
                <p className={'text-2xl p-3 text-center'}>
                    {errorMessage}
                </p>
            </div>
            <div className={'flex flex-col m-2'}>
                <label className={'text-3xl ms-1'} htmlFor="login">Логин</label>
                <input type="text" id="login" value={login} name={"login"} onChange={e => setLogin(e.target.value)}
                       placeholder={'Логин'} required={true}
                       className={'border-[1px] border-solid p-1 text-xl rounded shadow'}/>
            </div>

            <div className={'flex flex-col m-2'}>
                <label className={'text-3xl ms-1'} htmlFor="password">Пароль</label>
                <input type="password" id="password" value={password} name={"password"}
                       onChange={e => setPassword(e.target.value)}
                       className={'border-[1px] rounded solid transition-colors shadow text-xl p-1'}
                       placeholder={'Придумайте пароль'} required={true}
                />
            </div>

            <div className={'pt-4 w-fit mx-auto'}>
                <button type="submit"
                        className={'border-[1px] rounded-md shadow border-emerald-600 text-emerald-600 p-2 m-2 ' +
                            'transition-colors hover:bg-emerald-500 hover:text-white hover:border-emerald-500 text-xl '}>Войти
                </button>
            </div>

            <p className={'text-xl text-indigo-500 text-center hover:underline'} onClick={() => setLoginView(false)}>Если нет аккаунта, вы можете его создать!</p>
        </form>
    )
}


async function loginUser(formData: FormData, setError: Function, setErrorMessage: Function, cookies: Cookies, setRedirectData: any) {
    let login = formData.get('login')
    let password = formData.get('password')

    if (!login || !password) {
        setError(true)
        setErrorMessage(codeToError(-1))
    }

    let data = await fetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({
            login: formData.get('login'),
            password: formData.get('password'),
        })
    })

    try {
        let answer = await data.json()

        if (answer.code != 200) {
            setError(true)
            setErrorMessage(codeToError(answer.code))
        }
        else {
            cookies.set('login', login as string, {secure: true})
            cookies.set('password', password as string, {secure: true})
            cookies.set('id', answer.id, {secure: true})
            cookies.set('teacher', answer.teacher, {secure: true})

            setRedirectData(true)
        }
    } catch (e) {
        console.log(e)
    }
}