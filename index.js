const { origin } = new URL(import.meta.url)
const mods = {} 

export function hotmods (opts, listener) {
  if (!global.Pear) return

  const { updates } = global.Pear

  if (typeof opts === 'function') {
    listener = opts
    opts = {}
  }
  if (typeof listener !== 'function') {
    throw new Error('pear-hotmods: Supply a listener function')
  }
  const { paths = [] }  = opts

  updates(async ({ diff }) => {
    for (const key of diff) {
      if (key.endsWith('.js') === false) continue
      if (paths?.length && paths.some((path) => key.startsWith(path)) === false) continue
      
      mods[key] = mods[key] || {
        original: null,
        previous: null,
        next: null,
        reloads: null
      }
      mods[key].original = mods[key].original || await import(origin + key + '+app+esm')
      mods[key].previous = mods[key].next || mods[key].original
      try {
        mods[key].next = await import(origin + key + `?refresh=${Date.now()}+app+esm`)
      } catch (err) {
        console.error('Error live-reloading', key, err)
      }
      mods[key].reloads = Array.from(new Set(Object.keys(mods[key].original)
        .concat(Object.keys(mods[key].previous))))
        .map((name) => ({
          original: mods[key].original[name],
          previous: mods[key].previous[name],
          next: mods[key]?.next[name]
        }))
    }
    
    const reloads = Array.from(new Set(Object.values(mods).reduce((reloads, hotmod) => {
      reloads.push(...hotmod.reloads)
      return reloads
    }, [])))

    await listener(reloads)
  })
}


export default hotmods
