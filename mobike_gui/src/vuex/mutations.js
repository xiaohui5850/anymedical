// vuex中state的数据只能被mutations方法所更改
const mutations = {
  // 对话
  addDialog: (state,obj) => {
    state.nowMessageList.push(obj);
    var str = JSON.stringify(state.nowMessageList);
    localStorage.setItem("allDialogData",str);
  },
  // 对话
  changeLanguage: (state,obj) => {
    state.languageSign = obj;
  },
}
export default mutations
