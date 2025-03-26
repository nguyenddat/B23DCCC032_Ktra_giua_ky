import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Popconfirm, notification } from 'antd';
import { Link } from 'react-router-dom';
import { getCourses, deleteCourse, canDeleteCourse } from '@/services/courseService';
import type { Course } from '@/models/course';

const { Search } = Input;
const { Option } = Select;

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [instructorFilter, setInstructorFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const data = getCourses();
    setCourses(data);
    setFilteredCourses(data);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterCourses(value, instructorFilter, statusFilter);
  };

  const handleInstructorFilter = (value: string) => {
    setInstructorFilter(value);
    filterCourses(searchText, value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterCourses(searchText, instructorFilter, value);
  };

  const filterCourses = (searchText: string, instructor: string, status: string) => {
    let filtered = courses;
    if (searchText) {
      filtered = filtered.filter(course => course.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    if (instructor) {
      filtered = filtered.filter(course => course.instructor === instructor);
    }
    if (status) {
      filtered = filtered.filter(course => course.status === status);
    }
    setFilteredCourses(filtered);
  };

  const handleDelete = (courseId: string) => {
    const course = courses.find(course => course.id === courseId);
    if (course && (course.studentCount == null || course.studentCount == 0)) {
      deleteCourse(courseId);
      setCourses(getCourses());
      setFilteredCourses(getCourses());
      notification.success({ message: 'Khóa học đã được xóa thành công!' });
    } else {
      notification.error({ message: 'Không thể xóa khóa học đã có học viên!' });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
      filters: [...new Set(courses.map(course => course.instructor))].map(instructor => ({
        text: instructor,
        value: instructor,
      })),
      onFilter: (value: string, record: Course) => record.instructor.includes(value),
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'studentCount',
      key: 'studentCount',
      sorter: (a: Course, b: Course) => a.studentCount - b.studentCount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đang mở', value: 'Open' },
        { text: 'Đã kết thúc', value: 'Closed' },
        { text: 'Tạm hoãn', value: 'Delayed' },
      ],
      onFilter: (value: string, record: Course) => record.status.includes(value),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text: string, record: Course) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/course/edit/${record.id}`}>
            <Button type="link" style={{ padding: 0, textDecoration: 'underline' }}>Chỉnh sửa</Button>
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khóa học này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" style={{ padding: 0, textDecoration: 'underline' }}>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link to="/course/new">
          <Button type="primary">Thêm mới khóa học</Button>
        </Link>
      </div>
      <Search
        placeholder="Tìm kiếm theo tên khóa học"
        onSearch={handleSearch}
        style={{ width: 200, marginBottom: 16 }}
      />
      <Select
        placeholder="Lọc theo giảng viên"
        onChange={handleInstructorFilter}
        style={{ width: 200, marginLeft: 16, marginBottom: 16 }}
      >
        {[...new Set(courses.map(course => course.instructor))].map(instructor => (
          <Option key={instructor} value={instructor}>
            {instructor}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Lọc theo trạng thái"
        onChange={handleStatusFilter}
        style={{ width: 200, marginLeft: 16, marginBottom: 16 }}
      >
        <Option value="Open">Đang mở</Option>
        <Option value="Closed">Đã kết thúc</Option>
        <Option value="Delayed">Tạm hoãn</Option>
      </Select>
      <Table columns={columns} dataSource={filteredCourses} rowKey="id" />
    </div>
  );
};

export default CourseList;