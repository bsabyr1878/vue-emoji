export default (context) => {
  context.store.commit('updatePage', context.route.name)
}
