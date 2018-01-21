import * as usersService from '../services/users';

const queryString = require('query-string');

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    page: null
  },
  reducers: {
    save(state, {payload: {data: list, total, page}}) {
      return {...state, list, total, page};
    },
  },
  effects: {
    *fetch({payload: {page = 1}}, {call, put}) {
      const {data, headers} = yield call(usersService.fetch, {page});
      yield put({
        type: 'save',
        payload: {data, total: parseInt(headers['x-total-count'], 10), page: parseInt(page, 10)}
      });
    },
    *remove({ payload: id }, { call, put, select }) {
      yield call(usersService.remove, id);
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname}) => {
        if (pathname === '/') {
          dispatch({type: 'fetch', payload: {}});
        }
      });
    },
  },
};