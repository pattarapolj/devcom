import { redirect } from 'next/navigation';
import React from 'react'

import { auth } from '@/auth';
import QuestionForm from '@/components/forms/QuestionForm'


const AskAQuestion = async () => {

    const session = await auth();

    // send user to sign in page if not authenticated
    if (!session) return redirect('/sign-in');

    return (
        <>
            <h1 className='h1-bold text-dark100_light900'>
                Ask A Question
            </h1>
            <div className='mt-9'>
                <QuestionForm />
            </div>
        </>
    )
}

export default AskAQuestion