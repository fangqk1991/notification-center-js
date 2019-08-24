class DummyObservable {
  mName: string
  mList: any[]

  constructor(name: string) {
    this.mName = name;
    this.mList = [];
  }

  addObserver(observer: Function) {
    if (typeof (observer) !== 'function') {
      throw new Error('observer must be a function')
    }

    for (let i = 0, max = this.mList.length; i < max; ++i) {
      if (this.mList[i] === observer) {
        return;
      }
    }

    this.mList.push(observer);
  }

  removeObserver(observer: Function) {
    for (let i = 0, max = this.mList.length; i < max; ++i) {
      if (this.mList[i] === observer) {
        this.mList.splice(i, 1);
        break;
      }
    }
  }

  notifyObservers(object: any) {
    for (let i = 0, max = this.mList.length; i < max; ++i) {
      let observer = this.mList[i];
      observer && observer(object);
    }
  }
}

let _instance: any

export class NotificationCenter {
  mObservables: any = {}

  addObserver(notification: string, observer: Function) {
    let observable = this.mObservables[notification];
    if (observable === undefined) {
      observable = new DummyObservable(notification);
      this.mObservables[notification] = observable;
    }

    observable.addObserver(observer);
  }

  removeObserver(notification: string, observer: Function) {
    let observable = this.mObservables[notification];
    if (observable !== undefined) {
      observable.removeObserver(observer);
    }
  }

  postNotification(notification: string, object: any) {
    let observable = this.mObservables[notification];
    if (observable !== undefined) {
      observable.notifyObservers(object);
    }
  };

  static defaultCenter() {
    if (!_instance) {
      _instance = new NotificationCenter()
    }
    return _instance as NotificationCenter
  }
}
