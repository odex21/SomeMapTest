interface some {
  [propName: string]: any;
}

const animate = (object: some, time: number, to: some, loop = true) => {
  let start: number
  let saveTime = 0
  let run = true
  let face = -1
  let times = 0
  let backup = Object.assign({}, object)
  const de = Object.fromEntries(Object.keys(to).map(k => {
    const v = to[k] - object[k]
    return [k, { v: Math.abs(v), face: v > 0 }]
  }))

  return new Promise((resolve, reject) => {

    const auto = (timeStamp: number) => {
      if (!start) start = timeStamp;
      const progress = timeStamp - start + saveTime;

      if (!run) {
        resolve(progress);
        return;
      }

      Object.entries(de).forEach(([k, { v, face }]) => {
        object[k] = face ? backup[k] + (v * progress / time)
          : backup[k] - (v * progress / time)
      })

      if (progress < time) {
        requestAnimationFrame(auto);
      } else {
        if (loop) {
          // console.log('sfsd', backup, to)
          backup = Object.assign({}, object)
          start = timeStamp
          Object.keys(de).forEach(k => de[k].face = !de[k].face)

          requestAnimationFrame(auto)
        } else {
          console.log('sfsd', backup, to)
          resolve();
        }
      }
    };
    requestAnimationFrame(auto)
  })
}

export {
  animate
}
