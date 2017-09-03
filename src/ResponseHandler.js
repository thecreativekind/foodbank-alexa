module.exports = {
  ProductsIntent (town, data) {
    if (data.length == 1) {
      return {
        emitter: ':tell',
        text: town + ' food bank urgently need ' + JSON.parse(data[0].products).join(', ')
      }
    }

    let towns = data.map(bank => bank.name)

    return {
      emitter: ':ask',
      text: `There are ${data.length} foodbanks that match ${town}, which one would you like to find information about? ${towns.join(', ')}`
    }
  }
}
