import React from "react";
import './index.scss'
import {images} from "../../static/icon";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import ShowAction from "../../static/showAction.png";
import PopupBillMethod from "./billComponent/billMethod";
import PopupActivity from "./billComponent/billActivity";


const PopupBill = () => {
    return (
        <>
        <div className="bill-container">
            <div className="bill-header">Billing & payments</div>
            <div className="bill-body" style={{height:"100vh"}}>
            <div className="bill-title">
                <div className={"title-tab"}>
                    <Tabs variant='soft-rounded'  >
                        <div className={"tab"}>

                        <TabList className="title-action">
                            <Tab _selected={{ color: '#000', bg: 'rgb(170 201 255)',borderRadius: '10px', }}>
                                <div className="action-payment flexContent">
                                    <img className="payment-image" alt="" src={images.PaymentMethod} style={{backgroundColor:"transparent"}}/>
                                    <p className={"payment-title"}>Payment methods</p>
                                </div>
                            </Tab>


                            <Tab _selected={{ color: '#000', bg: 'rgb(170 201 255)',borderRadius: '10px', }}>
                                <div className="action-payment flexContent">
                                    <img className="payment-image" alt="" src={images.PaymentActivity} style={{backgroundColor:"transparent"}}/>
                                    <p className={"payment-title"}>Payment Activity</p>
                                </div>
                            </Tab>

                                <div className="action-activity flexEnd">
                                    <img className="activity-image " alt="" src={images.ShowAction} />
                                </div>

                        </TabList>
                        <TabPanels>
                            <TabPanel style={{padding:0}}>
                                <PopupBillMethod/>
                            </TabPanel>
                            <TabPanel style={{padding:0}}>
                                <PopupActivity/>
                            </TabPanel>
                        </TabPanels>
                        </div>
                    </Tabs>
                </div>
            </div>
            <div className="bill-detail"></div>
            <div className="bill-data"></div>
            </div>

        </div>
        </>
    )
}
export default PopupBill;