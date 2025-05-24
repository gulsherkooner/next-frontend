import { ChevronRight} from 'lucide-react';
export const YourAccount = ()=>{
    return(
        <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-scroll">
          <h2 className="text-xl font-extrabold mb-6">Account information</h2>
          <div className="space-y-4 border-t-1 p-3">
            <div className='mb-6'>
              <p className="font-bold -mb-3.5 text-xl">Username <ChevronRight className='justify-self-end text-gray-900'/></p>
              <p className="text-gray-600 text-lg">@Username</p>
            </div>
            <div className='mb-6'>
              <p className="font-bold -mb-3.5 text-xl">Phone <ChevronRight className='justify-self-end text-gray-900'/></p>
              <p className="text-gray-600 text-lg">+91 8699338862</p>
            </div>
            <div className='mb-6'>
              <p className="font-bold -mb-3.5 text-xl">Email <ChevronRight className='justify-self-end text-gray-900'/></p>
              <p className="text-gray-600 text-lg">Username@gmail.com</p>
            </div>
            <div className='mb-6'>
              <p className="font-bold -mb-3.5 text-xl">Website<ChevronRight className='justify-self-end text-gray-900'/></p>
              <p className="text-gray-600 text-lg break-words">website-username/aa/a.com</p>
            </div>
            <div className='mb-6'>
              <p className="font-bold mb-3.5 text-xl">Bio</p>
              <div className="border rounded p-3 text-gray-700 bg-gray-50 mt-1">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium...
              </div>
            </div>
            <hr />
            <div className='mb-6'>
              <p className="font-bold -mb-3.5 text-xl">Country<ChevronRight className='justify-self-end text-gray-900'/></p>
              <p className="text-gray-600 text-lg">India</p>
            </div>
            <div className='mb-6'>
              <p className="font-bold -mb-3.5 text-xl">Language<ChevronRight className='justify-self-end text-gray-900'/></p>
              <p className="text-gray-600 text-lg">English (USA)</p>
            </div>
            <div className='mb-6'>
              <p className="font-bold -mb-3.5 text-xl">Age<ChevronRight className='justify-self-end text-gray-900'/></p>
              <p className="text-gray-600 text-lg">28</p>
            </div>
            <div className='mb-6'>
              <p className="font-bold -mb-3.5 text-xl">Gender<ChevronRight className='justify-self-end text-gray-900'/></p>
              <p className="text-gray-600 text-lg">Male</p>
            </div>
            <div className='mb-6'>
              <p className="font-bold -mb-3.5 text-xl">Birth date<ChevronRight className='justify-self-end text-gray-900'/></p>
              <p className="text-gray-600 text-lg">Aug 12, 1997</p>
            </div>
            <hr />
            <div className='mb-6'>
              <p className="font-bold -mb-3.5 text-xl">Joined<ChevronRight className='justify-self-end text-gray-900'/></p>
              <p className="text-gray-600 text-lg">Joined May 2025</p>
            </div>
            <hr />
          </div>
        </div>
    )
}