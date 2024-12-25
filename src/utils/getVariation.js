import barcodeGenerator from './barcodeGenerator';

export const getVariations = (value, product) => {
  var values = [];
  value.forEach((data) => {
    values.push(data.values);
  });
  var options = combineOptions(values);
  var variations = [];
  options.forEach((option) => {
    const option_names = option.split(',');
    const selectedOptions = [];
    option_names.forEach((name) => {
      var obj = {
        name,
      };
      selectedOptions.push(obj);
    });

    var array = {
      name: '',
      regular_price: product.regular_price,
      sale_price: product.sale_price,
      barcode: barcodeGenerator('YV36'),
      is_tracking: true,
      selectedOptions,
      cost_per_item: product.cost_per_item,
      margin: product.margin,
      profit: product.profit,
      number_of_stock: '1',
      sold_out: '0',
      threshold_stock: '0',
      image: '/assets/img/default.png',
    };
    array.name = option.replace(/,/g, ' / ');
    variations.push(array);
  });
  return variations;
};

export const getInitialVariation = (product) => {
  var options = [];
  product.options.forEach((option) => {
    var array = {
      option_name: option.name,
      name: '',
      is_new_item: true,
    };
    options.push(array);
  });
  var variation = {
    name: '',
    regular_price: product.regular_price,
    sale_price: product.sale_price,
    barcode: barcodeGenerator('YV36'),
    is_tracking: true,
    options,
    cost_per_item: product.cost_per_item,
    margin: product.margin,
    profit: product.profit,
    number_of_stock: '1',
    sold_out: '0',
    threshold_stock: '0',
    image: '/assets/img/default.png',
  };

  return variation;
};

const combineOptions = (args) => {
  var r = [];
  var max = args.length - 1;
  function helper(arr, i) {
    if (args.length > 0) {
      for (var j = 0, l = args[i].length; j < l; j += 1) {
        var a = arr.slice(0); // clone arr
        a.push(args[i][j]);
        if (i === max) r.push(a.toString());
        else helper(a, i + 1);
      }
    }
  }
  helper([], 0);
  return r;
};
