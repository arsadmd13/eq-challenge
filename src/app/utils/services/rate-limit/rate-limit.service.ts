import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RateLimitService {

  constructor() { }

  @Output()
  rateLimitEvent: EventEmitter<any> = new EventEmitter<any>()

  private isApiRateLimitedVal = true;
  private isSeverRejectingRequestsVal = false;
  private cooldownTimeVal = 0;

  get isApiRateLimited() {
    return this.isApiRateLimitedVal;
  }

  get isSeverRejectingRequests() {
    return this.isSeverRejectingRequestsVal;
  }

  get cooldownTime() {
    return this.cooldownTimeVal;
  }

  set isApiRateLimited(val) {
    this.isApiRateLimitedVal = val;
  }

  set isSeverRejectingRequests(val) {
    this.isSeverRejectingRequestsVal = val;
  }

  set cooldownTime(val) {
    this.cooldownTimeVal = val;
  }

  setRateLimitData(status: boolean = false, time: number = 0) {
    this.isSeverRejectingRequestsVal = status;
    this.cooldownTimeVal = time;
    this.rateLimitEvent.emit({
      limited: this.isSeverRejectingRequestsVal,
      time: this.cooldownTimeVal
    })
  }
}
