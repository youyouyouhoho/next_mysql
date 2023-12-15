// insertDataUtil.js
import { message } from 'antd';
import React, { useState } from 'react';

export const useInsertData = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'id':
        setId(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'number':
        setNumber(value);
        break;
      default:
        break;
    }
  };

  const handleInsert = async () => {
    try {
      const response = await fetch('/api/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name, number }),
      });

      if (response.ok) {
        console.log('Data inserted successfully!');
        message.success('数据插入成功！');
      } else {
        const errorData = await response.json(); // 解析错误信息
        console.error('Failed to insert data:', errorData.error);
        message.error(`Failed to insert data: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred while inserting data.');
    }
  };

  const renderInputs = () => (
    <div>
      <input
        type="text"
        name="id"
        placeholder="ID"
        value={id}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="number"
        placeholder="Number"
        value={number}
        onChange={handleInputChange}
      />
      <button onClick={handleInsert}>Insert Data</button>
    </div>
  );

  return {
    id,
    name,
    number,
    renderInputs,
  };
};
