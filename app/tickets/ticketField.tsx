'use client'
import useSWR, {KeyedMutator, mutate} from 'swr'
import {useEffect, useState} from "react";
import {getCookie} from "cookies-next";
import codeToError from "@/app/utility/codeToError";

export default function Tickets() {
    let {data, mutate, isLoading} = useSWR('/api/data', args => fetch(args).then(r => r.json()), {refreshInterval: 1});
    let [isError, setError] = useState(false)
    let [errorMessage, setErrorMessage] = useState('')
    let [teacher, setTeacher] = useState(false)

    useEffect(() => {
        setTeacher(getCookie('teacher') == 'true' || false)
    }, []);

    return ( // TODO
        <div>
            <div className={'flex'}>
                <p className={'text-5xl m-6 mt-3'}>Задачи</p>
                {
                    isError &&
                    <div
                        className={'text-5xl p-3 text-center w-fit transition-opacity border-[1px] border-rose-600 bg-rose-400 rounded-lg shadow my-2'}>
                        {errorMessage}
                    </div>
                }
            </div>
            {teacher && <NewTicketForm/>}

            {isLoading ?
                'Загрузка...' :
                data.map((e: any) => <Ticket key={e.id} id={e.id} content={e.content} name={e.user?.name}
                                             setError={setError} setErrorMessage={setErrorMessage} teacher={teacher}
                                             type={e.checkedId == null ? NOT_CHECKED : e.checkedId == getCookie('id') ? YOURS : CHECKED}/>)}
        </div>
    )
}

let NOT_CHECKED = 0
let CHECKED = 1
let YOURS = 2

function NewTicketForm() {
    let [content, setContent] = useState('');

    return (
        <form action={e => createTicket(e, setContent)}>
            <input type="text" name={'content'}
                   className={'ms-2 border-[1px] border-solid rounded-lg p-2 text-2xl w-1/2 max-w-[400px] min-w-[200px]'}
                   placeholder={'Лунгу 1.1.1...'} value={content} onChange={e => setContent(e.target.value)}/>
            <button type="submit" className={'border-[1px] border-emerald-500 text-emerald-500 transition-colors ' +
                'hover:text-white hover:bg-emerald-500 text-2xl rounded-lg px-3 py-2 mx-3'}>Создать
            </button>
        </form>
    )
}

function Ticket({id, type, content, name, setError, setErrorMessage, teacher}: {
    id: number,
    type: number,
    name: string | undefined,
    content: string,
    setError: Function,
    setErrorMessage: Function,
    teacher: boolean
}) {
    let [style, setStyle] = useState('')

    useEffect(() => {
        if (type == NOT_CHECKED) setStyle(_ => "bg-red-400")
        else if (type == CHECKED) setStyle(_ => "bg-amber-200")
        else if (type == YOURS) setStyle(_ => "bg-emerald-400")
    }, [type]);

    return (
        <div className={'flex justify-between'}>
            <form className={'d-flex px-3 py-4 flex-grow m-2 shadow rounded-lg ' + style}
                  onClick={e => formPress(id, type, setError, setErrorMessage)}>
                <span className={'text-2xl me-2'}>
                    {id}. {content}
                </span>
                    <span className={'text-2xl text-zinc-500'}>
                    {name}
                </span>
            </form>

            {teacher &&
                <button type="submit"
                        className={'flex-grow-0 px-7 py-3 border-[1px] border-rose-600 text-rose-600 font-semibold ' +
                            'transition-colors hover:text-white hover:bg-rose-600 text-4xl rounded m-2'}
                        onClick={() => deleteTicket(id)}>x</button>}

        </div>
    )
}

/**
 * some true value means there is error, returned string is message to show
 * */
async function formPress(ticket: number, type: number, setError: Function, setErrorMessage: Function) {
    setError(false)

    if (type == CHECKED) {
        setError(true)
        setErrorMessage("Эта карточка уже выбрана")
        return
    }

    let data = await fetch('/api/me', {
        method: type == NOT_CHECKED ? 'PUT' : 'DELETE',
        body: JSON.stringify({
            id: ticket,
            login: getCookie('login'),
            password: getCookie('password')
        })
    })

    let dataBody = await data.json()

    if (dataBody.code != 200) {
        setError(true)
        setErrorMessage(codeToError(dataBody.code))
    }

    console.log(dataBody)
}

async function createTicket(formData: FormData, setContent: Function) {
    let content = formData.get('content')
    setContent('')
    fetch('/api/ticket', {
        method: 'PUT',
        body: JSON.stringify({
            content,
            login: getCookie('login'),
            password: getCookie('password')
        })
    })
}

async function deleteTicket(id: number) {
    fetch('/api/ticket', {
        method: 'DELETE',
        body: JSON.stringify({
            id,
            login: getCookie('login'),
            password: getCookie('password')
        })
    })
}