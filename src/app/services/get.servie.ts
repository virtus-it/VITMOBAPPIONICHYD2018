import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { APP_TYPE, APP_USER_TYPE, IS_WEBSITE, Utils } from "./Utils";

export const APP_VER_CODE: string = "138";

@Injectable()
export class GetService {
  private static DEVELOPMENT_URL = "http://192.168.1.50:2221/";
  private static TESTING_URL = "http://104.211.247.42:3229/";
  private static PRODUCTION_URL = "http://moya.online/";
  private static PAYTM_PRODUCTION_URL = "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=";
  private static PAYTM_DEVELOPMENT_URL = "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=";

  http: any;
  private baseUrl: String;

  constructor(http: Http, private alertUtils: Utils) {
    this.http = http;
    this.baseUrl = GetService.PRODUCTION_URL;
  }

  static offers() {
    return "offers";
  }

  static getPoints() {
    return "points";
  }

  static notificationResponse() {
    return "notificationresponse";
  }

  static getProductDetailsById() {
    return "product/";
  }

  static getTemplate() {
    return "creategettemplates";
  }

  static updateOrder() {
    return "updateorder";
  }
  static payNowUrl() {
    return "generate_checksum_ionic";
  }
  static payTmCallBackUrl() {
    return this.PAYTM_DEVELOPMENT_URL;
  }

  getReq(url) {
    this.alertUtils.showLog("/" + this.baseUrl + url);
    let headers;
    if (IS_WEBSITE) {
      headers = new Headers({ 'Content-Type': 'application/json' });
    } else {
      headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("module", "moyacustomer");
      headers.append("framework", "moyaioniccustomer");
      headers.append("devicetype", "android");
      headers.append("apptype", APP_TYPE);
      headers.append("usertype", APP_USER_TYPE);
      headers.append("moyaversioncode", APP_VER_CODE);
    }

    this.alertUtils.showLog(JSON.stringify(headers));
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.baseUrl + url, options).map(res => res.json());
  }

  getReqForMap(url) {
    this.alertUtils.showLog("/" + url);
    return this.http.get(url).map(res => res.json());
  }

  postReq(url: string, input) {

    let headers;
    if (IS_WEBSITE) {
      headers = new Headers({ 'Content-Type': 'application/json' });
    } else {
      headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("module", "moyacustomer");
      headers.append("framework", "moyaioniccustomer");
      headers.append("devicetype", "android");
      headers.append("apptype", APP_TYPE);
      headers.append("usertype", APP_USER_TYPE);
      headers.append("moyaversioncode", APP_VER_CODE);

    }
    this.alertUtils.showLog(JSON.stringify(headers));
    let options = new RequestOptions({ headers: headers });
    this.alertUtils.showLog("/" + this.baseUrl + url);
    this.alertUtils.showLog(input);
    return this.http.post(this.baseUrl + url, input, options).map(res => res.json()).toPromise();
  }

  putReq(url: string, input) {
    let headers;
    if (IS_WEBSITE) {
      headers = new Headers({ 'Content-Type': 'application/json' });
    } else {
      headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("module", "moyacustomer");
      headers.append("framework", "moyaioniccustomer");
      headers.append("devicetype", "android");
      headers.append("apptype", APP_TYPE);
      headers.append("usertype", APP_USER_TYPE);
      headers.append("moyaversioncode", APP_VER_CODE);

    }
    this.alertUtils.showLog(JSON.stringify(headers));
    let options = new RequestOptions({ headers: headers });
    this.alertUtils.showLog("/" + this.baseUrl + url);
    this.alertUtils.showLog(input);
    return this.http.put(this.baseUrl + url, input, options).map(res => res.json())
      .toPromise();
  }

  getImg() {
    return this.baseUrl + "modules/uploads/"
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  forgotPwd() {
    return "forgotpwd/" + APP_TYPE + "/";
  }

  getProductsByCustomerId() {
    return "getproductsbycustomerid/";
  }

  getProductsByDistributerId() {
    return "getproductsbydistributerid";
  }

  getAreaWiseProducts() {
    return "getareawiseproducts";
  }

  getSignUpUrl() {
    return "createusersignup";
  }

  getOrderListByStatus() {
    return "orderlistbystatus";
  }

  getOrderDetails() {
    return "getorderbyid/" + APP_TYPE + "/";
  }

  cancelOrder() {
    return "cancelorder";
  }

  createMessageOnOrder() {
    return "createmessageonorder";
  }

  fetchUserInfo() {
    return "user/user/";
  }

  getPaymentDetails() {
    return "getpaymentdetails";
  }

  getPaymentstHistoryByUserid() {
    return "getpaymentstbyuserid";
  }

  login() {
    return "login";
  }

  mobileValidation() {
    return "mobilevalidation";
  }

  getFeedback() {
    return "getfeed_back";
  }

  createFeedback() {
    return "issue";
  }

  createFeedbackReply() {
    return "createreplytoissue";
  }

  invitefriends() {
    return "invitefriend";
  }

  updateUser() {
    return "user";
  }

  placeOrder() {
    return "mcreateorder";
  }

  getSchedules() {
    //	getschedules/userid/apptype
    return "getschedules/";

  }

  createScheduler() {
    return "createscheduler";

  }

  updateScheduleOrder() {
    return "scheduler";

  }

  setGCMRegister() {
    return "setgcmdetails";
  }

  changeScheduleStatus() {
    return "changeschedulestatus";

  }

  appFirstCall() {
    return "appfirstcall";
  }

}


