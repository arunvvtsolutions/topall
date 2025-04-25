import { Plus } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ButtonNames } from '@/types/enum';

export function AddPlanCard({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="flex w-full flex-col items-center justify-center border-dashed py-8">
      <CardContent className="flex flex-col items-center justify-center pb-3 text-center">
        <div className="mb-4 rounded-full border-2 border-dashed border-[#10101026] p-3 transition-colors md:p-4">
          <Plus className="h-6 w-6 text-[#222222]" />
        </div>
        <h3 className="mb-1 text-base font-medium text-[#222222] md:text-lg lg:text-xl">Add new Package Plan</h3>
      </CardContent>
      <CardFooter>
        <Button onClick={onCreate} className="rounded-full bg-primary !px-10 text-base text-white hover:bg-primary/90">
          {ButtonNames.CREATE_PLAN}
        </Button>
      </CardFooter>
    </Card>
  );
}
