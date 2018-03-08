import dva, {connect} from 'dva';
import React from 'react';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import styles from './index.less';
import LeftAside from './components/LeftAside/LeftAside';
import RightAside from './components/RightAside/RightAside';
import ItemList from './components/ItemList/ItemList';
import createLoading from 'dva-loading';

// 1. Initialize
const app = dva();

// 2. Plugins
app.use(createLoading());

// 3. Model
// app.model(require('./models/example'));
// app.model(require("./models/users"));
app.model(require("./models/item"));

// // 4. Router
app.router(() => <LocaleProvider locale={zhCN}>
  <div className={styles.body}>
    <header>
    </header>
    <aside className={styles.left}>
      <LeftAside/>
    </aside>
    <main>
      <ItemList/>
      <footer>
      </footer>
    </main>
    <aside className={styles.right}>
      <RightAside/>
    </aside>
  </div>
</LocaleProvider>);

// 5. Start
app.start('#root');
