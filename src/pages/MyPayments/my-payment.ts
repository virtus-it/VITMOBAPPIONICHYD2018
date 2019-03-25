import {ChangeDetectorRef, Component} from "@angular/core";
import {App, NavController, NavParams, IonicPage} from "ionic-angular";
import {APP_TYPE, APP_USER_TYPE, RES_SUCCESS, Utils} from "../../app/services/Utils";
import {GetService} from "../../app/services/get.servie";
import {TabsPage} from "../tabs/tabs";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  templateUrl: 'my-payment.html',
  selector: 'Payment-style'
})
export class MyPaymentPage {
  items: any;
  historyItems: any;
  tabBarElement: any;
  private loginStatus: boolean = false;
  private dealerID = "";
  private userID = "";
  private callFrom = "";

  constructor(private translateService: TranslateService, private ref: ChangeDetectorRef, public appCtrl: App, public navCtrl: NavController, public navParams: NavParams, private alertUtils: Utils, private getService: GetService) {
    translateService.setDefaultLang('en');
    translateService.use('en');

    this.callFrom = this.navParams.get("callfrom");
    this.alertUtils.showLog(this.items);
    // this.userID = "1891";
    // this.dealerID = "289";
    // this.fetchPaymentAmt(true, false, "");
    try {
      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }

  close() {
    this.appCtrl.getRootNav().setRoot(TabsPage, {from: "pushnotification"});
  }

  ionViewWillEnter() {
    try {
      this.tabBarElement.style.display = 'none';
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  ionViewWillLeave() {
    try {
      this.tabBarElement.style.display = 'flex';
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }


  ngOnInit() {
    this.alertUtils.getLoginState().then(res => {
      if (res) {
        this.loginStatus = res;
        this.alertUtils.getDealerId().then(res => {
          if (res) {
            this.dealerID = res;
            this.alertUtils.getUserId().then(res => {
              if (res) {
                this.userID = res;
                this.fetchPaymentAmt(true, false, "");
              }
            })
          }
        });
      }
    }).catch(err => {
      this.alertUtils.showLog(err);
    })
  }

  refresherFetchPaymentInfo(refresher) {
    this.fetchPaymentAmt(false, true, refresher);
  }

  fetchPaymentAmt(isFirst: boolean, isRefresh: boolean, refresher) {
    let input = {
      "root": {
        "userid": this.userID,
        "usertype": APP_USER_TYPE,
        "productid": "1",
        "loginid": this.userID,
        "apptype": APP_TYPE
      }
    };
    let data = JSON.stringify(input);
    this.getService.postReq(this.getService.getPaymentDetails(), data).then(res => {
      this.alertUtils.showLog(res);
      if (res.result == RES_SUCCESS) {
        if (res.data) {
          this.items = res.data[0];
          this.ref.detectChanges();
          this.fetchPaymentHistory(isFirst, isRefresh, false, refresher, "");
        }
      } else {
        if (isRefresh)
          refresher.complete();
      }
    }, err => {
      if (isRefresh)
        refresher.complete();
      this.alertUtils.showToast(this.alertUtils.INTERNET_ERR_MSG);
      this.alertUtils.showLog(err);
    });
  }

  doInfinite(paging): Promise<any> {
    if (this.historyItems) {
      if (this.historyItems.length > 0)
        this.fetchPaymentHistory(false, false, true, "", paging);
      else
        paging.complete();
    } else {
      paging.complete();
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 30000);
    })
  }

  fetchPaymentHistory(isFrist: boolean, isRefresh: boolean, isPaging: boolean, refresher, paging) {
    let input = {
      "order": {
        "userid": this.userID,
        "priority": "5",
        "usertype": APP_USER_TYPE,
        "status": "all",
        "lastrecordtimestamp": "15",
        "pagesize": "10",
        "first_orderid": "0",
        "customerid": this.userID,
        "productid": "1",
        "apptype": APP_TYPE
      }
    };
    if (isPaging) {
      input.order["last_paymentid"] = this.historyItems[this.historyItems.length - 1].paymentid;
    } else {
      input.order["last_paymentid"] = "0";
    }
    let data = JSON.stringify(input);
    this.getService.postReq(this.getService.getPaymentstHistoryByUserid(), data).then(res => {
      this.alertUtils.showLog(res);
      this.hideProgress(isRefresh, isPaging, paging, refresher);
      if (res.result == RES_SUCCESS) {
        if (res.data) {
          if (!isPaging)
            this.historyItems = res.data;
          this.alertUtils.showLog(this.historyItems);
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].status == 'received') {
              res.data[i]["statuscolor"] = "warning";
              res.data[i].status = "Dealer confirmation pending";
            } else if (res.data[i].status == 'confirm') {
              res.data[i].status = "Confirmed";
              res.data[i]["statuscolor"] = "success";
            } else if (res.data[i].status == 'rejected') {
              res.data[i]["statuscolor"] = "danger";
            }
            if (isPaging) {
              this.historyItems.push(res.data[i]);
            }
          }
        }
      } else {
        this.hideProgress(isRefresh, isPaging, paging, refresher);
      }
    }, err => {
      this.hideProgress(isRefresh, isPaging, paging, refresher);
      this.alertUtils.showLog(err);
    });
  }

  hideProgress(isRefresh, isPaging, paging, refresher) {
    if (isRefresh)
      refresher.complete();
    if (isPaging)
      paging.complete();
  }
}
