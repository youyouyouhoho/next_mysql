
import { Row, Col, Select, Button,message,Input, Space   } from 'antd'
import React, { useState,useRef  } from 'react';
import { ProForm,EditableProTable, ProCard, ProFormField, ProFormRadio } from '@ant-design/pro-components';
import { SearchOutlined } from '@ant-design/icons';
const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const ReviewinfoEdit = () => {
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [position, setPosition] = useState('bottom');

  const [showTable, setShowTable] = useState(false); 
  const onSave = async () => {
    try {
      let successCount = 0;
      // 遍历 dataSource，对每个元素进行更新
    for (const data of dataSource) {
      // 构造 API 请求的数据
      const requestData = {
        RGroupID:data.RGroupID,
        RMember1Name: data.RMember1Name,
        RMember2Name: data.RMember2Name,
        RMember3Name: data.RMember3Name,

      };

      // 发送 API 请求，更新 MySQL 表
      const response = await fetch(`/api/updateReviewInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        successCount++;
      } else {
        const errorData = await response.json();
        message.error(`更新失败，失败原因： ${errorData.error}`);

        break;
      }
    }

     // 所有更新都成功，调用 check_all API
     if (successCount === dataSource.length) {
      const requestData = {}; // 如果需要传递其他数据，可以在这里设置

      const checkAllResponse = await fetch(`/api/check_all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (checkAllResponse.ok) {
        message.success('插入成功');
      } else {
        const errorData = await checkAllResponse.json();
        message.error(`插入失败，失败原因： ${errorData.error}`);
        console.log(errorData);
      }
    }
      
    } catch (error) {
      console.error('保存失败:', error);
    }
  };
  const fetchDataFromMySQL = async () => {
    try {
        // 调用存储过程 cache_all
        const cacheResponse = await fetch('/api/cache_all', {
            method: 'POST',
        });

        if (cacheResponse.ok) {
            console.log('存储过程 cache_all 执行成功');
            
            setShowTable(true); // 显示表格
        } else {
            console.error('存储过程 cache_all 执行失败');
        }
    } catch (error) {
        console.error('获取数据失败:', error);
    }
};

  const columns = [
    {
      title: '组号',
      dataIndex: 'RGroupID',
      width: '15%',
      valueType: 'digit', 
      editable: true,
    },
    {
      title: '评阅委员1',
      dataIndex: 'RMember1Name',
      width: '15%',
      editable: true,
    },
    {
      title: '评阅委员2',
      dataIndex: 'RMember2Name',
      width: '15%',
      editable: true,
    },
    {
      title: '评阅委员3',
      dataIndex: 'RMember3Name',
      width: '15%',
      editable: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑评阅表
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <>
           <Button type="primary" size='large' style={{ margin: '10px', }} onClick={fetchDataFromMySQL}>
        编辑评阅表
      </Button>
      {/* EditableProTable 组件，可编辑表格 */}
      {showTable && (
      <>
      <EditableProTable
        rowKey="id"
        headerTitle="可编辑表格"
        controlled
        maxLength={5}
        scroll={{
          x: 960,
        }}
        recordCreatorProps={
          position !== 'hidden'
            ? {
                position: position,
                record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
              }
            : false
        }
        loading={false}
        toolBarRender={() => [
          // ProFormRadio.Group 组件，用于选择表格的渲染方式
          <ProFormRadio.Group
            key="render"
            fieldProps={{
              value: position,
              onChange: (e) => setPosition(e.target.value),
            }}
            options={[
              { label: '添加到顶部', value: 'top' },
              { label: '添加到底部', value: 'bottom' },
              { label: '隐藏', value: 'hidden' },
            ]}
          />,
        ]}
        columns={columns}
        value={dataSource}
        onChange={setDataSource}
        // 可编辑配置
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);

            const updatedDataSource = dataSource.map((item) =>
              item.DGroupID  === rowKey ? { ...item, ...data[0] } : item
            );
            setDataSource(updatedDataSource);
      
            await waitTime(200);
          },
          onChange: setEditableRowKeys,
          
        }}
      />
  {/* 保存按钮 */}
      <Button type="primary" onClick={onSave}>
        保存
      </Button>
      {/* 重置按钮 */}
      <Button style={{ margin: '15px 8px 0' }} onClick={() => setShowTable(false)}>
  取消
</Button>

  
      
      </>
      )}
    </>
  );
  
};

export default ReviewinfoEdit;
