import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, notification } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { getCourses, addCourse, updateCourse } from '@/services/courseService';
import type { Course } from '@/models/course';

const { Option } = Select;

const CourseForm: React.FC = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const data = getCourses();
    setCourses(data);
    if (id) {
      const existingCourse = data.find(course => course.id === id);
      if (existingCourse) {
        setCourse(existingCourse);
        form.setFieldsValue(existingCourse);
      }
    }
  }, [id, form]);

  const handleFinish = (values: Course) => {
    if (id) {
      // Update course
      updateCourse({ ...values, id });
      notification.success({ message: 'Khóa học đã được cập nhật thành công!' });
    } else {
      // Check for duplicate course name
      if (courses.some(course => course.name === values.name)) {
        notification.error({ message: 'Tên khóa học đã tồn tại!' });
        return;
      }
      // Add new course
      addCourse({ ...values, id: String(Date.now()) });
      notification.success({ message: 'Khóa học đã được thêm thành công!' });
    }
    history.push('/course-list');
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={course || { status: 'Open' }}
    >
      <Form.Item
        name="name"
        label="Tên khóa học"
        rules={[
          { required: true, message: 'Vui lòng nhập tên khóa học' },
          { max: 100, message: 'Tên khóa học không được vượt quá 100 ký tự' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="instructor"
        label="Giảng viên"
        rules={[{ required: true, message: 'Vui lòng nhập tên giảng viên' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label="Mô tả khóa học"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="status"
        label="Trạng thái khóa học"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái khóa học' }]}
      >
        <Select>
          <Option value="Open">Đang mở</Option>
          <Option value="Closed">Đã kết thúc</Option>
          <Option value="Delayed">Tạm hoãn</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {id ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CourseForm;