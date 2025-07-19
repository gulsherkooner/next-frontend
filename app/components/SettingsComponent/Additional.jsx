import { ChevronRight } from 'lucide-react';
export const Additional = () => {
  return (
    <div className="flex-1 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh]">
      <h2 className="text-xl font-extrabold mb-6">Additional resources</h2>
      <div className="space-y-4 border-t-1 p-3">
        <div className='mb-5 p-2'>
          <p className="font-bold mt-3 text-xl">Ads Info <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
        </div>
        <hr />
        <div className='mb-5 p-2'>
          <p className="font-bold mt-3 text-xl">Cookie policy <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
        </div>
        <hr />
        <div className='mb-5 p-2'>
          <p className="font-bold mt-3 text-xl">Privacy policy<ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
        </div>
        <hr />
        <div className='mb-5 p-2'>
          <p className="font-bold mt-3 text-xl">Terms of Service <ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
        </div>
        <hr />
        <div className='mb-5 p-2'>
          <p className="font-bold mt-3 text-xl">Community guidelines<ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
        </div>
        <hr />
        <div className='mb-5 p-2'>
          <p className="font-bold mt-3 text-xl">Accessiblity help<ChevronRight className='justify-self-end text-gray-900 -mt-5' /></p>
        </div>
        <hr />
      </div>
    </div>
  )
}