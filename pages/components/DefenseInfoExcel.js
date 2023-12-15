// DefenseInfoExcel.js 答辩场次信息表
import React, { Component } from 'react';
import { Button, Upload, message, Table ,Input} from 'antd';
import * as XLSX from 'xlsx';
import { UploadOutlined } from '@ant-design/icons';
class DefenseInfoExcel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            excelData: [], // State to store Excel data
            errorRows: [], // State to store rows with errors
            
        };
    }

    onImportExcel = async (file) => {
        const fileReader = new FileReader();
        fileReader.onload = async (event) => {
            try {
                const { result } = event.target;
                const workbook = XLSX.read(result, { type: 'binary' });
                let data = [];
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    }
                }
                this.setState({ excelData: data, errorRows: [] }); // Set Excel data and clear error rows
                message.success('文件解析成功！');
            } catch (e) {
                message.error('文件类型不正确！');
            }
        };
        fileReader.readAsBinaryString(file);
    };

    handleInsertDefenseInfoToDB = async () => {
        try {
            
    
            let successCount = 0;
            const errorRows = [];
    
            for (let rowIndex = 0; rowIndex < this.state.excelData.length; rowIndex++) {
                const row = this.state.excelData[rowIndex];
                const mappedRow = {
                    groupNumber: parseInt(row['组号']),
                    sequence: parseInt(row['序号']),
                    qualificationNumber: row['资格证号'].toString(),
                    // 处理答辩时间字符串转换
                    defenseTimeStart: this.parseDefenseTime(row['答辩时间'])[0],
                    defenseTimeEnd: this.parseDefenseTime(row['答辩时间'])[1],
                    defenseLocation: row['答辩地点'],
                    committeeMember1: row['答辩委员1'],
                    committeeMember2: row['答辩委员2'],
                    committeeMember3: row['答辩委员3'],
                    committeeMember4: row['答辩委员4'],
                    externalCommitteeMember: row['外校委员'],
                };
    
                // Execute the SQL insert query for the 'DefenseInfo' table
                const response = await fetch('/api/insertDefenseInfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(mappedRow),
                });
    
                if (response.ok) {
                    successCount++;
                } else {
                    const errorData = await response.json();
                    console.error(`插入第 ${rowIndex + 1} 行数据失败：`, errorData.error);
                    errorRows.push({ rowNumber: rowIndex + 1, error: errorData.error });
                }
            }
    
            if (successCount === this.state.excelData.length) {
                message.success('所有数据插入成功！');
            } 
            else if (successCount === 0) {
                message.error('所有数据插入失败!请检查');
             }
            else {
                message.warning(`部分数据插入失败，成功插入 ${successCount} 条数据。请检查`);
                try {
                    const response = await fetch('/api/delete?table=defenseinfo', { method: 'DELETE' });
            
                    if (response.ok) {
                        message.success('表中所有数据已成功删除');
                        console.log('表中所有数据已成功删除');
                    } else {
                        const deleteErrorData = await response.json();
                        console.error('Failed to delete all data:', deleteErrorData.error);
                    }
                } catch (error) {
                    console.error('Error deleting data:', error);
                }
            }
    
            this.setState({ errorRows });
        } catch (error) {
            console.error('错误:', error);
            message.error('插入数据时发生错误。');
        }
    };
    

    // 添加答辩时间字符串解析函数
    parseDefenseTime = (timeString) => {
    const trimmedTimeString = timeString.trim();
    const parts = trimmedTimeString.split(/\s+/);
    const date = parts[0];
    const timeRange = parts[2];
    const [year, month, day] = date.split(/年|月|日/).filter(Boolean);
    const [startTime, endTime] = timeRange.split('-');
    const startTimeFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${startTime}:00`;
    const endTimeFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${endTime}:00`;
    return [startTimeFormatted, endTimeFormatted];
};


    render() {
        const columns =
            this.state.excelData.length > 0
                ? Object.keys(this.state.excelData[0]).map((key) => ({ title: key, dataIndex: key }))
                : [];

        return (
            <div>
                

                <Upload
                    onRemove={(file) => {
                        this.setState(({ fileList }) => {
                            const index = fileList.indexOf(file);
                            const newFileList = fileList.slice();
                            newFileList.splice(index, 1);
                            return {
                                fileList: newFileList,
                                excelData: [],
                                errorRows: [],
                            };
                        });
                    }}
                    beforeUpload={(file) => {
                        this.onImportExcel(file);
                        this.setState(({ fileList }) => ({
                            fileList: [...fileList, file],
                        }));
                        return false;
                    }}
                    fileList={this.state.fileList}
                >
                    <Button icon={<UploadOutlined />}  disabled={this.state.fileList.length > 0}>
                        选择文件
                    </Button>
                </Upload>

                {/* Display Excel data in a table */}
                {this.state.excelData.length > 0 && <Table dataSource={this.state.excelData} columns={columns} />}
                {this.state.excelData.length > 0 && <Button style={{ marginTop: '20px' }} onClick={this.handleInsertDefenseInfoToDB}>
                    将答辩场次信息插入数据库
                </Button>}    
                {/* Display error rows and reasons */}
                {this.state.errorRows.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <h3>插入失败的行：</h3>
                        <Table
                            dataSource={this.state.errorRows}
                            columns={[
                                { title: '行号', dataIndex: 'rowNumber' },
                                { title: '错误原因', dataIndex: 'error' },
                            ]}
                        />
                    </div>
                )}

                {/* Insert button to add each row to the database */}
                
            </div>
        );
    }
}

export default DefenseInfoExcel;
