import { Course } from '../models/course';

const COURSE_STORAGE_KEY = 'courses';

export const getCourses = (): Course[] => {
  const courses = localStorage.getItem(COURSE_STORAGE_KEY);
  return courses ? JSON.parse(courses) : [];
};

export const saveCourses = (courses: Course[]): void => {
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
};

export const addCourse = (course: Course): void => {
  const courses = getCourses();
  courses.push(course);
  saveCourses(courses);
};

export const updateCourse = (updatedCourse: Course): void => {
  const courses = getCourses().map(course =>
    course.id === updatedCourse.id ? updatedCourse : course
  );
  saveCourses(courses);
};

export const deleteCourse = (courseId: string): void => {
  const courses = getCourses().filter(course => course.id !== courseId);
  saveCourses(courses);
};

export const canDeleteCourse = (courseId: string): boolean => {
  const course = getCourses().find(course => course.id === courseId);
  return course ? course.studentCount === 0 : false;
};