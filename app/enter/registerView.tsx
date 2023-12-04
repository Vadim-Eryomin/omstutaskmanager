'use client'
import {useEffect, useState} from "react";
import codeToError from "@/app/utility/codeToError";
import {redirect} from "next/navigation";
import {Cookies, useCookies} from "next-client-cookies";

export default function RegisterView({setLoginView}: {setLoginView: Function}) {
    let cookies = useCookies()

    let [login, setLogin] = useState('');
    let [name, setName] = useState('');
    let [password, setPassword] = useState('');
    let [repeatPassword, setRepeatPassword] = useState('');

    let [passwordError, setPasswordError] = useState(false)

    let [success, setSuccess] = useState(false);
    let [error, setError] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setPasswordError(e => password != repeatPassword)
    }, [password, repeatPassword]);

    return (
        <form action={data => createUser(data, setError, setErrorMessage, setSuccess, cookies)}
              className={'border-[1px] shadow rounded-md m-3 p-3 max-w-[600px] mx-auto'}>
            <p className={'text-5xl text-center mb-7'}>Регистрация</p>
            <div className={'border-[1px] border-solid border-red-400 bg-red-300 m-2 rounded-md mx-auto text-center' + (!error && ' hidden')}>
                <p className={'text-2xl p-3 text-center'}>
                    {errorMessage}
                </p>
            </div>
            <div className={'border-[1px] border-solid border-emerald-400 bg-emerald-300 rounded-md mx-auto text-center' + (success ? '' : ' hidden')}>
                <p className={'text-2xl p-3 text-center'}>
                    Все хорошо, продолжайте
                </p>
            </div>
            <div className={'flex flex-col m-2'}>
                <label className={'text-3xl ms-1'} htmlFor="login">Логин</label>
                <input type="text" id="login" value={login} name={"login"} onChange={e => setLogin(e.target.value)}
                       placeholder={'Логин'} required={true}
                       className={'border-[1px] border-solid p-1 text-xl rounded shadow'} />
            </div>

            <div className={'flex flex-col m-2'}>
                <label className={'text-3xl ms-1'} htmlFor="name">Имя</label>
                <input type="text" id="name" value={name} name={"name"} onChange={e => setName(e.target.value)}
                       placeholder={'Обращайтесь ко мне...'} required={true}
                       className={'border-[1px] border-solid p-1 text-xl rounded shadow'} />
            </div>

            <div className={'flex flex-col m-2'}>
                <label className={'text-3xl ms-1'} htmlFor="password">Пароль</label>
                <input type="password" id="password" value={password} name={"password"}
                       onChange={e => setPassword(e.target.value)}
                       className={'border-[1px] rounded solid transition-colors shadow text-xl p-1 ' + (passwordError && 'border-rose-600')}
                       placeholder={'Придумайте пароль'} required={true}
                />
            </div>

            <div className={'flex flex-col m-2'}>
                <label className={'text-3xl ms-1'} htmlFor="repeatPassword">Повторите пароль</label>
                <input type="password" id="repeatPassword" value={repeatPassword} required={true}
                       name={"repeatPassword"}
                       className={'border-[1px] rounded solid transition-colors shadow text-xl p-1 ' + (passwordError && 'border-rose-600')}
                       onChange={e => setRepeatPassword(e.target.value)} placeholder={'Повторите пароль'}/>
            </div>
            <div className={'pt-4 w-fit mx-auto'}>
                <button type="submit"
                        className={'border-[1px] rounded-md shadow border-emerald-600 text-emerald-600 p-2 m-2 ' +
                            'transition-colors hover:bg-emerald-500 hover:text-white hover:border-emerald-500 text-xl '}>Зарегистрироваться
                </button>
            </div>

            <p className={'text-xl text-indigo-500 text-center hover:underline'} onClick={() => setLoginView(true)}>Если есть аккаунт, вы можете войти!</p>
        </form>
    )
}


async function createUser(formData: FormData, setError: Function, setErrorMessage: Function, setSuccess: Function, cookies: Cookies) {
    let login = formData.get('login')
    let password = formData.get('password')
    let repeatPassword = formData.get('repeatPassword')
    let name = formData.get('name')

    if (!login || !password || !repeatPassword || !name) {
        setSuccess(false)
        setError(true)
        setErrorMessage(codeToError(-1))
    }

    let data = await fetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
            repeatPassword,
            name
        })
    })

    try {
        let answer = await data.json()

        if (answer.code != 200) {
            setSuccess(false)
            setError(true)
            setErrorMessage(codeToError(answer.code))
        }
        else {
            setError(false)
            setSuccess(true)

            cookies.set('login', login as string, {secure: true})
            cookies.set('password', password as string, {secure: true})
            cookies.set('id', answer.id, {secure: true})
            cookies.set('teacher', answer.teacher, {secure: true})

            redirect('/')
        }
    } catch (e) {
        console.log(e)
    }
}