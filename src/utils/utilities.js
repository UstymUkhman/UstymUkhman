const removeDatGui = () => {
  const guis = document.querySelectorAll('.dg.ac')

  for (let g = 1; g < guis.length; g++) {
    guis[g].remove()
  }
}

export { removeDatGui }
