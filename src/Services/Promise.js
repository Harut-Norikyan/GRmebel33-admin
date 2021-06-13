class PromiseService {

  static storageSetItem = (key, value) => {
    return new Promise((resolve, reject) => {
      if (!key && !value) return;
      localStorage.setItem(key, value);
      var data = localStorage.getItem(key);
      data ? resolve(data) : reject()
    })
  };

}

export default PromiseService;