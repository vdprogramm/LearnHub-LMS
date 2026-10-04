import React from 'react';
import type { Course } from '../types';
import { Star, Clock, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
  linkTo?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, linkTo = `/courses/${course.id}` }) => {
  return (
    <Link to={linkTo} className="group block h-full">
      <div className="bg-surface rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-800 shadow-sm">
            {course.level}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
              Development
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
              <Star size={16} className="fill-current" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
            {course.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              <span>{course.lessonsCount} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{course.studentsCount}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${course.instructorName}&background=random`} alt={course.instructorName} />
              </div>
              <span className="text-sm font-medium text-gray-700">{course.instructorName}</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              ${course.price.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
