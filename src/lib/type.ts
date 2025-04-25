import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { ReactNode } from 'react';
import { Key } from 'readline';

export type color = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'destructive';
export type InputColor = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'destructive';
export type shadow = 'sm' | 'md' | 'lg' | 'xl';
export type size = 'default' | 'sm' | 'md' | 'lg';
export type rounded = 'sm' | 'md' | 'lg' | 'full';
export type radius = 'sm' | 'md' | 'lg' | 'xl' | 'none';

// config
export type layoutType = 'vertical' | 'horizontal' | 'semi-box' | 'compact';
export type contentType = 'wide' | 'boxed';
export type skinType = 'default' | 'bordered';
export type sidebarType = 'classic' | 'draggable' | 'two-column' | 'compact';
export type navBarType = 'floating' | 'sticky' | 'hidden' | 'default';
export type headerColorType = 'default' | 'coloured' | 'transparent';
// export interface Subject {
//   slNo:  number
//   subject: ReactNode;
//   subjectCode: ReactNode;
//   image: string | StaticImport;
//   status: string;
//   id: number;
//   name: string;
//   image_file: string;
//   description: string;
//   sequemce: number;
//   is_active: boolean;
//   is_deleted: boolean;
// }

// export interface PageProps {
//   subjects: Subject[];
// }
// export interface AcademicProps {
//   subjects: Subject[];
// }
