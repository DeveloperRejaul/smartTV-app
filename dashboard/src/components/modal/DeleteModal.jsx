export default function DeleteModal({ setIsOpen=() => {}, callBack=() => {}, message='Do you really want to delete this record? This process can not be undone.' }) {
  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-neutral-950/50 flex justify-center items-center p-10'>
      <div className='max-w-[500px] w-full bg-white border rounded'>
        <h1 className='border-b px-5 py-3 font-[600] text-zinc-700'>Delete Confirmation</h1>
        <div className=' p-5'>{message}</div>
        <div className='p-5 flex items-center justify-end gap-2'>
          <button className='p-2 border bg-zinc-100 text-zinc-800 rounded active:scale-95' onClick={() => setIsOpen(null)}>Cancel</button>
          <button className='p-2 border bg-tints-800 text-white rounded active:scale-95' onClick={callBack}>Delete</button>
        </div>
      </div>

    </div>
  );
}
