import { Icon } from '@/components/ui/icon';
import HeaderCard from './header-card';

const InfluencerProfile = () => {
  const influencerData = {
    image: 'https://picsum.photos/id/1045/200/300',
    name: 'ThePotatoFace',
    tag: '#TOPALL123'
  };

  const stats = [
    { title: 'REFERRED STUDENTS', value: '56,867', percentage: '57%', icon: 'stash:people-group-light' },
    { title: 'TOTAL INCOME', value: '$56,867', percentage: '57%', icon: 'stash:money-bag' },
    { title: 'COMMISSION', value: '$5,686', percentage: '57%', icon: 'stash:dollar-coin-light' }
  ];

  return (
    <div>
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4  ">
        {/* Influencer Info Card */}
        <div className="flex w-full  rounded-lg border bg-white p-5">
          <div className="!h-12 !w-12 md:!h-20 md:!w-20 overflow-hidden rounded-full">
            <img src={influencerData.image} alt={influencerData.name} className="h-full w-full object-cover" />
          </div>
          <div className='pl-2 flex justify-center items-center'>
            <div>
            <h2 className="mb-2 text-lg flex items-center gap-2 font-semibold text-black">{influencerData.name}  <Icon icon="logos:youtube-icon" /></h2>
            <h2 className="text-sm font-normal text-[#4B4B4B]">{influencerData.tag}</h2>
            </div>
          </div>
        </div>
        {stats.map((stat, index) => (
          <div className=' w-full'>
            <HeaderCard key={index} title={stat.title} value={stat.value} percentage={stat.percentage} icon={stat.icon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfluencerProfile;
