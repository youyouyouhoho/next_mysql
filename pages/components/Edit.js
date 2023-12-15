
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

const defaultData = [
  {
    id: '624748504',
    title: '活动名称一',
    decs: '甜甜圈真好吃',
    state: 'open',
    created_at: 1590486176000,
    update_at: 1590486176000,
  },
  {
    id: '624691229',
    title: '活动名称二',
    decs: '这个活动真好玩',
    state: 'closed',
    created_at: 1590481162000,
    update_at: 1590481162000,
  },
];

const EditableTable = () => {
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [position, setPosition] = useState('bottom');
  const formRef = useRef();  
  const [showTable, setShowTable] = useState(false); 
  const onSave = async () => {
    try {
      let successCount = 0;
      // 遍历 dataSource，对每个元素进行更新
    for (const data of dataSource) {
      // 构造 API 请求的数据
      const requestData = {
        DGroupID:data.DGroupID,
        DMem1Name: data.DMem1Name,
        DMem2Name: data.DMem2Name,
        DMem3Name: data.DMem3Name,
        DMem4Name: data.DMem4Name,
        DMem5Name: data.DMem5Name,
        // 其他需要的字段
      };

      // 发送 API 请求，更新 MySQL 表
      const response = await fetch(`/api/updateDefenseInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      //改
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
      
      // const response = await fetch('/api/saveData', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ data: tableData }),
      // });

      // if (response.ok) {
      //   message.success('保存成功');
      // } else {
      //   message.error('保存失败');
      // }
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



  // const getColumnSearchProps = (dataIndex) => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //     close,
  //   }) => (
  //     <div style={{ padding: 8 }}>
  //       <Input
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) =>
  //           setSelectedKeys(e.target.value ? [e.target.value] : [])
  //         }
  //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //         style={{ width: 188, marginBottom: 8, display: 'block' }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Search
  //         </Button>
  //         <Button
  //           onClick={() => handleReset(clearFilters)}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Reset
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered) => (
  //     <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  //   ),
  //   onFilter: (value, record) =>
  //   record[dataIndex]
  //       .toString()
  //       .toLowerCase()
  //       .includes(value.toLowerCase()),
  //   onFilterDropdownVisibleChange: (visible) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select());
  //     }
  //   },
  // });

  // const searchInput = useRef(null);
  // const [searchText, setSearchText] = useState('');
  // const [searchedColumn, setSearchedColumn] = useState('');

  // const handleSearch = (selectedKeys, confirm, dataIndex) => {
  //   confirm();
  //   setSearchText(selectedKeys[0]);
  //   setSearchedColumn(dataIndex);
  // };

  // const handleReset = (clearFilters) => {
  //   clearFilters();
  //   setSearchText('');
  // };

  const columns = [
    {
      title: '组号',
      dataIndex: 'DGroupID',
      width: '15%',
      valueType: 'digit', 
      editable: true,
    },
    {
      title: '答辩委员1',
      dataIndex: 'DMem1Name',
      width: '15%',
      editable: true,
    },
    {
      title: '答辩委员2',
      dataIndex: 'DMem2Name',
      width: '15%',
      editable: true,
    },
    {
      title: '答辩委员3',
      dataIndex: 'DMem3Name',
      width: '15%',
      editable: true,
    },
    {
      title: '答辩委员4',
      dataIndex: 'DMem4Name',
      width: '15%',
      editable: true,
    },
    {
      title: '外校委员',
      dataIndex: 'DMem5Name',
      width: '15%',
      editable: true,
    },
    // {
    //   title: '活动名称',
    //   dataIndex: 'title',
    //   tooltip: '只读，使用form.getFieldValue获取不到值',
    //   formItemProps: (form, { rowIndex }) => {
    //     return {
    //       rules: rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
    //     };
    //   },
    //   editable: (text, record, index) => {
    //     return index !== 0;
    //   },
    //   width: '15%',
    //   // ...getColumnSearchProps('title'),
    // },
    // {
    //   title: '活动名称二',
    //   dataIndex: 'readonly',
    //   tooltip: '只读，使用form.getFieldValue可以获取到值',
    //   readonly: true,
    //   width: '15%',
    // },
    // {
    //   title: '状态',
    //   key: 'state',
    //   dataIndex: 'state',
    //   valueType: 'select',
    //   valueEnum: {
    //     all: { text: '全部', status: 'Default' },
    //     open: { text: '未解决', status: 'Error' },
    //     closed: { text: '已解决', status: 'Success' },
    //   },
    // },
    // {
    //   title: '描述',
    //   dataIndex: 'decs',
    //   fieldProps: (form, { rowKey, rowIndex }) => {
    //     if (form.getFieldValue([rowKey || '', 'title']) === '不好玩') {
    //       return {
    //         disabled: true,
    //       };
    //     }
    //     if (rowIndex > 9) {
    //       return {
    //         disabled: true,
    //       };
    //     }
    //     return {};
    //   },
    // },
    // {
    //   title: '活动时间',
    //   dataIndex: 'created_at',
    //   valueType: 'date',
    // },
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
          编辑
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
        编辑答辩表
      </Button>
      {/* EditableProTable 组件，可编辑表格 */}
      {showTable && (
      <>
      <EditableProTable
          style={{
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
          }}
        
        rowKey="id"
        headerTitle={
          <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
              答辩表格
          </div>
        }
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
        // 异步请求数据的配置
        // request={async () => ({
        //   data: defaultData,
        //   total: 3,
        //   success: true,
        // })}
        // 数据源和变更数据的回调函数
        value={dataSource}
        onChange={setDataSource}
        // 可编辑配置
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            // TODO: 在这里添加保存编辑行的逻辑
            // 更新 dataSource
            const updatedDataSource = dataSource.map((item) =>
              item.DGroupID  === rowKey ? { ...item, ...data[0] } : item
            );
            setDataSource(updatedDataSource);
      
            await waitTime(200);
          },
          onChange: setEditableRowKeys,
          
        }}
      />
<div style={{ display: 'flex', justifyContent: 'flex-end' ,  marginLeft: '-10px'}}>
  <div>
    <Button type="primary" onClick={onSave}>
      保存
    </Button>
    {/* 重置按钮 */}
    <Button style={{ margin: '15px 8px 0' }} onClick={() => setShowTable(false)}>
      取消
    </Button>
  </div>
</div>



  
      
      </>
      )}
    </>
  );
  
};

export default EditableTable;
