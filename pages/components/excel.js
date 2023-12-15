import React, { Component } from 'react';
import { Button, Upload, message, Table } from 'antd';
import * as XLSX from 'xlsx';

class Excel extends Component {
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

    // Function to handle insertion of Excel data into the database
    handleInsertToDB = async () => {
        try {
            const columnMapping = {
                id: 'id',
                name: 'name',
                number: 'number',
            };
            let successCount = 0;
            const errorRows = [];

            for (let rowIndex = 0; rowIndex < this.state.excelData.length; rowIndex++) {
                const row = this.state.excelData[rowIndex];
                const mappedRow = {
                    id: row[columnMapping['id']],
                    name: row[columnMapping['name']],
                    number: row[columnMapping['number']],
                };

                const response = await fetch('/api/insert', {
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
                    message.error(`插入第 ${rowIndex + 1} 行数据失败：${errorData.error}`);
                    errorRows.push({ rowNumber: rowIndex + 1, error: errorData.error });
                }
            }

            if (successCount === this.state.excelData.length) {
                message.success('所有数据插入成功！');
            } else {
                message.warning(`部分数据插入失败，成功插入 ${successCount} 条数据。`);
                // 调用 delete.js API 删除表中所有数据
                const deleteResponse = await fetch('/api/delete', {
                    method: 'DELETE',
                });

                if (deleteResponse.ok) {
                    message.success('表中所有数据已成功删除');
                    console.log('表中所有数据已成功删除');
                } else {
                    const deleteErrorData = await deleteResponse.json();
                    console.error('Failed to delete all data:', deleteErrorData.error);
                }
            }

            this.setState({ errorRows });
        } catch (error) {
            console.error('错误:', error);
            message.error('插入数据时发生错误。');
        }
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
                    <Button icon="upload" disabled={this.state.fileList.length > 0}>
                        选择文件
                    </Button>
                </Upload>
{/* Insert button to add each row to the database */}
                <Button style={{ marginTop: '20px' }} onClick={this.handleInsertToDB}>
                    将数据插入数据库
                </Button>
                {/* Display Excel data in a table */}
                {this.state.excelData.length > 0 && <Table dataSource={this.state.excelData} columns={columns} />}

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

                
            </div>
        );
    }
}

export default Excel;
