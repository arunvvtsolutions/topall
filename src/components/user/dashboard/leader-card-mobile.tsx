import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React from 'react';

const LeaderCardMobile = () => {
  return (
    <Card className="mb-4 overflow-hidden border-borderad py-4">
      <CardHeader className="space-y-2 px-4 py-0 text-center">
        <div className="flex items-center justify-between">
          <div className="text-start">
            <p className="text-xs font-medium text-B2Cgray">Overall</p>
            <h3 className="text-base font-medium text-B2CAgrayn">Leaderboard</h3>
          </div>
          <div className="flex items-center justify-center rounded-full bg-primary/5 p-0.5">
            <Icon icon="fontisto:world-o" className="text-3xl text-primary" />
          </div>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="mt-2 space-y-2 px-4 py-0">
        <p className="text-xs font-medium text-B2Cgray">Top Rank Holders</p>
        <div className="flex gap-2">
          <img src="/images/avatar/avatar-1.png" className="size-6 rounded-full" />
          <img src="/images/avatar/avatar-2.png" className="size-6 rounded-full" />
          <img src="/images/avatar/avatar-3.png" className="size-6 rounded-full" />
          <img src="/images/avatar/avatar-4.png" className="size-6 rounded-full" />
          <img src="/images/avatar/avatar-5.png" className="size-6 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="mt-3 border-t !p-0 !px-4">
        <Link href="/dashboard/leaderboard/1" passHref className="w-full">
          <Button
            variant="default"
            className="mt-2 w-full gap-2 bg-primary/5 text-sm font-medium text-primary hover:bg-primary/15"
          >
            View Leaderboard <Icon icon="ion:trophy-outline" className="text-lg" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LeaderCardMobile;
