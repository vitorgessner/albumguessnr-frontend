import { Music, Music2, Headphones, DiscAlbum, Guitar, Mic, Stars } from 'lucide-react';

const Test = () => {
  return (
    <div className="flex flex-col relative gap-5 justify-center p-4 py-12 pb-16 border-3 border-border rounded-lg w-fit mx-auto text-center text-navy max-w-125">
        <h1 className="text-xl font-heading font-extrabold tracking-tight uppercase">AlbumGuessnr</h1>
        <p className="text-lg font-heading font-extrabold tracking-tight">Verify your account</p>
        <p className="">Welcome to the most fun community for album guessing. Prepare to compete with your friends and see who does better</p>
        <p className="">Please click on the button below to verify your account and start guessing!</p>
        <a href="${env.FRONTEND_URL}/verify/${verificationToken}" className="removeFriendButton w-fit px-12 mx-auto text-white font-heading font-bold">Verify your email</a>
        <Music size={90} className='absolute top-10 left-10 rotate-33 opacity-20'/>
        <Music2 size={90} color='#e07a5f' className='absolute bottom-10 right-4 -rotate-33 opacity-20'/>
        <Headphones size={90} color='#e07a5f' className='absolute top-35 left-39 -rotate-15 opacity-20'/>
        <DiscAlbum size={90} color='#5d8f7a' className='absolute top-9 right-9 rotate-15 opacity-20'/>
        <Guitar size={90} color='#5d8f7a' className='absolute bottom-6 opacity-20 -rotate-45'/>
        <Mic size={70} className='absolute bottom-35 right-30 rotate-15 opacity-20'/>

        <Stars size={40} color='#9ea2d2' fill='#9ea2d2' className='absolute opacity-40 left-5 bottom-33 rotate-20' />
        <Stars size={40} color='#9ea2d2' fill='#9ea2d2' className='absolute opacity-40 right-5 top-35 -rotate-20' />
        
        <Stars size={40} color='#9ea2d2' fill='#9ea2d2' className='absolute opacity-40 right-30 top-5 rotate-20' />
        <Stars size={40} color='#9ea2d2' fill='#9ea2d2' className='absolute opacity-40 left-60 bottom-3 -rotate-20' />
        <Stars size={40} color='#9ea2d2' fill='#9ea2d2' className='absolute opacity-40 left-30 top-25 -rotate-20' />
    </div>
  )
}

export default Test