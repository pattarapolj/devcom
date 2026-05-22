import { redirect , notFound } from 'next/navigation';
import React from 'react'

import { auth } from '@/auth';
import QuestionForm from '@/components/forms/QuestionForm'
import ROUTES from '@/constants/routes';
import { getQuestion } from '@/lib/actions/question.action';




const EditQuestion = async ({ params }: RouteParams) => {
    const { id } = await params;
    if (!id) return notFound(); 

    const session = await auth();
    if (!session) return redirect('/sign-in'); // send user to sign in page if not authenticated

    const { data: question, success } = await getQuestion({ questionId: id });

    if (!success) return notFound();

    if (question?.author.toString() !== session.user?.id) redirect(ROUTES.QUESTION(id)); // send user to 404 page if they are not the author of the question


    return (
        <main>
            <QuestionForm question={question} isEdit />
        </main>
    )
}

export default EditQuestion