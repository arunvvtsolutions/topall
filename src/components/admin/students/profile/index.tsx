'use client';
import React, { useState } from 'react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import the new component
import MetricsCard from './student-metrics-card';
import { BookOpen, Clock, Target, Ticket } from 'lucide-react';
import SelectDropdown from '@/components/common/Select';
import { GenericType } from '@/types';

const student = {
  name: 'Venkata Rama Sai Durga Pradeep Kodavatti',
  phone: '+91 9840555474',
  email: 'naveen.jayasingh@vvtsolutions.in',
  last_active: '02/01/2025 10:45AM',
  metrics: [
    { key: 'total_tests', label: 'Total Tests', value: '245' },
    { key: 'target_score', label: 'Target Score', value: '720/720' },
    { key: 'referance_code', label: 'Reference Code', value: '#TopAll-Naveen0823' },
    { key: 'screen_time', label: 'Screen Time', value: '40Hrs 30Mins' }
  ]
};

const iconMap = {
  total_tests: <BookOpen className="h-5 w-5 text-[#0D068E]" />,
  target_score: <Target className="h-5 w-5 text-[#0D068E]" />,
  referance_code: <Ticket className="h-5 w-5 text-[#0D068E]" />,
  screen_time: <Clock className="h-5 w-5 text-[#0D068E]" />
};

const years = [
  { name: 'NEET 2025', id: 1 },
  { name: 'JEE 2025', id: 2 },
  { name: 'JEE 2024', id: 3 },
  { name: 'JEE 2023', id: 4 },
  { name: 'JEE 2022', id: 5 },
  { name: 'JEE 2021', id: 6 },
  { name: 'JEE 2020', id: 7 },
  { name: 'JEE 2019', id: 8 },
  { name: 'JEE 2018', id: 9 },
  { name: 'JEE 2017', id: 10 }
];

const StudentProfile = () => {
  const breadcrumbItems = [{ label: 'Students', href: '/admin/students' }, { label: 'Student Profile' }];
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const handleYearChange = (year: GenericType) => {
    setSelectedYear(year);
  };

  return (
    <div className="mt-2 px-2 md:px-6">
      <div>
        <Breadcrumbs items={breadcrumbItems} separator={<BreadcrumbSeparator />} />
      </div>
      <div>
        <Card className="mx-auto p-7">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              {/* Title and bar - Always in a row */}
              <div className="flex items-center gap-2 sm:order-1">
                <div className="h-8 w-1 rounded-full bg-primary"></div>
                <h2 className="text-base font-medium text-[#222222] md:text-lg lg:text-xl xl:text-xl">Student Details</h2>
              </div>

              {/* Dropdown - Stays below title in small screens, moves right in larger screens */}
              <div className="sm:order-2 sm:mt-0">
                <SelectDropdown
                  fontsize="md:text-base text-sm"
                  data={years}
                  name="years"
                  value={selectedYear}
                  onChange={handleYearChange}
                  width="md:full w-36"
                  size="default"
                />
              </div>
            </div>
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4 sm:p-4">
              <div className="relative">
                <Avatar className="size-16 sm:size-32">
                  <AvatarImage src="/images/avatar/av-2.jpg" alt="Student Avatar" />
                  <AvatarFallback>VK</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-1.5 right-1 size-3 rounded-full border-2 border-white bg-green-500 md:bottom-4 md:right-2 md:size-4 lg:bottom-4 lg:right-2 lg:size-4"></span>
              </div>

              {/* Contact Information */}
              <div className="w-full text-center sm:text-left">
                <h3 className="text-base font-medium text-gray-900 md:text-lg">{student.name}</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-3 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-700 xl:text-base">Phone Number</p>
                    <p className="text-sm text-gray-500 xl:text-base">{student.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 xl:text-base">Email Address</p>
                    <p className="break-words text-sm text-gray-500 xl:text-base">{student.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 xl:text-base">Last Active</p>
                    <p className="text-sm text-gray-500 xl:text-base">{student.last_active}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {student.metrics.map((metric) => (
                <MetricsCard
                  key={metric.key}
                  label={metric.label}
                  value={metric.value}
                  icon={iconMap[metric.key as keyof typeof iconMap]}
                />
              ))}
            </div>

            {/* Action Button */}
          </div>
        </Card>
      </div>
      <div className="mt-6 flex justify-center">
        <Button variant="default" className="rounded-full bg-[#00008014] text-base font-normal text-primary hover:bg-[#00008020]">
          Load Analysis
        </Button>
      </div>
    </div>
  );
};

export default StudentProfile;
