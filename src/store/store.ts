export const statusBarConfig: any = {
    data: [{
      kind: 'Total',
      size: '',
      value: 0,
    }],
    xField: 'value',
    yField: 'line',
    seriesField: 'kind',
    isPercent: true,
    isStack: true,
    legend: true,
    height: 80,
    animation: {
      appear: {
        animation: 'zoom-in',
        duration: 500,
      },
      update: {
        animation: 'position-update',
        duration: 200,
      },
      enter: {
        animation: 'zoom-in',
        duration: 0,
      },
      leave: {
        animation: 'zoom-out',
        duration: 0,
      },
    },
    barWidthRatio: 1
  };
