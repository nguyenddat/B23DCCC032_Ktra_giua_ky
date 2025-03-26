import { useState } from 'react';
import { getCourses, addCourse, updateCourse, deleteCourse } from '@/services/courseService';

export interface Course {
  id: string;
  name: string;
  instructor: string;
  studentCount: number;
  status: "Open" | "Close" | "Delayed";
}

const useCourseModel = () => {
  const [courses, setCourses] = useState<Course[]>(getCourses());

  const addNewCourse = (course: Course) => {
    addCourse(course);
    setCourses(getCourses());
  };

  const updateExistingCourse = (course: Course) => {
    updateCourse(course);
    setCourses(getCourses());
  };

  const deleteExistingCourse = (courseId: string) => {
    deleteCourse(courseId);
    setCourses(getCourses());
  };

  return {
    courses,
    addNewCourse,
    updateExistingCourse,
    deleteExistingCourse,
  };
};

export default useCourseModel;