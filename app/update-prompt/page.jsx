'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'

import Form from '@components/Form'

const EditPrompt = () => {
    const router = useRouter();
    const [searchParams, setSearchParams] = useState(null);
    const promptId = searchParams?.get('id')

    const [submitting, setSubmitting] = useState(false)
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    })

    useEffect(() => {
        const getPromptDetails = async () => {
            const response = await fetch(`/api/prompt/${promptId}`)
            const data = await response.json()

            setPost({
                prompt: data.prompt,
                tag: data.tag
            })
        }

        if(promptId) getPromptDetails()
    }, [promptId])

    useEffect(() => {
        // Wrap the usage of useSearchParams() in a Suspense boundary
        const searchParamsPromise = import('next/navigation').then((module) => module.useSearchParams());
        searchParamsPromise.then((searchParams) => setSearchParams(searchParams));
    }, []);

    const updatePrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true)

        if(!promptId) return alert('Prompt ID not found')

        try {
            const response = await fetch(`/api/prompt/${promptId}`,
            {
                method: 'PATCH',
                body: JSON.stringify({
                    prompt: post.prompt,
                    tag: post.tag
                })
            })

            if(response.ok) {
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Form
                type="Edit"
                post={post}
                setPost={setPost}
                submitting={submitting}
                handleSubmit={updatePrompt}
            />
        </Suspense>
    )
}

export default EditPrompt
