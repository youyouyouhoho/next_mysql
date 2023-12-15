import React, { useState } from 'react';
import { Button, Table, Select,Popconfirm ,message} from 'antd';
import EditableTable from './components/Edit';
import PredefenseEdit from './components/predefenseinfoEdit';
import ReviewInfoExcel from'./components/reviewinfoEdit';
import { Empty } from 'antd';
const { Option } = Select;
import { DownloadOutlined ,DeleteOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
const SelectFromTest = () => {
  const [data, setData] = useState([]); // 用于存储数据库查询结果
  const [selectedTable, setSelectedTable] = useState(''); // 用于存储用户选择的表名
  const [isNull,setisNULL] = useState(1);
  const handleDeleteData = async () => {
    try {
      if (!selectedTable) {
        console.error('请选择要删除数据的表');
        return;
      }

      const response = await fetch(`/api/delete?table=${selectedTable}`, { method: 'DELETE' });
      if (response.ok) {
        message.success('表中所有数据已成功删除');
        console.log('表中所有数据已成功删除');
        setData([]); // Clear data after deletion
      } else {
        const deleteErrorData = await response.json();
        console.error('Failed to delete all data:', deleteErrorData.error);
        message.error('删除数据失败');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      message.error('删除数据时发生错误');
    }
  };
  const handleSelectFromDB = async () => {
    setisNULL(0);
    try {
      if (!selectedTable) {
        console.error('请选择要查询的表');
        return;
      }

      const response = await fetch(`/api/getData?table=${selectedTable}`); // 发送后端 API 的 GET 请求，传递表名参数
      if (response.ok) {
        const result = await response.json();
        setData(result.data); // 将数据库查询结果存储在 state 中以供显示
      } else {
        console.error('获取数据失败');
      }
    } catch (error) {
      console.error('错误:', error);
    }
  };
let columns = data.length > 0 ? Object.keys(data[0]).map((key) => ({ title: key, dataIndex: key })) : [];
  const handleTableSelectChange = (value) => {
    setisNULL(1);
    setData([]);
    setSelectedTable(value); // 更新用户选择的表名
    
  };
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    XLSX.writeFile(workbook, `${selectedTable}_data.xlsx`);
  };
  

  // Manually define Chinese column names for the "defenseinfo" table
  if (selectedTable === 'defenseinfo') {
    columns = [
      { title: '组号', dataIndex: 'DGroupID' },
      { title: '序号', dataIndex: 'StuOrder' },
      { title: '资格证号', dataIndex: 'Sno' },
      { title: '答辩开始时间', dataIndex: 'DStartTime' },
      { title: '答辩结束时间', dataIndex: 'DEndTime' },
      { title: '答辩地点', dataIndex: 'DPlace' },
      { title: '答辩委员1', dataIndex: 'DMem1Name' },
      { title: '答辩委员2', dataIndex: 'DMem2Name' },
      { title: '答辩委员3', dataIndex: 'DMem3Name' },
      { title: '答辩委员4', dataIndex: 'DMem4Name' },
      { title: '外校委员', dataIndex: 'DMem5Name' },
      // Add more columns as needed
    ];
  }

  if (selectedTable === 'advisor') {
    columns = [
      { title: '姓名', dataIndex: 'AdvisorName' },
      { title: '院系', dataIndex: 'Dno_Dname' },
      { title: '职称', dataIndex: 'Title' },  
      // Add more columns as needed
    ];
  }

  if (selectedTable === 'student') {
    columns = [
      { title: '资格证号', dataIndex: 'Sno' },
      { title: '姓名', dataIndex: 'Sname' },
      { title: '专业', dataIndex: 'Smajor' },
       { title: '导师姓名', dataIndex: 'AdvisorName' },
      { title: '论文题目', dataIndex: 'PaperTitle' },

    ];
  }
  if (selectedTable === 'committeemembers') {
    columns = [
      { title: '姓名', dataIndex: 'MemberName' },
      { title: '单位', dataIndex: 'Dno_Dname' },
      { title: '职称', dataIndex: 'Title' },
      { title: '是否硕导', dataIndex: 'IsMasterSupervisor' , render: (value) => (value === 0 ? '否' : '是')},
      { title: '校内or校外', dataIndex: 'IsFromOtherSchool', render: (value) => (value === 0 ? '校内' : '校外') },
      // Add more columns as needed
    ];
  }

  if (selectedTable === 'predefenseinfo') {
    columns = [
      { title: '组号', dataIndex: 'PDGroupID' },
      { title: '序号', dataIndex: 'StuOrder' },
      { title: '资格证号', dataIndex: 'Sno' },
      { title: '答辩开始时间', dataIndex: 'PDStartTime' },
      { title: '答辩结束时间', dataIndex: 'PDEndTime' },
      { title: '答辩地点', dataIndex: 'PDPlace' },
      { title: '预答辩委员1', dataIndex: 'PDMember1Name' },
      { title: '预答辩委员2', dataIndex: 'PDMember2Name' },
      { title: '预答辩委员3', dataIndex: 'PDMember3Name' },
      // Add more columns as needed
    ];
  }

  if (selectedTable === 'reviewinfo') {
    columns = [
      { title: '组号', dataIndex: 'RGroupID' },
      { title: '序号', dataIndex: 'StuOrder' },
      { title: '资格证号', dataIndex: 'Sno' },
      { title: '答辩开始时间', dataIndex: 'RStartTime' },
      { title: '答辩结束时间', dataIndex: 'REndTime' },
      { title: '答辩地点', dataIndex: 'RPlace' },
      { title: '评阅委员1', dataIndex: 'RMember1Name' },
      { title: '评阅委员2', dataIndex: 'RMember2Name' },
      { title: '评阅委员3', dataIndex: 'RMember3Name' },
      // Add more columns as needed
    ];
  }
  return (
    <div>
      <Select style={{margin: '10px', width: 200 }} onChange={handleTableSelectChange} placeholder="选择表">
      <Option value="advisor">导师信息表</Option>
  <Option value="committeemembers">委员信息表</Option>
  <Option value="student">学生信息表</Option>
  <Option value="predefenseinfo">预答辩场次信息表</Option>
    <Option value="reviewinfo">评阅场次信息表</Option>
    <Option value="defenseinfo">答辩场次信息表</Option>

        {/* 添加其他表名作为 Option */}
      </Select>

      <Button style={{
            margin: '10px'}} type="primary" onClick={handleSelectFromDB}>执行 SELECT 查询</Button>
      
      {data.length > 0 && (
        <div>
          <Table style={{
            margin: '10px',
            border: '1px solid #ddd',
            padding: '5px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            color: '#333',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            // 您可以继续添加其他样式属性
          }} dataSource={data} columns={columns}  scroll={{ x: true }} title={() => (
            <>
              <Button
                style={{ margin: '10px' }}
                type="primary"
                onClick={handleDownloadExcel}
                icon={<DownloadOutlined />}
              >
                下载表格
              </Button>
              <Popconfirm
                title="确定删除数据库中该表的所有数据吗？"
                onConfirm={handleDeleteData}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  style={{ margin: '10px' }}
                  type="danger"
                  icon={<DeleteOutlined />}
                >
                  删除数据
                </Button>
              </Popconfirm>
            </>
          )}/>

          {selectedTable === 'defenseinfo' && <EditableTable />}
          {selectedTable === 'predefenseinfo' && <PredefenseEdit />}
          {selectedTable === 'reviewinfo' && <ReviewInfoExcel />}
          
        </div>
      )}
      {data.length == 0 && isNull == 0 &&(
        <div>
          <Empty   description={
      <span>
        数据库中无此表数据，请先插入数据
      </span>
    } />;
        </div>
      )}
    </div>
  );
};

export default SelectFromTest;
