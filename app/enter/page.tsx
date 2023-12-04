'use server'
import RegisterLoginForm from "@/app/enter/registerLoginForm";

export default async function Enter() {
    return (
        <div className={'d-flex'}>
            <RegisterLoginForm/>
        </div>
    )
}