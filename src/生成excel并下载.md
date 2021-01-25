# 生成 excel 并下载

```js
import axios from 'axios';

axios.get(url, {
  responseType: 'blob',
  params,
}).then(({ data }) => {
  const link = document.createElement('a');
  link.setAttribute('style', 'display: none');
  link.href = URL.createObjectURL(data);
  link.download = '下载.csv';
  link.click();
})
```
