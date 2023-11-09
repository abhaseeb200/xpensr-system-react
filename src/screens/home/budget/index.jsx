import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Container,
  Label,
  Spinner,
  Table,
} from "reactstrap";
import SideNavbar from "../../../components/sideNavbar";
import CustNavbar from "../../../components/navbar";
import { useEffect, useState } from "react";
import CustomInput from "../../../components/input";
import TransactionCategoryModal from "../modal";
import { getBudget, setBudget } from "../../../config/service/firebase/budget";

const Budget = () => {
  const [sideBarToggle, setSideBarToggle] = useState(false);
  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [tableLoader, setTableLoader] = useState(true);
  const [budgetData, setBudgetData] = useState([]);

  const [name, setName] = useState({
    value: "",
    isError: false,
    messageError: "",
  });

  const [date, setDate] = useState({
    value: "",
    isError: false,
    messageError: "",
  });

  const [amount, setAmount] = useState({
    value: "",
    isError: false,
    messageError: "",
  });

  const nameHandler = (e) => {
    let expVal = e.target.value.trim().toLowerCase();
    if (expVal === "") {
      setName({
        value: e.target.value,
        isError: true,
        messageError: "Please provide name",
      });
    } else if (!expVal.match(/^[0-9a-z\s]+$/)) {
      setName({
        value: e.target.value,
        isError: true,
        messageError: "Special Character not allowed",
      });
    } else {
      setName({
        value: e.target.value,
        isError: false,
        messageError: "",
      });
    }
  };

  const dateHandler = (e) => {
    if (e.target.value === "") {
      setDate({
        value: e.target.value,
        isError: true,
        messageError: "Please select date",
      });
    } else {
      setDate({
        value: e.target.value,
        isError: false,
        messageError: "",
      });
    }
  };

  const amountHandler = (e) => {
    if (e.target.value === "") {
      setAmount({
        value: e.target.value,
        isError: true,
        messageError: "Please provide amount",
      });
    } else if (e.target.value <= 0) {
      setAmount({
        value: e.target.value,
        isError: true,
        messageError: "Amount must be greater than 0",
      });
    } else {
      setAmount({
        value: e.target.value,
        isError: false,
        messageError: "",
      });
    }
  };

  useEffect(() => {
    getBudgetHandler();
  }, []);

  const toggle = () => setModal(!modal);

  const addBudget = () => {
    if (name.value === "") {
      setName({
        value: name.value,
        isError: true,
        messageError: "Please provide name",
      });
    }
    if (date.value === "") {
      setDate({
        value: date.value,
        isError: true,
        messageError: "Please select date",
      });
    }
    if (amount.value === "") {
      setAmount({
        value: amount.value,
        isError: true,
        messageError: "Please provide amount",
      });
    }

    if (name.value === "" || date.value === "" || amount.value === "") {
      return;
    }

    //check validation
    if (!name.isError && !date.isError && !amount.isError) {
      setLoader(true);
      setBudget(name.value, date.value, amount.value)
        .then((res) => {
          console.log(res, "done");
          setLoader(false);
          getBudgetHandler()
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
        });
    }
  };

  const getBudgetHandler = () => {
    getBudget()
      .then((res) => {
        let tempBudgetData = [];
        res.forEach((element) => {
          tempBudgetData.push(element.data());
        });
        setTableLoader(false);
        setBudgetData(tempBudgetData);
      })
      .catch((err) => {
        setTableLoader(false);
        console.log(err);
      });
  };

  return (
    <div className="container-lg">
      <SideNavbar
        sideBarToggle={sideBarToggle}
        setSideBarToggle={setSideBarToggle}
        toggle={toggle}
      />
      <div className="layout-page">
        <CustNavbar setSideBarToggle={setSideBarToggle} />
        <h5 className="fw-bold py-3 my-3">Budget</h5>
        <Card className="">
          <CardBody className="pb-3">
            <CardTitle>Add Budget Goals</CardTitle>
          </CardBody>
          <CardBody className="pt-3 row">
            <div className="col-md-12 mb-3">
              <Label>Budget name</Label>
              <CustomInput
                placeholder="Bills"
                type="text"
                value={name.value}
                isError={name.isError}
                messageError={name.messageError}
                onChange={nameHandler}
              />
            </div>
            <div className="col-md-6 mb-3">
              <Label>Select Date</Label>
              <CustomInput
                placeholder=""
                type="date"
                value={date.value}
                isError={date.isError}
                messageError={date.messageError}
                onChange={dateHandler}
              />
            </div>
            <div className="col-md-6 mb-3">
              <Label>Amount</Label>
              <CustomInput
                placeholder="1234"
                type="number"
                value={amount.value}
                isError={amount.isError}
                messageError={amount.messageError}
                onChange={amountHandler}
              />
            </div>
            <div className="col-md-12 w-100">
              <Button
                color="primary"
                className={loader ? "btn-disabled w-100" : "w-100"}
                onClick={addBudget}
              >
                {loader ? <Spinner size="sm"></Spinner> : "Add Budget"}
              </Button>
            </div>
          </CardBody>
        </Card>
        <Card className="mt-4">
          <CardBody className="pb-0">
            <CardTitle>Budget Goals</CardTitle>
          </CardBody>
          <CardBody className="pt-0">
            {tableLoader ? (
              <div className="no-data">
                <Spinner></Spinner>
              </div>
            ) : budgetData.length ? (
              <Table bordered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetData.map((item,ind) => {
                    return (
                      <tr key={ind}>
                        <td>{item.name}</td>
                        <td>{item.date}</td>
                        <td>{item.amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : (
              <CardText className="no-data">No Data found</CardText>
            )}
          </CardBody>
        </Card>
      </div>
      <TransactionCategoryModal modal={modal} toggle={toggle} />
    </div>
  );
};

export default Budget;
