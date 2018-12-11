// 类似计算数据，根据state的数据，筛选或者暴露一格新数据

const getters = {
  nowMessageList: (state) => {
    let list = state.nowMessageList;
    return list
  },
  getLanguage: (state) => {
    let num = state.languageSign;
    return num
  }
}

export default getters
