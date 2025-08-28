// utils/IframeMessengerChild.ts

type PendingRequest = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  timer: ReturnType<typeof setTimeout>;
};

interface RequestMessage {
  id: number;
  type: "request-from-child";
  data: {
    action: string;
    payload?: any;
  };
}

interface ReplyMessage {
  id: number;
  type: "reply-to-child";
  data: any;
}

export default class IframeMessengerChild {
  private targetOrigin: string;
  private timeout: number;
  private requestId = 0;
  private pendingRequests: Map<number, PendingRequest> = new Map();

  constructor(targetOrigin: string = "*", timeout: number = 5000) {
    this.targetOrigin = targetOrigin;
    this.timeout = timeout;

    window.addEventListener("message", (event: MessageEvent) => {
      if (this.targetOrigin !== "*" && event.origin !== this.targetOrigin) return;

      const { id, type, data } = event.data as ReplyMessage;
      if (type === "reply-to-child" && this.pendingRequests.has(id)) {
        const { resolve, timer } = this.pendingRequests.get(id)!;
        clearTimeout(timer);
        resolve(data);
        this.pendingRequests.delete(id);
      }
    });
  }

  /**
   * 子页面调用父页面方法
   * @param action - 调用的父页面方法名
   * @param payload - 传递给父页面的数据
   * @returns 父页面返回的数据
   */
  public callParent<T = any>(action: string, payload?: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const id = ++this.requestId;

      // 设置超时
      const timer = setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          reject(new Error("Timeout: no response from parent"));
          this.pendingRequests.delete(id);
        }
      }, this.timeout);

      this.pendingRequests.set(id, { resolve, reject, timer });

      const message: RequestMessage = {
        id,
        type: "request-from-child",
        data: { action, payload },
      };

      window.parent.postMessage(message, this.targetOrigin);
    });
  }
}
