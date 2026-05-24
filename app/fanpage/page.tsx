import FanpageView from '@/components/FanpageView';
import { getSiteContent } from '@/lib/db';

export const metadata = {
  title: 'THAMI - Fanpage',
};

export default async function Fanpage() {
  const content = await getSiteContent();
  const fanpage = content?.fanpage || {};
  return <FanpageView data={fanpage} />;
}
