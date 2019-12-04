const setOption = (option: Options, target: any) => {
  Object.keys(option).forEach(e => {
    if (option[e])
      target[e] = option[e]
  })
}

export {
  setOption
}
