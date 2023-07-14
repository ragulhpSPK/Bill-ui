import { Modal, Table, notification } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Bill from "./Create Bill";

function Read() {
  const [datas, setDatas] = useState([]);
  const [updateId, setUpdateId] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_LOCAL_URI}`);
      setDatas(result.data.message);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (values) => {
    console.log(values);
    try {
      await axios.delete(
        `${process.env.REACT_APP_LOCAL_URI}/delete/${values._id}`
      );
      notification.success({ message: `Deleted ${values._id}` });
      fetchData();
    } catch (e) {
      console.log(e);
    }
  };

  const handleEdit = (values) => {
    setUpdateId(values._id);
    setOpen(true);
  };

  const columns = [
    {
      title: "Invoice No",
      dataIndex: "invoiceno",
      key: "invoiceno",
      render: (name) => <p>{name}</p>,
    },
    {
      title: "Payment",
      dataIndex: "payment",
      key: "payment",
      render: (name) => <p>{name}</p>,
    },
    {
      title: "Dispatch",
      dataIndex: "dispatch",
      key: "dispatch",
      render: (name) => <p>{name}</p>,
    },
    {
      title: "Terms",
      dataIndex: "terms",
      key: "terms",
      render: (name) => <p>{name}</p>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (name) => <p>{name}</p>,
    },
    {
      title: "Gstin",
      dataIndex: "gstin",
      key: "gstin",
      render: (name) => <p>{name}</p>,
    },
    {
      title: "Charge",
      dataIndex: "charge",
      key: "charge",
      render: (name) => <p>{name}</p>,
    },
    {
      title: "Delete",
      render: (values) => {
        return <DeleteIcon onClick={() => handleDelete(values)} />;
      },
    },
    {
      title: "Edit",
      render: (values) => {
        return <EditIcon onClick={() => handleEdit(values)} />;
      },
    },
  ];

  return (
    <div className="w-[80vw] m-auto">
      <Table columns={columns} dataSource={datas} />

      <Modal
        open={open}
        width={2000}
        onCancel={() => {
          setOpen(!open);
          setUpdateId([]);
        }}
      >
        <Bill
          updateId={updateId}
          data={datas}
          fetchData={fetchData}
          setOpen={setOpen}
        />
      </Modal>
    </div>
  );
}

export default Read;
