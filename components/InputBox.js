import { EmojiHappyIcon } from '@heroicons/react/outline';
import { CameraIcon, VideoCameraIcon } from '@heroicons/react/solid';
import firebase from 'firebase/compat/app';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { db, storage } from '../firebase';

const InputBox = () => {
    const {data: session} = useSession();
    const inputRef = useRef(null)
    const filePickerRef = useRef(null)
    const [imageToPost, setImageToPost] = useState(null);

    const addImageToPost = e => {
        const reader = new FileReader();
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0])
        }
        reader.onload = readerEvent => {
            setImageToPost(readerEvent.target.result)
        }
    }

    const removeImage = () => setImageToPost(null)

    const sendPost = e => {
        e.preventDefault();
        if(!inputRef.current.value) return

        db.collection('posts').add({
            message: inputRef.current.value,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(doc => {
            if (imageToPost){
                const uploadTask = storage.ref(`posts/${doc.id}`).putString(imageToPost, 'data_url')

                removeImage()

                uploadTask.on('state_change', null, err => console.log(err), () => {
                    //upload completes
                    storage.ref(`posts`).child(doc.id).getDownloadURL().then(url => {
                        db.collection('posts').doc(doc.id).set({
                            postImage: url
                        }, {merge: true})
                    })
                })
            }
        })

        inputRef.current.value = '';
    }
    return (
        <div className='bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6'>
            <div className='flex space-x-4 items-center pb-3'>
                <Image
                className='rounded-full'
                src={session.user.image}
                width={40}
                height={40}
                layout="fixed"
                alt='user'
                />
                <form className='flex flex-1'>
                    <input ref={inputRef} className='rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none' type="text" placeholder={`What's on your mind, ${session.user.name.split(' ')[0]}?`} />
                    <button hidden onClick={sendPost} type="submit">Submit</button>
                </form>

                {
                    imageToPost && (
                        <div className='flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer' onClick={removeImage}>
                            <img src={imageToPost} className="h-10 object-contain" alt="" />
                            <p className='text-xs text-red-500 text-center'>Remove</p>
                        </div>
                    )
                }
            </div>
            <div className='flex justify-evenly p-3 border-t'>
                <div className='inputIcon'>
                    <VideoCameraIcon className='h-7 text-red-500' />
                    <p className='text-xs sm:text-sm xl:text-base'>Live Video</p>
                </div>
                <div className='inputIcon' onClick={()=>filePickerRef.current.click()}>
                    <CameraIcon className='h-7 text-green-400' />
                    <p className='text-xs sm:text-sm xl:text-base'>Photo/Video</p>
                    <input ref={filePickerRef} type="file" hidden onChange={addImageToPost} />
                </div>
                <div className='inputIcon'>
                    <EmojiHappyIcon className='h-7 text-yellow-300' />
                    <p className='text-xs sm:text-sm xl:text-base'>Feeling/Activity</p>
                </div>
            </div>
        </div>
    );
};

export default InputBox;