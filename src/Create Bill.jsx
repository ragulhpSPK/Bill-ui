import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  notification,
} from "antd";
import "./App.css";
import { MinusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { isEmpty, sum } from "lodash";
import moment from "moment/moment";
import axios from "axios";
import { flatten } from "lodash";

function Bill({ updateId, data, fetchData, setOpen }) {
  const [inputs, setInputs] = useState([]);
  const [payment, setPayment] = useState("");
  const [desstination, setDestination] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [form] = Form.useForm();
  const [date, setDate] = useState("");
  const [charge, setCharge] = useState("");

  const handlePayment = (value) => {
    setPayment(value);
  };

  const handleDestination = (val) => {
    setDestination(val);
  };

  const handleVehicle = (val) => {
    setVehicle(val);
  };

  const handleCharge = (val) => {
    setCharge(val.target.checked);
  };

  useEffect(() => {
    updateId !== "" ? form.setFieldsValue(updateData) : form.setFieldsValue("");
  });

  const updateData = data?.filter((res) => {
    return res._id == updateId;
  })[0];

  const handleFinish = async (value) => {
    if (updateId === "") {
      try {
        const formData = {
          invoiceno: value.invoiceno,
          payment: payment,
          dispatch: vehicle,
          terms: value.terms,
          destination: desstination,
          address: value.address,
          gstin: value.gstin,
          charge: charge,
          products: value.products,
        };
        const result = await axios.post(
          `${process.env.REACT_APP_LOCAL_URI}/create`,
          formData
        );
        notification.success({ message: "Bill created successfully" });
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const formData = {
          invoiceno: value.invoiceno,
          payment: payment,
          dispatch: vehicle,
          terms: value.terms,
          destination: desstination,
          address: value.address,
          gstin: value.gstin,
          charge: charge,
          products: value.products,
        };
        const result = await axios.put(
          `${process.env.REACT_APP_LOCAL_URI}/update/${updateId}`,
          formData
        );
        fetchData();
        notification.success({ message: "Bill created successfully" });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const qty = form?.getFieldsValue()?.products?.map((data) => {
    return data.qty;
  });
  const newList = qty?.map((string) => parseInt(string));

  var amnt = form?.getFieldsValue()?.products?.map((data) => {
    return data.qty * data.Rate;
  });

  const handleDate = (val) => {
    console.log(val?.$y);
    const date = moment(`${val?.$D}-${val?.$M + 1}-${val?.$y}`).format(
      "MM-DD-YYYY"
    );
    setDate(date);
  };

  return (
    <div className="h-screen  flex flex-col items-center pt-[10vh] justify-start">
      <table class="w-[80vw]  border border-slate-300 ...">
        <thead>
          <tr>
            <th
              class="border border-slate-300 ...  text-start pl-10 font-semibold"
              colSpan={3}
            >
              Company Name
              <br />
              Address
              <br />
              number
            </th>
            <th
              class="border border-slate-300 ...  text-start pl-5 font-semibold"
              colSpan={3}
            >
              Invoice number:{inputs.invoiceno}
              <br />
              Invoice Date:{date}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-slate-300 ... pl-5" colSpan={3}>
              Buyer:
              <br />
              <span className="pl-20"> Gstin:{inputs.gstin}</span>
            </td>
            <td
              class="border border-slate-300 ... pl-4 font-semibold"
              colSpan={3}
            >
              Dispatch:{vehicle}
              <br />
              Destination:{desstination}
              <br />
              Mode Of Payment:{payment}
              <br />
              Terms of Delivery:{inputs.terms}
            </td>
          </tr>
          <tr>
            <td class="border border-slate-300 ... pl-5 font-bold">S.no</td>
            <td class="border border-slate-300 ... pl-5 font-bold">
              Description of goods
            </td>
            <td class="border border-slate-300 ... pl-5 font-bold">HSN</td>
            <td class="border border-slate-300 ... pl-5 font-bold">Qty</td>
            <td class="border border-slate-300 ... pl-5 font-bold">
              Rate Per Unit
            </td>
            <td class="border border-slate-300 ... pl-5 font-bold">Amount</td>
          </tr>
          {form?.getFieldsValue()?.products?.map((data, i) => {
            return (
              <tr>
                <td class="border border-slate-300 ... pl-5">{i + 1}</td>
                <td class="border border-slate-300 ... pl-5">{data.product}</td>
                <td class="border border-slate-300 ... pl-5">{data.hsn}</td>
                <td class="border border-slate-300 ... pl-5">{data.qty}</td>
                <td class="border border-slate-300 ... pl-5">{data.Rate}</td>
                <td class="border border-slate-300 ... pl-5">
                  {data.qty * data.Rate > 0 ? data.qty * data.Rate : ""}
                </td>
              </tr>
            );
          })}

          <tr>
            <td class="border border-slate-300 ... pl-5 text-end" colSpan={3}>
              CGST Tax @ 2.5%
            </td>

            <td class="border border-slate-300 ... pl-5"></td>
            <td class="border border-slate-300 ... pl-5"></td>
            <td class="border border-slate-300 ... pl-5"></td>
          </tr>
          <tr>
            <td class="border border-slate-300 ... pl-5 text-end" colSpan={3}>
              CGST Tax @ 2.5%
            </td>

            <td class="border border-slate-300 ... pl-5"></td>
            <td class="border border-slate-300 ... pl-5"></td>
            <td class="border border-slate-300 ... pl-5"></td>
          </tr>
          <tr>
            <td class="border border-slate-300 ... pl-5 text-end" colSpan={3}>
              Grand Total:
            </td>

            <td class="border border-slate-300 ... pl-5">
              {sum(newList) > 0 ? sum(newList) : ""}
            </td>
            <td class="border border-slate-300 ... pl-5"></td>
            <td class="border border-slate-300 ... pl-5">
              {amnt > 0 ? sum(amnt) : ""}
            </td>
          </tr>

          <tr>
            <td class="border border-slate-300 ... pl-5" colSpan={6}>
              <div className="flex gap-10 !font-semibold">
                <span className="flex">
                  <span className="flex gap-14">
                    <b className="font-semibold">Beneficiary Bank Name</b>{" "}
                    <b>:</b>
                  </span>
                  bank name
                </span>
                <span className="flex">
                  <span className="flex gap-14">
                    <b className="font-semibold">Beneficiary Bank IFSC</b>
                    <b>:</b>
                  </span>
                  bank ifsc
                </span>
              </div>
              <br />
              <div className="flex gap-9 font-semibold">
                <span className="flex">
                  <span className="flex gap-14">
                    <b className="font-semibold">Beneficiary Account No</b>
                    <b>:</b>
                  </span>
                  bank accno
                </span>
                <span className="flex">
                  <span className="flex gap-4">
                    <b className="font-semibold">Beneficiary Account Name</b>
                    <b>:</b>
                  </span>
                  acc name
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="border border-slate-300 ...  " colSpan={6}>
              <div className=" flex justify-between p-1">
                <span>Customer Seal and sign</span>
                <span>Customer Seal and sign</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="pt-3 flex flex-col">
        <p className="text-center">This is computed generate invoice</p>
        <Form
          layout="vertical "
          className="!w-[80vw] !h-[30vh] m-auto overflow-y-scroll"
          form={form}
          onFinish={handleFinish}
        >
          {updateId === "" ? (
            <div className="grid grid-cols-5  pt-5 gap-x-36 gap-y-12 ">
              <Form.Item label="Invoice no" name="invoiceno">
                <Input type="text" name="invoiceno" onChange={handleChange} />
              </Form.Item>
              <Form.Item label="Invoice Date">
                <DatePicker onChange={handleDate} />
              </Form.Item>
              <Form.Item label="Mode of payment" name="payment">
                <Select placeholder="Mode of payment" onChange={handlePayment}>
                  <Select.Option value="Credit">Credit</Select.Option>
                  <Select.Option value="Debit">Debit</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Dispatch" name="dispatch">
                <Select
                  placeholder="select vehicle no"
                  onChange={handleVehicle}
                >
                  <Select.Option value="tn42bw9494">tn42bw9494</Select.Option>
                  <Select.Option value="tn46bw1345">tn46bw1345</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Terms Of Delivery" name="terms">
                <Input
                  type="text"
                  name="terms"
                  placeholder="terms of delivery"
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item label="Customer" name="destination">
                <Select
                  placeholder="select destination"
                  onChange={handleDestination}
                >
                  <Select.Option value="Karur">Karur</Select.Option>
                  <Select.Option value="trichy">trichy</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Address" name="address">
                <Input type="text" placeholder="address" />
              </Form.Item>
              <Form.Item label="Gstin" name="gstin">
                <Input type="text" name="gstin" onChange={handleChange} />
              </Form.Item>
              <Form.Item label="Includes transportation charge">
                <Input type="checkbox" name="charge" onChange={handleCharge} />
              </Form.Item>
            </div>
          ) : (
            <div className="grid grid-cols-5  pt-5 gap-x-36 gap-y-12 ">
              <Form.Item label="Invoice no" name="invoiceno">
                <Input type="text" name="invoiceno" />
              </Form.Item>
              <Form.Item label="Invoice Date" onChange={handleDate}>
                <DatePicker />
              </Form.Item>
              <Form.Item label="Mode of payment">
                <Select placeholder="Mode of payment" onChange={handlePayment}>
                  <Select.Option value="Credit">Credit</Select.Option>
                  <Select.Option value="Debit">Debit</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Dispatch">
                <Select
                  placeholder="select vehicle no"
                  onChange={handleVehicle}
                >
                  <Select.Option value="tn42bw9494">tn42bw9494</Select.Option>
                  <Select.Option value="tn46bw1345">tn46bw1345</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Terms Of Delivery" name="terms">
                <Input
                  type="text"
                  name="terms"
                  placeholder="terms of delivery"
                />
              </Form.Item>
              <Form.Item label="Customer">
                <Select
                  placeholder="select destination"
                  onChange={handleDestination}
                >
                  <Select.Option value="Karur">Karur</Select.Option>
                  <Select.Option value="trichy">trichy</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Address" name="address">
                <Input type="text" placeholder="address" />
              </Form.Item>
              <Form.Item label="Gstin" name="gstin">
                <Input type="text" name="gstin" onChange={handleChange} />
              </Form.Item>
              <Form.Item label="Includes transportation charge">
                <Input type="checkbox" name="charge" onChange={handleCharge} />
              </Form.Item>
            </div>
          )}
          <Form.List name={"products"}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  return (
                    <Space direction="horizontal" size={12} className="add">
                      <Form.Item
                        name={[field.name, "product"]}
                        label={`product ${index + 1}`}
                      >
                        <Input
                          placeholder="Product"
                          name="product"
                          onChange={handleChange}
                        />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "hsn"]}
                        label={`HSN ${index + 1}`}
                      >
                        <Input
                          placeholder="Hsn"
                          name="hsn"
                          onChange={handleChange}
                        />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "qty"]}
                        label={`Qty ${index + 1}`}
                      >
                        <Input
                          placeholder="Qty"
                          name="qty"
                          onChange={handleChange}
                        />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "Rate"]}
                        label={`Rate ${index + 1}`}
                      >
                        <Input
                          placeholder="Rate"
                          name="rate"
                          onChange={handleChange}
                        />
                      </Form.Item>
                      <MinusCircleOutlined
                        style={{
                          height: 40,
                          color: "red",
                        }}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </Space>
                  );
                })}

                <Form.Item>
                  <Button
                    type="primary"
                    block
                    onClick={() => {
                      add();
                    }}
                    className="!w-[7vw] bg-blue-700"
                  >
                    Add product
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Button
            htmlType="submit"
            className="bg-blue-700 !w-[7vw] text-white"
            onClick={() => {
              setOpen(false);
            }}
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Bill;
