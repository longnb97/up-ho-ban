// Angular
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

@Injectable()
export class MessagesUtilsService {

	constructor(
		private messageService: MessageService,
		private translateService: TranslateService,
		private confirmationService: ConfirmationService
	) { }

	/**
	 * show custom message primneng
	 * @param severity
	 * @param summaryKey 
	 * @param detailMessageKey 
	 * @param additionalDetail 
	 */
	showCustomMessage(severity: string, summaryKey: string, detailMessageKey: string, additionalDetail?: string) {
		this.messageService.clear();
		const summaryMessage: string = this.translateService.instant(summaryKey);
		const detailMessage: string = this.translateService.instant(detailMessageKey);
		// do show message
		if (additionalDetail === undefined) {
			this.messageService.add({ key: 'toast', severity: severity, summary: summaryMessage, detail: detailMessage });
		} else {
			this.messageService.add({ key: 'toast', severity: severity, summary: summaryMessage, detail: detailMessage + ' ' + additionalDetail });
		}
	}

	// show delete success message
	showDeleteSuccessMessage() {
		this.showCustomMessage('success', 'ACTION.DELETE', 'ACTION.MESSAGES.DELETE_SUCCEED');
	}

	/**
	 * show delete failed message
	 * @param detailMessage 
	 */
	showDeleteFailedMessage(detailMessage?: string) {
		this.showCustomMessage('error', 'ACTION.DELETE', 'ACTION.MESSAGES.DELETE_FAILED', detailMessage);
	}

	// show update success message
	showUpdateSuccessMessage() {
		this.showCustomMessage('success', 'ACTION.UPDATE', 'ACTION.MESSAGES.UPDATE_SUCCEED');
	}

	/**
	 * show update failed message
	 * @param detailMessage 
	 */
	showUpdateFailedMessage(detailMessage?: string) {
		this.showCustomMessage('error', 'ACTION.UPDATE', 'ACTION.MESSAGES.UPDATE_FAILED', detailMessage);
	}

	// show confirmation dialog
	showDeleteConfirm(accepFunction: Function, rejectFunction?: Function) {
		this.confirmationService.confirm({
			message: this.translateService.instant('ACTION.MESSAGES.CONFIRM_DELETE'),
			accept: accepFunction,
			reject: rejectFunction
		});
	}
	// show confirmation dialog
	showActiveConfirm(accepFunction: Function, rejectFunction?: Function) {
		this.confirmationService.confirm({
			message: this.translateService.instant('ACTION.MESSAGES.CONFIRM_ACTIVE'),
			accept: accepFunction,
			reject: rejectFunction
		});
	}
	// show custom confirmation dialog
	showCustomConfirm(accepFunction: Function, rejectFunction: Function, msg: string) {
		const translateMessage: string = this.translateService.instant(msg);
		this.confirmationService.confirm({
			message: translateMessage,
			accept: accepFunction,
			reject: rejectFunction
		});
	}
}
