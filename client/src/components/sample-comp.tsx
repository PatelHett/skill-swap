
import { sampleUtil } from '../utils/sample-util'

const SampleComp = () => {
  return (
    <div className='bg-gray-100 p-4 rounded-lg shadow-md h-full'>
        <h1 className='text-2xl text-red-500'>Sample Comp</h1>
        <p>{sampleUtil()}</p>
    </div>
  )
}

export default SampleComp