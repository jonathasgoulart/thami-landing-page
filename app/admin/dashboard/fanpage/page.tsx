import { getSiteContent } from '@/lib/db';
import { FanpageForm } from '@/components/admin/FanpageForm';

export default async function FanpageAdmin() {
    const content = await getSiteContent();

    return (
        <div>
            <h1 className="text-2xl font-serif text-primary mb-6">Editor da Fanpage</h1>
            <FanpageForm content={content} />
        </div>
    );
}
