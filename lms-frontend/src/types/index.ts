export type Role = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructorId: string;
  instructorName: string;
  price: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessonsCount: number;
  rating: number;
  studentsCount: number;
}
