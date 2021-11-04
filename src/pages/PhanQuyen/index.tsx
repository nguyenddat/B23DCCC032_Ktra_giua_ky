import { Card, Select } from 'antd';
import NhomVaiTro from './NhomVaiTro';
import { useModel } from 'umi';
import { Role } from '@/utils/constants';
import ChucNang from './ChucNang';

const PhanQuyen = () => {
  const { setVaiTro } = useModel('phanquyen');

  return (
    <Card title="Chức năng - Nhóm vai trò">
      <div>
        <b>Vai trò hệ thống: </b>
        <Select
          onChange={(val) => {
            setVaiTro(val);
          }}
          style={{ width: 200 }}
          value={'can_bo'}
        >
          {['can_bo'].map((item) => (
            <Select.Option key={item} value={item}>
              {Role?.[item] ?? ''}
            </Select.Option>
          ))}
        </Select>
      </div>
      <br />
      <NhomVaiTro />
      <br />
      <ChucNang />
    </Card>
  );
};

export default PhanQuyen;
