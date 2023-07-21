import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Popconfirm, message, notification, Button } from 'antd';
import InputSearchBook from './InputSearchBook';
import { parseISO, format } from 'date-fns';
import { callFetchListBook, callDeleteBook } from '../../../services/api';
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import BookViewDetail from './BookViewDetail';
import BookModalCreate from './BookModalCreate';
import BookModalUpdate from './BookModalUpdate';
import * as XLSX from 'xlsx';


const BookTable = () => {
    const [listBook, setListBook] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort = -updatedAt");
    const [total, setTotal] = useState(0);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState(null);

    const [openModalCreate, setOpenModalCreate] = useState(false)

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);


    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery]);

    const fetchBook = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;

        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }

        const res = await callFetchListBook(query);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>
                        {record._id}
                    </a>
                )
            }
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: true
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record) => {
                const date = parseISO(record.updatedAt);
                const formattedDate = format(date, 'dd/MM/yyyy HH:mm:ss'); // Định dạng ngày giờ theo ý muốn, ví dụ: 22/05/2023 06:22:09
                return <span>{formattedDate}</span>;
            },
        },
        {
            title: 'Action',
            width: 100,
            render: (text, record, index) => {
                // return (
                //     <><button>Delete</button></>
                // )
                return (
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa book"}
                            description={"Bạn có chắc chắn muốn xóa book này ?"}
                            onConfirm={() => handleDeleteBook(record._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>

                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer" }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataUpdate(record)
                            }}
                        />
                    </div>
                )
            }
        }
    ];


    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
        console.log('params', pagination, filters, sorter, extra);
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }
    };

    const handleExportData = () => {
        // https://stackoverflow.com/questions/70871254/how-can-i-export-a-json-object-to-excel-using-nextjs-react
        if (listBook.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listBook);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportBook.xlsx");
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Books</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={() => handleExportData()}
                    >
                        Export
                    </Button>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => setOpenModalCreate(true)}
                    >
                        Thêm mới
                    </Button>
                    <Button
                        type='ghost'
                        onClick={() => {
                            setFilter("");
                            setSortQuery("")
                        }}
                    >
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
        )
    }

    const handleSearch = (query) => {
        setFilter(query);
    }

    const handleDeleteBook = async (_id) => {
        const res = await callDeleteBook(_id);
        if (res && res.data) {
            message.success('Xóa book thành công');
            fetchBook();
        }
        else {
            notification.error({
                message: "có lỗi xảy ra",
                description: res.message
            });
        }
    };

    return (
        <>
            <div style={{ padding: 10 }}>
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <InputSearchBook
                            handleSearch={handleSearch}
                            setFilter={setFilter}
                        />
                    </Col>
                    <Col span={24}>
                        <Table
                            title={renderHeader}
                            loading={isLoading}
                            columns={columns}
                            dataSource={listBook}
                            onChange={onChange}
                            rowKey='_id'
                            pagination={
                                {
                                    current: current,
                                    pageSize: pageSize,
                                    showSizeChanger: true,
                                    total: total,
                                    showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total} row </div>) }
                                }
                            }
                        />
                    </Col>
                </Row>
                <BookViewDetail
                    openViewDetail={openViewDetail}
                    setOpenViewDetail={setOpenViewDetail}
                    dataViewDetail={dataViewDetail}
                    setDataViewDetail={setDataViewDetail}
                />
                <BookModalCreate
                    openModalCreate={openModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                />
                <BookModalUpdate
                    openModalUpdate={openModalUpdate}
                    setOpenModalUpdate={setOpenModalUpdate}
                    dataUpdate={dataUpdate}
                    setDataUpdate={setDataUpdate}
                    fetchBook={fetchBook}
                />
            </div>
        </>
    )
}

export default BookTable;