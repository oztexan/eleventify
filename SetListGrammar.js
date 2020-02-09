
module.exports = function (source) {
  const value = {
    songs: source.split('\n').reduce((accumulator, currentValue, index) => {
      return (index && currentValue) ? accumulator.concat(currentValue) : accumulator;
    }, [])
  };

  return value;
}
